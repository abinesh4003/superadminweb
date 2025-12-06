import {Injectable} from '@angular/core';
import {PagesService} from "@app/pages/pages.service";
import {ConstantsService} from "@app/core/services/constants.service";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "@app/core/services/api.service";
import {ModalService} from "@app/shared/components/modal/modal.service";
import {mergeMap} from "rxjs/operators/mergeMap";
import {CancelOrderModalComponent} from "@app/pages/orders/cancel-order-modal/cancel-order-modal.component";
import {of} from "rxjs/observable/of";
import {ChangeOrderStatusConfirmationModalComponent} from "@app/pages/orders/change-order-status-confirmation-modal/change-order-status-confirmation-modal.component";
import {EditDeliveryTimeModalComponent} from "@app/pages/orders/edit-delivery-time-modal/edit-delivery-time-modal.component";
import {SupportCallLogModalComponent} from "@app/pages/orders/support-call-log-modal/support-call-log-modal.component";
import {ProductExpiryDetailsModalComponent} from "@app/pages/orders/product-expiry-details-modal/product-expiry-details-modal.component";
import {AcceptOrderModalComponent} from "@app/pages/orders/accept-order--modal/accept-order--modal.component";
import {AssignDeliveryBoyModalComponent} from "@app/pages/orders/assign-delivery-boy-modal/assign-delivery-boy-modal.component";
import {ReplacementProductModalComponent} from "@app/pages/orders/replacement-product-modal/replacement-product-modal.component";
import {ChangeOrderModalComponent} from "@app/pages/orders/change-order-modal/change-order-modal.component";
import {ImageViewerComponent} from "@app/pages/orders/image-viewer/image-viewer.component";
import {
  SUBSCRIPTIONS_TAB, UNSUBSCRIPTIONS_TAB
} from '@app/core/constants';
import {
  SubscriptionSubscriptionsPermissionsConstants, SubscriptionUnsubscriptionsPermissionsConstants
} from '@app/pages/orders/orders-permissions.constants';
import {OrderHistoryModalComponent} from '@app/pages/orders/order-history-modal/order-history-modal.component';
import {RechargeLogModalComponent} from '@app/pages/orders/recharge-log-modal/recharge-log-modal.component';
import {PauseSubscriptionConfirmationModalComponent} from '@app/pages/orders/pause-subscription-confirmation-modal/pause-subscription-confirmation-modal.component';
import {UnsubscribeConfirmationModalComponent} from '@app/pages/orders/unsubscribe-confirmation-modal/unsubscribe-confirmation-modal.component';
import {TransferAmountModalComponent} from '@app/pages/orders/transfer-amount-modal/transfer-amount-modal.component';
import {RechargeReminderModalComponent} from '@app/pages/orders/recharge-reminder-modal/recharge-reminder-modal.component';
import {EditStartDateModalComponent} from '@app/pages/orders/edit-start-date-modal/edit-start-date-modal.component';
import {PreferredDeliveryTimeModalComponent} from '@app/pages/orders/preferred-delivery-time-modal/preferred-delivery-time-modal.component';
import {Observable, Subject} from "rxjs";
import {concatMap} from 'rxjs/operators/concatMap';

@Injectable()
export class SubscriptionService {
    private _refreshSubscriptionDataSubject: Subject<void> = new Subject<void>();
    refreshSubscriptionData$: Observable<void> = this._refreshSubscriptionDataSubject.asObservable();

  constructor(
    private pagesService: PagesService,
    private constantsService: ConstantsService,
    private modalService: ModalService,
    private api: ApiService
  ) {
  }

