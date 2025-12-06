import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {PaginationPage} from '@app/core/models';
import {OrdersListService} from '@app/pages/orders/orders-list/orders-list.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrdersService} from '@app/pages/orders/orders.service';
import {StorageService} from '@app/core/services/storage.service';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {skip} from 'rxjs/operators/skip';
import * as moment from 'moment';
import {isNumber} from "util";
import {SubscriptionService} from '@app/pages/orders/subscription/subscription.service';
import {SubscriptionTableService} from '@app/pages/orders/subscription/subscription-table.service';
import {SUBSCRIPTIONS_STATUS_OPTION_ACTIVE, SUBSCRIPTIONS_STATUS_OPTION_PAUSE} from '@app/core/constants';
import {ConstantsService} from '@app/core/services/constants.service';


@Component({
  selector: 'pkz-subscription-table',
  templateUrl: './subscription-table.component.html',
  styleUrls: ['./subscription-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input('status') status: number;

  isPageLoaded = false;
  page: PaginationPage;
  rows: any[];
  filtersObj: any = {};

  constructor(private _subscriptionTableService: SubscriptionTableService,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              private _subscriptionService: SubscriptionService,
              private storage: StorageService,
              private constantsService: ConstantsService) {
  }

  ngOnInit() {
    this.filtersObj = this._subscriptionTableService.getInitFiltersData(this.status);
    this.handleRowsLimit();
    this.getSubscriptionsCount();
    this.resetPageOffset();
    this._subscriptionTableService.onFilterChange()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(filterObj => {
          this.filtersObj = filterObj;
          this.getSubscriptionsCount();
          this.loadTableData();
        })
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private getSubscriptionsCount() {
    const queryObj = {
      status: this.status,
      ...this._subscriptionTableService.getFiltersObj(this.filtersObj),
    };
    this._subscriptionService.getSubscriptionsCount(queryObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(count => {
          this.page.count = count;
          this.cd.markForCheck();
        });
  }

  public onRowClick(event) {
    if (event && event.type === 'click') {
      const order = event.row;
      this.router.navigate([order._id, 'details'], {relativeTo: this.route});
    }
  }

  private loadTableData() {
    const queryObj = {
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit,
      status: this.status,
      ...this._subscriptionTableService.getFiltersObj(this.filtersObj),
    };

    this._subscriptionService.getSubscription(queryObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
          this.initPage(data);
          this.isPageLoaded = true;
          this.cd.markForCheck();
        });
  }

  private initPage({data}): void {
    this.rows = data ? data : [];
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadTableData();
  }

  private handleRowsLimit() {
    this.page = new PaginationPage();
    this.page.setLimit(this.storage.getRowsPerPage());
    this.storage.observeRowsPerPage()
        .pipe(
            takeUntil(this.ngUnsubscribe),
            skip(1)
        )
        .subscribe(key => {
          this.page.setLimit(key);
          this.resetPageOffset();
        });
  }

  public getPreferredTime(value) {
    if (value.is_anytime) {
      return 'Immediately';
    } else {
      const dateFormat = 'DD/MM/YYYY hh:mm';
      return `${moment(value.custom_time.from).format(dateFormat)}  - ${moment(value.custom_time.to).format(dateFormat)}`
    }
  };

  public printDistance(value) {
    return isNumber(value) ? `${value.toFixed(2)} km` : value;
  }

  public getSource(value) {
    switch (value.toString()) {
      case '1':
        return 'iOS';
      case '2':
        return 'Android';
      case '3':
        return 'Desktop';
    }
  }

  public getPromo(value) {
    if (value.offerAmount) {
      const type = value.offer_type === 1 ? '(Cashback)' : '(Discount)';
      return `${value.offerAmount}${type}`
    } else return '0';
  }

  public getIsActiveAction(statusCode) {
    return statusCode === SUBSCRIPTIONS_STATUS_OPTION_ACTIVE;
  }

  public getStatus(statusCode) {
    return this.constantsService.getListByKey('').find(e => e.id === statusCode).name; // key should be dynamic
  }

  roundWalletAmount(price) {
    return price.toFixed(2);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
