import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {OrdersListFilterSettingsService} from "@app/pages/orders/orders-list/orders-list-filter-settings.service";
import {OrdersListService} from "@app/pages/orders/orders-list/orders-list.service";

const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  selector: 'pkz-cancelled-orders',
  templateUrl: './cancelled-orders.component.html',
  styleUrls: ['./cancelled-orders.component.scss']
})
export class CancelledOrdersComponent implements OnInit {

  isPageLoaded = false;
  filterFormSettings$;
  dateFrom = moment(new Date()).format(DATE_FORMAT);
  dateTo = moment(new Date()).add(1, "days").format(DATE_FORMAT);
  customRange = false;
  rangeModel = 1;
  datepickerModelFrom: Date;
  datepickerModelTo: Date;
  filtersObj: any = {};
  storeId: string;

  constructor(private filterSettingsService: OrdersListFilterSettingsService,
              private cd: ChangeDetectorRef,
              private _orderListService: OrdersListService) {
  }

  ngOnInit() {
    this.filtersObj = this._orderListService.getInitFiltersData(5);
    this.initFiltersData();
  }

  public onRangeChange() {
    this.customRange = false;
    this.cd.detectChanges();
    switch (this.rangeModel) {
      case 1: {
        this.dateFrom = moment(new Date()).format(DATE_FORMAT);
        this.dateTo = moment(new Date()).add(1, "days").format(DATE_FORMAT);
        this.loadData();
        return;
      }
      case 2: {
        this.dateFrom = moment(new Date()).subtract(7, "days").format(DATE_FORMAT);
        this.dateTo = moment(new Date()).format(DATE_FORMAT);
        this.loadData();
        return;
      }
      case 3: {
        this.dateFrom = moment(new Date()).subtract(30, "days").format(DATE_FORMAT);
        this.dateTo = moment(new Date()).format(DATE_FORMAT);
        this.loadData();
        return;
      }
    }
  }

  public setCustomRange() {
    this.rangeModel = 0;
    this.cd.detectChanges();
    this.customRange = !this.customRange;
    this.onDateChange();
  }

  public onDateChange(a?, from?) {
    const fromDate = (from && a) ? a : this.datepickerModelFrom;
    const toDate = (from || !a) ? this.datepickerModelTo : a;
    if (fromDate && toDate && this.customRange) {
      this.dateFrom = moment(fromDate).format(DATE_FORMAT);
      this.dateTo = moment(toDate).format(DATE_FORMAT);
      this.loadData();
    }
  };

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettingsType2();
  }

  onFilter({filtersObj, storeId}) {
    this.filtersObj = filtersObj;
    this.storeId = storeId;
    const filter_date = {
      from: this.dateFrom,
      to: this.dateTo
    };
    this._orderListService.filterChanged({...filtersObj, store_id: storeId, filter_date});
  }

  private loadData() {
    const filter_date = {
      from: this.dateFrom,
      to: this.dateTo
    };
    this._orderListService.filterChanged({...this.filtersObj, store_id: this.storeId, filter_date});
  }
}
