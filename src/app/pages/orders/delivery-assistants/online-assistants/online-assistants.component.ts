import { Component, OnInit } from '@angular/core';
import {DeliveryAssistantsFilterSettingsService} from "@app/pages/orders/delivery-assistants/delivery-assistants-filter-settings.service";
import {ONLINE_DELIVERY_ASSISTANTS} from "@app/core/constants";

@Component({
  selector: 'pkz-online-assistants',
  templateUrl: './online-assistants.component.html',
  styleUrls: ['./online-assistants.component.scss']
})
export class OnlineAssistantsComponent implements OnInit {
  public type = ONLINE_DELIVERY_ASSISTANTS;

  filtersObj: any = {};
  filterFormSettings$;

  constructor(private filterSettingsService: DeliveryAssistantsFilterSettingsService) { }

  ngOnInit() {
    this.initFiltersData();
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings(true);
  }

  public onFilter(filtersObj) {
    this.filterSettingsService.filterChanged(filtersObj);
  }
}
