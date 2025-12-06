import {Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {filter} from 'rxjs/operators/filter';
import {distinctUntilChanged} from 'rxjs/operators/distinctUntilChanged';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {switchMap} from 'rxjs/operators/switchMap';
import {map} from 'rxjs/operators/map';
import {finalize} from 'rxjs/operators/finalize';
import {delay} from 'rxjs/operators/delay';
import {startWith} from 'rxjs/operators/startWith';
import {OrdersListService} from '@app/pages/orders/orders-list/orders-list.service';
import {SubscriptionTableService} from '@app/pages/orders/subscription/subscription-table.service';

@Component({
  selector: 'pkz-subscription-table-filter',
  templateUrl: './subscription-table-filter.component.html',
  styleUrls: ['./subscription-table-filter.component.scss']
})
export class SubscriptionTableFilterComponent implements OnInit {
  @Input('settings') settings;
  @Input('type2') type2: boolean;
  @Input('status') status: number;

  filtersObj: any = {};
  storesTypeahead$ = new Subject<string>();
  storesLoading = false;
  stores$: Observable<any>;
  store: any;
  storeId: string;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();

  constructor(private service: SubscriptionTableService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.searchForStores();
    this.filtersObj = this.service.getInitFiltersData(this.status);
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

  public onFilter(filtersObj) {
    this.onFilterChange.emit({filtersObj, storeId: this.storeId});
  }

  public onStoreChange(storeId) {
    if (storeId && storeId.toString() !== '1') {
      this.storeId = storeId;
    } else {
      this.storeId = null;
    }
    this.onFilterChange.emit({filtersObj: this.filtersObj, storeId: this.storeId});
  }

  private getDefaultStores() {
    const stores = [{
      _id: '1',
      display_name: 'All'
    }];

    return stores;
  }
}
