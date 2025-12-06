import {Component, OnInit} from '@angular/core';
import {DeliveryAssistantsFilterSettingsService} from "@app/pages/orders/delivery-assistants/delivery-assistants-filter-settings.service";
import {ALL_DELIVERY_ASSISTANTS} from "@app/core/constants";

@Component({
  selector: 'pkz-assistants-list',
  templateUrl: './assistants-list.component.html',
  styleUrls: ['./assistants-list.component.scss']
})
export class AssistantsListComponent implements OnInit {
  public type = ALL_DELIVERY_ASSISTANTS;

  filtersObj: any = {};
  filterFormSettings$;

  constructor(private filterSettingsService: DeliveryAssistantsFilterSettingsService) {
  }

  ngOnInit() {
    this.initFiltersData();
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings(false);
  }

  public onFilter(filtersObj) {
    this.filterSettingsService.filterChanged(filtersObj);
  }
}
