import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OrdersDashboardService} from "@app/pages/orders/orders-dashboard/orders-dashboard.service";
import {OrdersDashboardFilterSettingsService} from "@app/pages/orders/orders-dashboard/orders-dashboard-filter-settings.service";
import {ChartResults} from "@app/core/models";
import {ApiService} from "@app/core/services/api.service";
import {Subject} from "rxjs/Subject";
import {takeUntil} from "rxjs/operators/takeUntil";
import {forkJoin} from "rxjs/observable/forkJoin";
import {isNullOrUndefined} from "util";
import {Observable} from "rxjs/Observable";
import {filter} from "rxjs/operators/filter";
import {distinctUntilChanged} from "rxjs/operators/distinctUntilChanged";
import {debounceTime} from "rxjs/operators/debounceTime";
import {switchMap} from "rxjs/operators/switchMap";
import {map} from "rxjs/operators/map";
import {finalize} from "rxjs/operators/finalize";
import {delay} from "rxjs/operators/delay";
import {startWith} from "rxjs/operators/startWith";
import * as moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  selector: 'pkz-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class OrdersDashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  isPageLoaded = false;
  filterFormSettings$;
  filtersObj: any = {};
  datepickerModelFrom: Date;
  datepickerModelTo: Date;
  rangeModel = 1;
  xAxisLabel: string;
  yAxisLabel: string;
  colorScheme: any;
  monthsChartResults: ChartResults[];
  dashboardData: any = {};
  topOrderLocations = [];
  chartData = [];
  storesTypeahead$ = new Subject<string>();
  storesLoading = false;
  stores$: Observable<any>;
  store: any;
  storeId: string;
  dateFrom = moment(new Date()).format(DATE_FORMAT);
  dateTo = moment(new Date()).add(1, "days").format(DATE_FORMAT);
  customRange = false;
  yScaleMax: number;

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private service: OrdersDashboardService,
    private filterSettingsService: OrdersDashboardFilterSettingsService,
  ) {
  }

  ngOnInit() {
    this.initFiltersData();
    this.loadData(() => {
      this.searchForStores()
    });
  }

  private searchForStores() {
    this.stores$ = this.storesTypeahead$
      .pipe(
        filter((keyword: any) => keyword.trim().length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(keyword => {
          this.storesLoading = true;
          this.cd.detectChanges();
          return this.service.searchAdsStoreList(keyword).pipe(
            map((items) => this.getDefaultStores().concat(items)),
            finalize(() => this.storesLoading = false)
          );
        }),
        delay(800),
        startWith(this.getDefaultStores())
      );
  }

  public onRangeChange() {
    this.customRange = false;
    this.cd.detectChanges();
    switch (this.rangeModel) {
      case 1: {
        this.dateFrom = moment(new Date()).format(DATE_FORMAT);
        this.dateTo = moment(new Date()).add(1, "days").format(DATE_FORMAT);
        this.loadData(null);
        return;
      }
      case 2: {
        this.dateFrom = moment(new Date()).subtract(7, "days").format(DATE_FORMAT);
        this.dateTo = moment(new Date()).format(DATE_FORMAT);
        this.loadData(null);
        return;
      }
      case 3: {
        this.dateFrom = moment(new Date()).subtract(30, "days").format(DATE_FORMAT);
        this.dateTo = moment(new Date()).format(DATE_FORMAT);
        this.loadData(null);
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
      this.loadData(null);
    }
  };

  public onStoreChange(storeId) {
    if (storeId && storeId !== '1') {
      this.storeId = storeId;
    } else {
      this.storeId = null;
    }
    this.loadData(null);
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
    this.filtersObj = this.service.getInitFiltersData();
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.loadData(null);
  }

  private loadData(callback) {
    const queryObj = {
      ...this.service.getFiltersObj(this.filtersObj),
      filter_date: {
        from: this.dateFrom,
        to: this.dateTo
      }
    };
    if (this.storeId) {
      queryObj['store_id'] = this.storeId;
    }
    forkJoin([
      this.service.getOrderStatus(queryObj),
      this.service.getCustomerStatus(queryObj),
      this.service.getTopOrderLocations(queryObj),
      this.service.getGraphData(queryObj)
    ])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        this.dashboardData = {...response[0].data[0], ...response[1].data[0]};
        this.topOrderLocations = response[2].data;
        this.chartData = response[3].data;
        this.setMonthChartData(response[3].data);
        this.yScaleMax = Math.max(...response[3].data.map(a => a.total_orders)) * 2;
        this.isPageLoaded = true;
        this.cd.detectChanges();
        if (callback) {
          callback();
        }
      });
  }

  private getPercent(propName, group) {
    // group === 1 : orders count
    // group === 2 : device type
    // group === 3 : payment type
    // group === 4 : customer-status-1
    // group === 5 : customer-status-2
    switch (group) {
      case 1: {
        if (propName === 'delivered') {
          return ((this.dashboardData['delivered'] / this.dashboardData['total_orders']) * 100).toFixed(1);
        } else if (propName === 'cancelled') {
          return ((this.dashboardData['cancelled'] / this.dashboardData['total_orders']) * 100).toFixed(1);
        } else return
      }
      case 2: {
        const total = this.dashboardData['order_source_ios'] + this.dashboardData['order_source_android'] + this.dashboardData['order_source_desktop'];
        if (total === 0) return 0.0;
        if (propName === 'order_source_ios') {
          return ((this.dashboardData['order_source_ios'] / total) * 100).toFixed(1);
        } else if (propName === 'order_source_android') {
          return ((this.dashboardData['order_source_android'] / total) * 100).toFixed(1);
        } else if (propName === 'order_source_desktop') {
          return ((this.dashboardData['order_source_desktop'] / total) * 100).toFixed(1);
        } else return;
      }
      case 3: {
        if (propName === 'cod_payment') {
          return ((this.dashboardData['cod_payment'] / this.dashboardData['total_payment']) * 100).toFixed(1);
        } else if (propName === 'online_payment') {
          return ((this.dashboardData['online_payment'] / this.dashboardData['total_payment']) * 100).toFixed(1);
        } else return
      }
      case 4: {
        const total = this.dashboardData['new_customers'] + this.dashboardData['repeated_users'];
        if (total === 0) return 0.0;
        if (propName === 'new_customers') {
          return ((this.dashboardData['new_customers'] / total) * 100).toFixed(1);
        } else if (propName === 'repeated_users') {
          return ((this.dashboardData['repeated_users'] / total) * 100).toFixed(1);
        } else return
      }
      case 5: {
        const total = this.dashboardData['happy_customers'] + this.dashboardData['satisfied_customers'] + this.dashboardData['disappointed_customers'];
        if (total === 0) return 0.0;
        if (propName === 'happy_customers') {
          return ((this.dashboardData['happy_customers'] / total) * 100).toFixed(1);
        } else if (propName === 'satisfied_customers') {
          return ((this.dashboardData['satisfied_customers'] / total) * 100).toFixed(1);
        } else if (propName === 'disappointed_customers') {
          return ((this.dashboardData['disappointed_customers'] / total) * 100).toFixed(1);
        } else return
      }
    }
  }


  private initMonthChartData(data) {
    this.xAxisLabel = 'Month';
    this.yAxisLabel = 'Orders';
    this.monthsChartResults = Object.values(data);

    this.colorScheme = {domain: ['#2196f3']};
  }

  public setMonthChartData(data) {
    const chartData = {};
    data.forEach((item, index) => {
      chartData[index + 1] = {
        value: item.total_orders,
        name: index,
      };
    });
    this.initMonthChartData(chartData);
  }

  public getChartElementByIndex(index) {
    return this.chartData[index];
  }

  public get dashboardDataEmpty() {
    return Object.values(this.dashboardData).length === 0;
  }

  public checkIfExist(prop) {
    return !isNullOrUndefined(prop);
  }

  private getDefaultStores() {
    const stores = [{
      _id: '1',
      display_name: 'All'
    }];

    return stores;
  }

  public get graphLabel() {
    if (this.customRange && this.datepickerModelFrom && this.datepickerModelTo) {
      return `${this.dateFrom} - ${this.dateTo}`;
    } else {
      if (this.rangeModel === 1) {
        return 'Today status'
      } else if (this.rangeModel === 2) {
        return 'Last 7 days Status';
      } else return 'Last 30 days Status'
    }
  };

  public formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
