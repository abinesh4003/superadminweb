import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FinanceManageOffersPermissionsConstants
} from '@app/pages/finance/offers/offers-permissions.constants';
import { PagesService } from '@app/pages/pages.service';

@Component({
  selector: 'pkz-offers',
  templateUrl: 'offers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersComponent implements OnInit {
  isPageLoaded = true;
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    const url = this.pagesService.getComponentRoute(this.activatedRoute);
    const tabsData = [{
      title: 'Manage Offers',
      route: 'manage',
      skip: !this.pagesService.hasPermissions(FinanceManageOffersPermissionsConstants .PATH)
    }]
      .filter(item => !item.skip);

    this.tabs = this.pagesService.getRoutedTabsData(tabsData, url);
  }
}
