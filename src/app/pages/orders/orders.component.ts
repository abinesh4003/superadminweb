import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {privilegesToArray} from "@app/core/utils/privileges.helper";
import {
  DeliveryAssistantsAllPermissionsConstants, DeliveryAssistantsConstants,
  DeliveryAssistantsOnlinePermissionsConstants, OrdersALLPermissionsConstants,
  OrdersDashboardPermissionsConstants, SubscriptionConstants,
} from "@app/pages/orders/orders-permissions.constants";
import {SubscriptionService} from "@app/pages/orders/subscription/subscription.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'pkz-pages-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit, OnDestroy {
  showOrders = true;
  subscriptionsCount;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
      private cdr: ChangeDetectorRef,
      private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit() {
    this.getSubscriptionsCount();
    this.subscriptionService.refreshSubscriptionData$.pipe(
        takeUntil(this._unsubscribe)
    ).subscribe(() => this.updateOrders());
  }

  updateOrders() {
    this.showOrders = false;
    this.getSubscriptionsCount();

    setTimeout(() => {
      this.showOrders = true;
      this.cdr.detectChanges();
    }, 0);
  }

  getSubscriptionsCount(): void {
    this.subscriptionService
        .getSubscriptionsCount({status: 1, category_id:"All", location_name: 'All'})
        .subscribe(count => this.subscriptionsCount = count);
  }

  getOrdersDashboardPermissions() {
    return privilegesToArray(OrdersDashboardPermissionsConstants);
  }

  getOrderAllPermissions() {
    return privilegesToArray(OrdersALLPermissionsConstants);
  }

  getDeliveryAssistantsPermissions() {
    return privilegesToArray(DeliveryAssistantsConstants);
  }

  getSubscriptionPermissions() {
    return privilegesToArray(SubscriptionConstants);
  }

  ngOnDestroy(): void {

  }
}
