import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PaginationPage} from "@app/core/models";
import {takeUntil} from "rxjs/operators/takeUntil";
import {Subject} from "rxjs/Subject";
import {DeliveryAssistantsService} from "@app/pages/orders/delivery-assistants/delivery-assistants.service";
import {skip} from "rxjs/operators/skip";
import {StorageService} from "@app/core/services/storage.service";
import {ALL_DELIVERY_ASSISTANTS, ONLINE_DELIVERY_ASSISTANTS} from "@app/core/constants";
import {DeliveryAssistantsFilterSettingsService} from "@app/pages/orders/delivery-assistants/delivery-assistants-filter-settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'pkz-delivery-assistants-table',
  templateUrl: './delivery-assistants-table.component.html',
  styleUrls: ['./delivery-assistants-table.component.scss']
})
export class DeliveryAssistantsTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public onlineAssistantsType = ONLINE_DELIVERY_ASSISTANTS;
  public allAssistantsType = ALL_DELIVERY_ASSISTANTS;

  @Input('isOnline') isOnline: boolean;
  @Input('type') type: string;

  isPageLoaded = false;
  page: PaginationPage;
  rows: any[];
  filtersObj: any = {};

  constructor(private _deliveryAssistantsService: DeliveryAssistantsService,
              private filterSettingsService: DeliveryAssistantsFilterSettingsService,
              private storage: StorageService,
              private route: ActivatedRoute,
              private router: Router,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.filtersObj = this._deliveryAssistantsService.getInitFiltersData();
    this.handleRowsLimit();
    this.resetPageOffset();
    this.filterSettingsService.onFilterChange()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(filterObj => {
        this.filtersObj = filterObj;
        this.loadTableData();
      })
  }

  private loadTableData() {
    const queryObj = {
      ...this._deliveryAssistantsService.getFiltersObj(this.filtersObj),
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit,
    };
    if (this.type === ONLINE_DELIVERY_ASSISTANTS) {
      this._deliveryAssistantsService.getOnlineAssistants(queryObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
          this.page.count = data.count;
          this.initPage(data);
          this.isPageLoaded = true;
          this.cd.markForCheck();
        });
    } else {
      this._deliveryAssistantsService.getAllAssistants(queryObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
          this.page.count = data.count;
          this.initPage(data);
          this.isPageLoaded = true;
          this.cd.markForCheck();
        });
    }
  }

  public onRowClicked(event) {
    if (event && event.type === 'click') {

      let route = event.row._id;

      if(this.type === this.onlineAssistantsType) {
        route = `${event.row._id}/${event.row.order_id}`;
      }

      this.router.navigate([route], {relativeTo: this.route});
    }
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
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

  getActionIcon(assistant) {
    if (this.type === ONLINE_DELIVERY_ASSISTANTS) {
      switch (assistant.status.toString().toLowerCase()) {
        case 'idle':
          return `fa fa-check-circle green-check`;
        case 'engaged':
          return `fa fa-check-circle blue-check`;
        case 'offline':
          return `fa fa-check-circle grey-check`;
      }
    } else {
      switch (assistant.setting.status) {
        case 0:
          return `../../../../../assets/images/mail.png`;
        case 1:
          return `../../../../../assets/images/check.png`;
        case 2:
          return `../../../../../assets/images/reject.png`;
        case 3:
          return `../../../../../assets/images/suspended.png`;
        case 4:
          return `../../../../../assets/images/resign.png`;
        case 5:
          return `../../../../../assets/images/terminated.png`;
      }
    }
  }

  public getMobileNumber(mobile) {
    return `+${mobile.dialing_code} ${mobile.number}`;
  }

  getStatus(assistant) {
    if (isNullOrUndefined(assistant.delivery.status)) {
      return 'Offline';
    }
    switch (assistant.setting.status) {
      case 0:
        return 'Idle';
      case 1:
        return 'Engaged';
    }
  }

  getDeliveryStatusById(deliveryStatusId) {
    switch (deliveryStatusId) {
      case 0:
        return 'Assigned';
      case 1:
        return 'Started';
      case 2:
        return 'Reached';
      case 3:
        return 'Shipping';
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
