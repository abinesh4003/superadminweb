import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {filter} from "rxjs/operators/filter";
import {distinctUntilChanged} from "rxjs/operators/distinctUntilChanged";
import {debounceTime} from "rxjs/operators/debounceTime";
import {switchMap} from "rxjs/operators/switchMap";
import {finalize} from "rxjs/operators/finalize";
import {delay} from "rxjs/operators/delay";
import {startWith} from "rxjs/operators/startWith";
import {DeliveryAssistantsService} from "@app/pages/orders/delivery-assistants/delivery-assistants.service";

@Component({
  selector: 'pkz-delivery-assistants-filter-form',
  templateUrl: './delivery-assistants-filter-form.component.html',
  styleUrls: ['./delivery-assistants-filter-form.component.scss']
})
export class DeliveryAssistantsFilterFormComponent implements OnInit {
  @Input('settings') settings;
  @Input('isOnline') isOnline: boolean;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();

  merchants$: Observable<any>;
  merchantsTypeahead$ = new Subject<string>();
  merchantsLoading = false;
  merchant: any;

  filtersObj: any = {};

  constructor(private cd: ChangeDetectorRef, private deliveryAssistantService: DeliveryAssistantsService) {
  }

  ngOnInit() {
    this.searchForAgency();
    this.filtersObj = this.deliveryAssistantService.getInitFiltersData();
  }

  private searchForAgency() {
    this.merchants$ = this.merchantsTypeahead$
      .pipe(
        filter((keyword: any) => keyword.trim().length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(keyword => {
          this.merchantsLoading = true;
          this.cd.detectChanges();
          return this.deliveryAssistantService.searchAgencies(keyword).pipe(
            finalize(() => this.merchantsLoading = false)
          );
        }),
        delay(800),
        startWith([])
      );
  }

  public onFilter(filtersObj) {
    let merchantId = null;
    if (this.merchant && this.merchant) {
      merchantId = this.merchant;
    }
    this.onFilterChange.emit({...filtersObj, merchant: merchantId});
  }

  public onMerchantChange(merchant) {
    this.onFilterChange.emit({...this.filtersObj, merchant});
  }
}
