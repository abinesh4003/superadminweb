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
  ALL_DELIVERY_ASSISTANTS, CANCELLED_ORDERS_TAB, DELIVERED_ORDERS_TAB, DISPATCHED_ORDERS_TAB,
  NEW_ORDERS_TAB, ON_THE_WAY_ORDERS_TAB,
  ONLINE_DELIVERY_ASSISTANTS,
  PACKAGING_ORDERS_TAB, REPLACEMENT_REQUEST_ORDERS_TAB
} from "@app/core/constants";
import {
  DeliveryAssistantsAllPermissionsConstants,
  DeliveryAssistantsOnlinePermissionsConstants,
  OrdersCancelledPermissionsConstants,
  OrdersDeliveredPermissionsConstants,
  OrdersDispatchedPermissionsConstants,
  OrdersNewPermissionsConstants,
  OrdersPackagingPermissionsConstants, OrdersReplacementPermissionsConstants,
  OrdersShippingPermissionsConstants
} from "@app/pages/orders/orders-permissions.constants";

@Injectable()
export class OrdersService {
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
      .getListByKey('orders_list_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case NEW_ORDERS_TAB:
            permissions = OrdersNewPermissionsConstants;
            break;
          case PACKAGING_ORDERS_TAB:
            permissions = OrdersPackagingPermissionsConstants;
            break;
          case DISPATCHED_ORDERS_TAB:
            permissions = OrdersDispatchedPermissionsConstants;
            break;
          case ON_THE_WAY_ORDERS_TAB:
            permissions = OrdersShippingPermissionsConstants;
            break;
          case DELIVERED_ORDERS_TAB:
            permissions = OrdersDeliveredPermissionsConstants;
            break;
          case CANCELLED_ORDERS_TAB:
            permissions = OrdersCancelledPermissionsConstants;
            break;
          case REPLACEMENT_REQUEST_ORDERS_TAB:
            permissions = OrdersReplacementPermissionsConstants;
            break;
        }

        return {
          title: `${tab.name} (${ordersCount[tab.id].total})`,
          route: tab.id,
          skip: !this.pagesService.hasPermissions(permissions.PATH)
        };
      })
      .filter(item => !item.skip);

    return this.pagesService.getRoutedTabsData(tabsData, url);
  }

  getTabNameByRoute(route: ActivatedRoute) {
    return this.constantsService.getNameById(route.snapshot.parent.routeConfig.path, 'orders_list_tabs');
  }

  public getOrders(queryObj) {
    return this.api.getOrders(queryObj);
  }

  public getOrdersCount(queryObj) {
    return this.api.getOrdersCount(queryObj);
  }

  public getAllOrdersCount() {
    return this.api.getAllOrdersCount();
  }

  public getOrderInfo(id) {
    return this.api.getOrderInfo(id);
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

  public openSupportModal(orderId) {
    return this.modalService.open(SupportCallLogModalComponent, {data: {orderId}}).pipe(
      mergeMap(message => {
        let body = {
          order_id: orderId,
          message
        };
        return this.api.sendSupportMessage(body);
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
}
