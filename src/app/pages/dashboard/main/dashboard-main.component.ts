import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Dashboard } from '@app/core/models';
import { ChartResults } from '@app/core/models/common.models';
import { ApiService } from '@app/core/services/api.service';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-dashboard-main',
  templateUrl: 'dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMainComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  isPageLoaded = false;
  rangeModel = 1;
  datepickerModelFrom: Date;
  datepickerModelTo: Date;

  monthsChartResults: ChartResults[];
  locationChartResults: ChartResults[];
  xAxisLabel: string;
  yAxisLabel: string;
  colorScheme: any;

  dbData: Dashboard;

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.api.getDashboardData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.initPage(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initPage(data: Dashboard) {
    this.dbData = data;
    this.initDateForDatepicker();
    this.initMonthChartData(data.month_chart);
    this.initLocationChartData(data.location_chart);
  }

  private initDateForDatepicker() {
    this.datepickerModelFrom = new Date();
    this.datepickerModelTo = new Date();
  }

  private initMonthChartData(data) {
    this.xAxisLabel = 'Month';
    this.yAxisLabel = 'Orders';
    this.monthsChartResults = Object.values(data);

    this.colorScheme = {domain: ['#6ecf3d']};
  }

  private initLocationChartData(data) {
    this.locationChartResults = Object.values(data);
  }
}
