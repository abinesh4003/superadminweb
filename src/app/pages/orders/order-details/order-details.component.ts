import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OrdersService} from "@app/pages/orders/orders.service";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, take, takeUntil, tap} from "rxjs/operators";
import {orderStatusMap} from "@app/pages/orders/orders-utils";
import {Observable} from "rxjs";
import {ProductsFilterSettingsService} from "@app/pages/orders/order-details/products-filter-settings.service";
import * as moment from "moment";
import {isNullOrUndefined} from "util";
import {Subject} from "rxjs/Subject";
import {isNumeric} from "rxjs/util/isNumeric";

@Component({
  selector: 'pkz-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  public orderStatusMap = orderStatusMap;
  public orderInfo$: Observable<any>;
  public orderContactInfo$: Observable<any>;
  filterFormSettings$;
  filtersObj: any = {};
  products = [];
  imageOptions = {path: 'order/notes/image', width: 80, imagePropName: 'file'};
  deliveryAssistantImageOptions = {path: 'delivery/profile/img', width: 150};
  updateExpectedDeliveryTime: string;
  tempExpectedDeliveryTime: string;
  deliveryAssistant: any;
  shopLocation: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private cd: ChangeDetectorRef,
              private _ordersService: OrdersService,
              private _productFilterSettingsService: ProductsFilterSettingsService) {
  }

  ngOnInit() {
    this.filterFormSettings$ = this._productFilterSettingsService.getFilterSettings();
    this.filtersObj = this._productFilterSettingsService.getInitFiltersData();
    this._activatedRoute.params
      .pipe(take(1), filter(params => params['id']))
      .subscribe(({id}) => {
        this.orderInfo$ = this._ordersService.getOrderInfo(id).pipe(tap(order => {
          if (order.assistant_info && order.assistant_info.assistant_id) {
            this.getDeliveryAssistant(order.assistant_info.assistant_id);
          }
          this.products = [...order.products];
        }));
        this.orderContactInfo$ = this._ordersService.getOrderContactInfo(id)
          .pipe(tap(orderInfo => this.shopLocation = orderInfo.shop.address.street));
      })
  }

  public getDeliveryAssistant(id) {
    this.deliveryAssistant = this._ordersService.getDeliveryAssistantInfo(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.deliveryAssistant = data;
        this.cd.markForCheck();
      });
  };

  public goBack() {
    this._router.navigate(['../../'], {relativeTo: this._activatedRoute});
  }

  public onFilter(filtersObj, allProducts) {
    this.products = allProducts.filter(product =>
      product.product_name.toLowerCase().includes(filtersObj.searchtxt.toLowerCase()) ||
      (product.sku && product.sku.toString().includes(filtersObj.searchtxt.toLowerCase())) ||
      (product.upc && product.upc.toString().includes(filtersObj.searchtxt.toLowerCase())));
  }

  public getPreferredDeliveryDate(order) {
    const dateFormat = 'DD/MM/YYYY - hh:mm A';
    return `${moment(order.preferences.custom_time.from).format(dateFormat)}`
  }

  public getExpectedTime(date) {
    if (this.updateExpectedDeliveryTime) {
      var array = this.updateExpectedDeliveryTime.split(' ');

      this.tempExpectedDeliveryTime = this.updateExpectedDeliveryTime;

      this.tempExpectedDeliveryTime = this.tempExpectedDeliveryTime.replace(' pm','')
      this.tempExpectedDeliveryTime = this.tempExpectedDeliveryTime.replace(' am','')

      return `${moment(this.tempExpectedDeliveryTime).format('DD/MM/YYYY - hh:mm')}` + ' ' + `${array[2].toUpperCase()}`
    } else {
      return `${moment(date).format('DD/MM/YYYY - hh:mm A')}`
    }
  }

  public formatDate(date) {
    if (date) {
      return `${moment(date).format('DD/MM/YYYY - hh:mm A')}`
    }
  }

  public getCardPaymentFee(order) {
    if (isNullOrUndefined(order.prices.payment_fee) || isNullOrUndefined(order.payment_fee_percent)) {
      return 'N/A';
    }
    return `₹${order.prices.payment_fee.toFixed(2)} (${order.payment_fee_percent}%)`;
  }

  public getProductExpDate(mfd_exp_dates) {
    if (mfd_exp_dates.type === 1) {
      return 1;
    } else if (mfd_exp_dates.type === 2) {
      return 'Not Applicable';
    } else {
      return 'Unknown'
    }
  }

  public getVerificationStatus(status) {
    switch (status) {
      case 1:
        return 'Delivered';
      case 2:
        return 'Undelivered';
      case 3:
        return 'Replacement';
    }
  }

  public getReplacementDate(correspondence) {
    if (correspondence) {
      const ids = Object.keys(correspondence);
      if (ids && ids.length > 0) {
        const id = ids[0];
        const format = 'DD/MM/YYYY - hh:mm A';
        const chat = correspondence[id].chat;
        return moment(chat[0].at).format(format);
      }
    }
    return null;
  }

  public getDeliveryAddress(orderContactInfo) {
    let location = orderContactInfo.delivery.address.street;
    if (!location.includes(orderContactInfo.delivery.address.area)) {
      location = location.concat(orderContactInfo.delivery.address.area);
    }
    if (!location.includes(orderContactInfo.delivery.address.zipcode)) {
      location = location.concat(orderContactInfo.delivery.address.zipcode);
    }
    return location;
  }

  public cancelOrder(order) {
    this._ordersService.cancelOrder(order.order_id,
      order.store_id, order.prices.delivery,
      order.amount_paid_by_customer,
      order.payment_type === 1,
      order.delivery_type.number === 1)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
  }

  public editExpectedDeliveryTime(order) {
    this._ordersService.openEditDeliveryTimeModal(order._id, order.preferences.expected_time.at)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(body => {
        this.updateExpectedDeliveryTime = body.expectedTime;
        this.cd.detectChanges();
      });
  }

  public openDispatchOrderConfirmationModal(order) {
    this._ordersService.openDispatchOrderConfirmationModal(order._id, order.category_id, order.store_id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
  }

  public openShipOrderConfirmationModal(order) {
    this._ordersService.openShipOrderConfirmationModal(order._id, order.category_id, order.store_id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
  }

  public openAcceptOrderConfirmationModal(order) {
    this._ordersService.openAcceptOrderConfirmationModal(order._id, order.category_id, order.store_id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
  }

  public openDeliverOrderConfirmationModal(order) {
    this._ordersService.openDeliverOrderConfirmationModal(order._id, order.category_id, order.store_id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
  }

  public openSupportModal(order) {
    this._ordersService.openSupportModal(order._id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  public viewProductExpiryDates(product) {
    this._ordersService.openProductExpDatesModal(product.mfd_exp_dates.dates, product.product_name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  public openAssignDeliveryBoyModal(order) {
    this._ordersService.openAssignDeliveryBoyModal(order._id, this.shopLocation)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(deliveryAssistantId => {
        if (deliveryAssistantId) {
          this.getDeliveryAssistant(deliveryAssistantId);
        }
      });
  }

  public openProductReplacementModal(order, product) {
    this._ordersService.openProductReplacementModal(order._id, order.category_id, order.store_id, product.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  public openChangeOrderModal(order) {
    this._ordersService.openChangeOrderModal(order.amount_paid_by_customer, order.payment_mode.bfcash)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  };

  public viewImage(image) {
    this._ordersService.openImageViewer(image, this.imageOptions)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  getGoogleMapsLink(coordinates) {
    return `http://www.google.com/maps/place/${coordinates[0]}, ${coordinates[1]}`
  }

  getGoogleMapsLinkReversed(coordinates) {
    return `http://www.google.com/maps/place/${coordinates[1]}, ${coordinates[0]}`
  }

  isNumber(value) {
    return isNumeric(value);
  }

  getUpcOrSku(product) {
    return product.sku ? product.sku : product.upc;
  }

  upperCase(text: string) {
    if (text) {
      return `${text[0].toUpperCase()}${text.slice(1, text.length)}`
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
