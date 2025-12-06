import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {privilegesToArray} from '@app/core/utils/privileges.helper';
import {AdminPermissionsConstants} from '@app/pages/admin/admin-permissions.constants';
import {BillingsPermissionsConstants} from '@app/pages/billings/billings-permissions.constants';
import {DashboardPermissionsConstants} from '@app/pages/dashboard/dashboard-permissions.constants';
import {FinancePermissionsConstants} from '@app/pages/finance/finance-permissions.constants';
import {MerchantsPermissionsConstants} from '@app/pages/merchants/merchants-permissions.constants';
import {OrdersPermissionsConstants} from '@app/pages/orders/orders-permissions.constants';
import {PromotionPermissionsConstants} from '@app/pages/promotion/promotion-permissions.constants';
import {ShopsPermissionsConstants} from '@app/pages/shops/shops-permissions.constants';
import * as SidebarActions from '@app/store/actions/sidebar.actions';
import {AppState} from '@app/store/root-reducer';
import {Store} from '@ngrx/store';
import {NgxPermissionsService} from 'ngx-permissions';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';

@Component({
  selector: 'pkz-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  hasMerchantsPermission$: Observable<boolean>;
  hasShopsPermission$: Observable<boolean>;
  hasBillingsPermission$: Observable<boolean>;
  hasOrdersPermission$: Observable<boolean>;
  hasAdminPermission$: Observable<boolean>;
  hasDashboardPermission$: Observable<boolean>;
  hasFinancePermission$: Observable<boolean>;
  hasPromotionPermission$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private permissionsService: NgxPermissionsService
  ) {
  }

  ngOnInit() {
    this.hasMerchantsPermission$ = this.hasPermission(MerchantsPermissionsConstants);
    this.hasShopsPermission$ = this.hasPermission(ShopsPermissionsConstants);
    this.hasBillingsPermission$ = this.hasPermission(BillingsPermissionsConstants);
    this.hasOrdersPermission$ = this.hasPermission(OrdersPermissionsConstants);
    this.hasAdminPermission$ = this.hasPermission(AdminPermissionsConstants);
    this.hasDashboardPermission$ = this.hasPermission(DashboardPermissionsConstants);
    this.hasFinancePermission$ = this.hasPermission(FinancePermissionsConstants);
    this.hasPromotionPermission$ = this.hasPermission(PromotionPermissionsConstants);
  }

  onToggleSidebar(): void {
    this.store.dispatch(new SidebarActions.Toggle());
  }

  private hasPermission(constants) {
    const permissions = privilegesToArray(constants);

    return fromPromise(this.permissionsService.hasPermission(permissions));
  }
}