  getTabs(route: ActivatedRoute, ordersCount) {
    const url = this.pagesService.getComponentRoute(route);

    const tabsData = this.constantsService
      .getListByKey('subscription_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case SUBSCRIPTIONS_TAB:
            permissions = SubscriptionSubscriptionsPermissionsConstants;
            break;
          case UNSUBSCRIPTIONS_TAB:
            permissions = SubscriptionUnsubscriptionsPermissionsConstants;
            break;
        }

        return {
          title: `${tab.name} (${ordersCount[tab.id].total})`, // +TODO (${ordersCount[tab.id].total}),
          route: tab.id,
          skip: !this.pagesService.hasPermissions(permissions.PATH)
        };
      })
      .filter(item => !item.skip);

    return this.pagesService.getRoutedTabsData(tabsData, url);
  }

  updateRefreshSubscriptionData(): void {
      this._refreshSubscriptionDataSubject.next();
  }

  getTabNameByRoute(route: ActivatedRoute) {
    return this.constantsService.getNameById(route.snapshot.parent.routeConfig.path, 'orders_list_tabs');
  }

  public getSubscription(queryObj) {
    return this.api.getSubscriptions(queryObj);
  }

  public getSubscriptionsCount(queryObj) {
    return this.api.getSubscriptionsCount(queryObj);
  }

  public getAllOrdersCount() {
    return this.api.getAllOrdersCount();
  }

  public getSubscriptionsInfo(id) {
    return this.api.getSubscriptionsInfo(id);
  }

  public getDeliveryAssistantInfo(assistant_id) {
    return this.api.getDeliveryAssistantInfo(assistant_id);
  }

  public getOrderContactInfo(id) {
    return this.api.getOrderContactInfo(id);
  }

  public cancelOrder(orderId, storeId, deliveryCharges, totalPrice, isOnlinePayment, withDelivery) {
    return this.modalService.open(CancelOrderModalComponent, {
      data: {
        deliveryCharges: deliveryCharges ? deliveryCharges : 0,
        totalPrice,
        withDelivery,
        isOnlinePayment
      }
    })
      .pipe(
        mergeMap(result => {
          let body = {
            ...result,
            order_id: orderId,
            shop_id: storeId
          };
          return this.api.cancelOrder(body);
        })
      );
  }

  public openDispatchOrderConfirmationModal(orderId, categoryId, storeId) {
    return this.modalService.open(ChangeOrderStatusConfirmationModalComponent, {data: {status: 'Dispatch'}}).pipe(
      mergeMap(a => {
        let body = {
          order_id: orderId,
          shop_id: storeId,
          category_id: categoryId
        };
        return this.api.dispatchOrder(body);
      })
    );
  }

  public openShipOrderConfirmationModal(orderId, categoryId, storeId) {
    return this.modalService.open(ChangeOrderStatusConfirmationModalComponent, {data: {status: 'Ship'}}).pipe(
      mergeMap(a => {
        let body = {
          order_id: orderId,
          shop_id: storeId,
          category_id: categoryId
        };
        return this.api.shipOrder(body);
      })
    );
  }

  public openAcceptOrderConfirmationModal(orderId, categoryId, storeId) {
    return this.modalService.open(AcceptOrderModalComponent).pipe(
      mergeMap(expectedTime => {
        let body = {
          order_id: orderId,
          shop_id: storeId,
          category_id: categoryId,
          expectedTime
        };
        return this.api.acceptOrder(body);
      })
    );
  }

  public openDeliverOrderConfirmationModal(orderId, categoryId, storeId) {
    return this.modalService.open(ChangeOrderStatusConfirmationModalComponent, {data: {status: 'Deliver'}}).pipe(
      mergeMap(a => {
        let body = {
          order_id: orderId,
          shop_id: storeId,
          category_id: categoryId
        };
        return this.api.deliverOrder(body);
      })
    );
  }

  public openEditDeliveryTimeModal(orderId, expectedDeliveryTime) {
    return this.modalService.open(EditDeliveryTimeModalComponent, {data: {expectedDeliveryTime}}).pipe(
      mergeMap(expectedTime => {
        let body = {
          order_id: orderId,
          expectedTime
        };
        return this.api.updateDeliveryTime(body);
      })
    );
  }

  public openSupportModal(subsId) {
    return this.modalService.open(SupportCallLogModalComponent, {data: {subsId}}).pipe(
      mergeMap(message => {
        let body = {
          subs_id: subsId,
          message
        };
        return this.api.sendSubsSupportMessage(body);
      })
    );
  }

  public openProductExpDatesModal(dates, productName) {
    return this.modalService.open(ProductExpiryDetailsModalComponent, {data: {dates, productName}}).pipe(
      mergeMap(_ => {
        return of(true);
      })
    );
  }

  public openAssignDeliveryBoyModal(order_id, shopLocation) {
    return this.modalService.open(AssignDeliveryBoyModalComponent, {data: {order_id, shopLocation}}).pipe(
      mergeMap(deliveryAssistantId => {
        return of(deliveryAssistantId);
      })
    );
  }

  public openProductReplacementModal(orderId, categoryId, shopId, productId) {
    return this.modalService.open(ReplacementProductModalComponent, {
      options: {size: "lg"},
      data: {orderId, categoryId, shopId, productId, openImageViewer: this.openImageViewer}
    }).pipe(
      mergeMap(_ => {
        return of(true);
      })
    );
  }

  public openChangeOrderModal(totalAmount, bfCash) {
    return this.modalService.open(ChangeOrderModalComponent, {data: {totalAmount, bfCash}}).pipe(
      mergeMap(_ => {
        return of(true);
      })
    );
  }

  public openImageViewer(image, imageOptions) {
    return this.modalService.open(ImageViewerComponent, {
      options: {size: "lg"},
      data: {image, imageOptions: {...imageOptions, width: 750}}
    }).pipe(
      mergeMap(_ => {
        return of(true);
      })
    );
  }

  public openOrderHistoryModal(data) {
    return this.modalService.open(OrderHistoryModalComponent, {data}).pipe(
        mergeMap(message => {
          return of(true);
        })
    );
  }

    public openRechargeLogModal(data) {
        return this.modalService.open(RechargeLogModalComponent, {data}).pipe(
            mergeMap(message => {
                return of(true);
            })
        );
    }

    public openPauseSubscriptionConfirmationModal(data) {
        return this.modalService.open(PauseSubscriptionConfirmationModalComponent, {data: data}).pipe(
            mergeMap(dt => {
                return this.subsActions(dt);
            })
        );
    }

    public subsActions(data) {
        return this.api.subsActions(data);
    }

    public openUnsubscribeConfirmationModal(data) {
        return this.modalService.open(UnsubscribeConfirmationModalComponent, {data: data}).pipe(
            mergeMap(dt => {
                return this.subsActions(dt);
            })
        );
    }

    public openConfirmModal(data, action) {
        return this.modalService.openConfirm({
            message: `Are you sure you want to ${action} subscription?`,
        })
            .pipe(
                concatMap((id) => {
                    return this.api.subsActions(data);
                }),
            );
    }

    public openTransferAmountModal(data) {
        return this.modalService.open(TransferAmountModalComponent, {data: data}).pipe(
            mergeMap(dt => {
                return this.api.transferAmount(dt);
            })
        );
    }

    public openRechargeReminderModal(data) {
        return this.modalService.open(RechargeReminderModalComponent, {data: data}).pipe(
            mergeMap(dt => {
                return this.api.sendReminder(dt);
            })
        );
    }

    public openEditStartDateModal(data) {
        return this.modalService.open(EditStartDateModalComponent, {data: data}).pipe(
            mergeMap(dt => {
                return this.api.editStartDate(dt);
            }),
        );
    }

    public openPreferredDeliveryTimeModal(data) {
        return this.modalService.open(PreferredDeliveryTimeModalComponent, {data: data}).pipe(
            mergeMap(dt => {
                return this.api.editStartDate(dt);
            })
        );
    }
}
