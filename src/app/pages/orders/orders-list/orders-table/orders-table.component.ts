import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PaginationPage} from "@app/core/models";
import {takeUntil} from "rxjs/operators/takeUntil";
import {OrdersListService} from "@app/pages/orders/orders-list/orders-list.service";
import {StorageService} from "@app/core/services/storage.service";
import {OrdersService} from "@app/pages/orders/orders.service";
import {Subject} from "rxjs/Subject";
import * as moment from "moment";
import {skip} from "rxjs/operators/skip";
import {isNumber} from "util";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'pkz-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input('status') status: number;

  isPageLoaded = false;
  page: PaginationPage;
  rows: any[];
  filtersObj: any = {};

  constructor(private _orderListService: OrdersListService,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              private _ordersService: OrdersService,
              private storage: StorageService) {
  }

  ngOnInit() {
    this.filtersObj = this._orderListService.getInitFiltersData(this.status);
    this.handleRowsLimit();
    this.getOrdersCount();
    this.resetPageOffset();
    this._orderListService.onFilterChange()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(filterObj => {
        this.filtersObj = filterObj;
        this.getOrdersCount();
        this.loadTableData();
      })
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private getOrdersCount() {
    const queryObj = {
      ...this._orderListService.getFiltersObj(this.filtersObj),
      status: this.status
    };
    this._ordersService.getOrdersCount(queryObj)
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
      ...this._orderListService.getFiltersObj(this.filtersObj),
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit,
      status: this.status,
    };
    this._ordersService.getOrders(queryObj)
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
      const dateFormat = 'DD/MM/YYYY hh:mm A';
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

  public getSupportIconByStatus(order) {
    switch (order.status.toString()) {
      case '1': return this.getSupportIcon(order.ordered);
      case '2': return this.getSupportIcon(order.accepted);
      case '3': return this.getSupportIcon(order.ready_to_ship);
      case '4': return this.getSupportIcon(order.shipping);
      case '5': return this.getSupportIcon(order.delivered);
      case '6': return this.getSupportIcon(order.verified);
      case '7': return this.getSupportIcon(order.cancelled);
      case '8': return this.getSupportIcon(order.rejected);
      case '9': return this.getSupportIcon(order.denied);
    }
  }

  public getSupportIcon(value) {
    if (value && value.read_receipt && value.read_receipt.by) {
      return 'fa fa-envelope-open';
    } else {
      return 'fa fa-envelope'
    }
  };

  roundPrice(price) {
    return price.toFixed(2);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
