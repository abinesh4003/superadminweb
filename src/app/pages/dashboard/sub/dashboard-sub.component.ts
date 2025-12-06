import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  InventorySkuSubPermissionsConstants,
  InventoryUpcSubPermissionsConstants
} from '@app/pages/dashboard/sub/inventory/inventory-sub-permissions.constants';
import { OrdersSubPermissionsConstants } from '@app/pages/dashboard/sub/orders/orders-sub-permissions.constants';
// import { OverviewSubPermissionsConstants } from '@app/pages/dashboard/sub/overview/overview-sub-permissions.constants';
import {
  RefundSubPermissionsConstants,
  ReplacementSubPermissionsConstants
} from '@app/pages/dashboard/sub/refund-replacement/refund-replacement-sub-permissions.constants';
import { SettingsSubPermissionsConstants } from '@app/pages/dashboard/sub/settings/settings-sub-permissions.constants';
import { ShopsSubPermissionsConstants } from '@app/pages/dashboard/sub/shops/shops-sub-permissions.constants';
import { PagesService } from '@app/pages/pages.service';
import { AppState } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import * as dashboard from 'app/store/actions/dashboard.actions';
import { StorageService } from '@app/core/services/storage.service';

@Component({
  selector: 'pkz-dashboard-sub',
  templateUrl: 'dashboard-sub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSubComponent implements OnInit, OnDestroy {
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagesService: PagesService,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (!id) {
        return;
      }

      this.store.dispatch(new dashboard.ChangeSubCategoryId(id));
      this.initTabs();
      this.cd.markForCheck();
      console.log(this.storage.getUserDetails().privileges);
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new dashboard.ResetSubCategoryId());
  }

  private initTabs(): void {
    const url = this.pagesService.getComponentRoute(this.activatedRoute);
    const tabsData = [{
      // TODO: uncomment once section will be implemented
      // title: 'Overview',
      // route: 'overview',
      // skip: !this.pagesService.hasPermissions(OverviewSubPermissionsConstants.PATH)
    // }, {
      title: 'UPC Inventory',
      route: 'upc',
      skip: !this.pagesService.hasPermissions(InventoryUpcSubPermissionsConstants.PATH)
    }, {
      title: 'SKU Inventory',
      route: 'sku',
      skip: !this.pagesService.hasPermissions(InventorySkuSubPermissionsConstants.PATH)
    }, {
      title: 'Shops',
      route: 'shops',
      skip: !this.pagesService.hasPermissions(ShopsSubPermissionsConstants.PATH)
    }, {
      title: 'Orders',
      route: 'orders',
      skip: !this.pagesService.hasPermissions(OrdersSubPermissionsConstants.PATH)
    }, {
      title: 'Refund/Replacement',
      route: 'refund-replacement',
      skip: !this.pagesService.hasPermissions(RefundSubPermissionsConstants.PATH) ||
        !this.pagesService.hasPermissions(ReplacementSubPermissionsConstants.PATH)
    // TODO: uncomment once section will be implemented
    // }, {
    //   title: 'Customer messages',
    //   route: 'messages',
    //   skip: false
    }, {
      title: 'Settings',
      route: 'settings',
      skip: !this.pagesService.hasPermissions(SettingsSubPermissionsConstants.PATH)
    }]
      .filter(item => !item.skip);

    this.tabs = this.pagesService.getRoutedTabsData(tabsData, url);
  }

}
