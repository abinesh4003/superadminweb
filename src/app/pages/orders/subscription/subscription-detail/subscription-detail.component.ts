import {ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {isNumeric} from 'rxjs/util/isNumeric';
import {orderStatusMap} from '@app/pages/orders/orders-utils';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {filter, take, takeUntil, tap} from "rxjs/operators";
import {SubscriptionService} from '@app/pages/orders/subscription/subscription.service';
import {SubsProductsFilterSettingsService} from '@app/pages/orders/subscription/subscription-detail/subs-products-filter-settings.service';
import {privilegesToArray} from "@app/core/utils/privileges.helper";
import {
  SubscriptionSubscriptionsPermissionsConstants,
  SubscriptionUnsubscriptionsPermissionsConstants
} from "@app/pages/orders/orders-permissions.constants";

@Component({
    selector: 'pkz-subscription-detail',
    templateUrl: './subscription-detail.component.html',
    styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    public orderStatusMap = orderStatusMap;
    public orderInfo$: Observable<any>;
    public orderContactInfo$: Observable<any>;
    filterFormSettings$;
    filtersObj: any = {};
    products = [];
    allProducts = [];
    imageOptions = {path: 'order/notes/image', width: 80, imagePropName: 'file'};
    deliveryAssistantImageOptions = {path: 'delivery/profile/img', width: 150};
    updateExpectedDeliveryTime: string;
    updateStartDate: string;
    updateStatus: number;
    updateDeliveryTimeSlot: string;
    deliveryAssistant: any;
    shopLocation: any;

    subsData: any;
    prevRouteUrl = '';

    constructor(private _activatedRoute: ActivatedRoute,
                private _router: Router,
                private cd: ChangeDetectorRef,
                private renderer2: Renderer2,
                private _subscriptionService: SubscriptionService,
                private _subsProductFilterSettingsService: SubsProductsFilterSettingsService) {
    }

    ngOnInit() {
        this.prevRouteUrl = this._router.url.toLowerCase().includes('unsubscriptions') ? 'UnSubscribed' : 'Subscription';
        this.filterFormSettings$ = this._subsProductFilterSettingsService.getFilterSettings();
        this.filtersObj = this._subsProductFilterSettingsService.getInitFiltersData();
        this._activatedRoute.params
            .pipe(take(1), filter(params => params['id']))
            .subscribe(({id}) => {
                this.orderInfo$ = this._subscriptionService.getSubscriptionsInfo(id).pipe(tap(order => {
                        this.subsData = order.data;
                        this.subsData.subsInfo.delivery_time_slot = this.getConvertedDeliveryTime(this.subsData.subsInfo.deliveryTime.from, this.subsData.subsInfo.deliveryTime.to);

                        if (order.assistant_info && order.assistant_info.assistant_id) {
                            this.getDeliveryAssistant(order.assistant_info.assistant_id);
                        }

                        order.data.productsInfo.forEach(productInfo => {
                            productInfo.products.forEach(product => {
                                this.allProducts.push({
                                    ...product,
                                    store_name: productInfo._id.store_name
                                })
                            });
                        });

                        this.products = [...this.allProducts];
                    },
                    err => {
                        this.goBack();
                    }));

            });
        this.getSubscriptionPermission();
    }

    public getDeliveryAssistant(id) {
        this.deliveryAssistant = this._subscriptionService.getDeliveryAssistantInfo(id)
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
            product.store_name.toLowerCase().includes(filtersObj.searchtxt.toLowerCase()) ||
            (product.sku && product.sku.toString().includes(filtersObj.searchtxt.toLowerCase())) ||
            (product.upc && product.upc.toString().includes(filtersObj.searchtxt.toLowerCase())));
    }

    public getPreferredDeliveryDate(order) {
        const dateFormat = 'DD/MM/YYYY - hh:mm A';
        return `${moment(order.preferences.custom_time.from).format(dateFormat)}`
    }

    public getExpectedTime(date) {
        if (this.updateExpectedDeliveryTime) {
            return `${moment(this.updateExpectedDeliveryTime).format('DD/MM/YYYY - hh:mm A')}`
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
        let location = orderContactInfo.data.subsInfo.subscription_info.deliveryAddress.address.street;
        if (!location.includes(orderContactInfo.data.subsInfo.subscription_info.deliveryAddress.address.area)) {
            location = location.concat(orderContactInfo.data.subsInfo.subscription_info.deliveryAddress.address.area);
        }
        if (!location.includes(orderContactInfo.data.subsInfo.subscription_info.deliveryAddress.address.zipcode)) {
            location = location.concat(orderContactInfo.data.subsInfo.subscription_info.deliveryAddress.address.zipcode);
        }
        return location;
    }

    public cancelOrder(order) {
        this._subscriptionService.cancelOrder(order.order_id,
            order.store_id, order.prices.delivery,
            order.amount_paid_by_customer,
            order.payment_type === 1,
            order.delivery_type.number === 1)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
    }

    public editExpectedDeliveryTime(order) {
        this._subscriptionService.openEditDeliveryTimeModal(order._id, order.preferences.expected_time.at)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(body => {
                this.updateExpectedDeliveryTime = body.expectedTime;
                this.cd.detectChanges();
            });
    }

    public openDispatchOrderConfirmationModal(order) {
        this._subscriptionService.openDispatchOrderConfirmationModal(order._id, order.category_id, order.store_id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
    }

    public openShipOrderConfirmationModal(order) {
        this._subscriptionService.openShipOrderConfirmationModal(order._id, order.category_id, order.store_id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
    }

    public openAcceptOrderConfirmationModal(order) {
        this._subscriptionService.openAcceptOrderConfirmationModal(order._id, order.category_id, order.store_id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
    }

    public openDeliverOrderConfirmationModal(order) {
        this._subscriptionService.openDeliverOrderConfirmationModal(order._id, order.category_id, order.store_id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this._router.navigate(['../../'], {relativeTo: this._activatedRoute}));
    }

    public openSupportModal() {
        this._subscriptionService.openSupportModal(this.subsData.subsInfo._id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    }

    public openOrderHistoryModal() {
        this._subscriptionService.openOrderHistoryModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    }

    public openRechargeLogModal() {
        this._subscriptionService.openRechargeLogModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    }

    public openPauseSubscriptionConfirmationModal() {
        this._subscriptionService.openPauseSubscriptionConfirmationModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.updateStatus = res.status;
                this.cd.detectChanges();
            });
    }

    public openUnsubscribeConfirmationModal() {
        this._subscriptionService.openUnsubscribeConfirmationModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                // this.goBack();
                this._router.navigate(['../../'], {relativeTo: this._activatedRoute})
                    .then(() => this._subscriptionService.updateRefreshSubscriptionData());
            });
    }

    public subsAction(flag, actionName, updateData?: boolean) {
        const dt = {
            _id: this.subsData.subsInfo._id,
            fb_title: 't',
            flag: +flag
        };

        this._subscriptionService.openConfirmModal(dt, actionName)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (updateData) {
                    this.updateStatus = res.status;
                    this.cd.detectChanges();
                } else {
                    this._router.navigate(['../../'], {relativeTo: this._activatedRoute})
                        .then(() => this._subscriptionService.updateRefreshSubscriptionData());
                }
            });
        // this._subscriptionService.subsActions(dt)
        //     .pipe(takeUntil(this.ngUnsubscribe))
        //     .subscribe(res => {
        //   if (updateData) {
        //     this.updateStatus = res.status;
        //     this.cd.detectChanges();
        //   } else {
        //     this._router.navigate(['../../'], {relativeTo: this._activatedRoute})
        //         .then(() => this._subscriptionService.updateRefreshSubscriptionData());
        //   }
        // });
    }

    public openTransferAmountModal() {
        this._subscriptionService.openTransferAmountModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.subsData.subsInfo.subs_wallet = +this.subsData.subsInfo.subs_wallet - +res.transferedAmount;
                this.subsData.subsInfo.bfcash = +this.subsData.subsInfo.bfcash + +res.transferedAmount;
            });
    }

    public openRechargeReminderModal() {
        this._subscriptionService.openRechargeReminderModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    }

    public openEditStartDateModal() {
        if (this.updateStartDate) {
            this.subsData.subsInfo.subscription_info.var_start_date = this.updateStartDate;
        }
        this._subscriptionService.openEditStartDateModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(body => {
                this.updateStartDate = body.startDate;
                this.cd.detectChanges();
            });
    }

    public openPreferredDeliveryTimeModal() {
        this._subscriptionService.openPreferredDeliveryTimeModal(this.subsData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.updateDeliveryTimeSlot = this.getConvertedDeliveryTime(res.deliveryTime.from, res.deliveryTime.to);
                this.cd.detectChanges();
            });
    }

    getConvertedDeliveryTime(from, to) {
        const f = moment(from).format('hh:mm a');
        const t = moment(to).format('hh:mm a');

        return f + ' - ' + t;
    }

    public viewProductExpiryDates(product) {
        this._subscriptionService.openProductExpDatesModal(product.mfd_exp_dates.dates, product.product_name)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    }

    public openAssignDeliveryBoyModal(order) {
        this._subscriptionService.openAssignDeliveryBoyModal(order._id, this.shopLocation)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(deliveryAssistantId => {
                if (deliveryAssistantId) {
                    this.getDeliveryAssistant(deliveryAssistantId);
                }
            });
    }

    public openProductReplacementModal(order, product) {
        this._subscriptionService.openProductReplacementModal(order._id, order.category_id, order.store_id, product.id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    }

    public openChangeOrderModal(order) {
        this._subscriptionService.openChangeOrderModal(order.amount_paid_by_customer, order.payment_mode.bfcash)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe();
    };

    public viewImage(image) {
        this._subscriptionService.openImageViewer(image, this.imageOptions)
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

    public getStartDate(date) {
        let dt;
        if (this.updateStartDate) {
            dt = this.updateStartDate;
        } else {
            dt = date;
        }
        dt = new Date(dt).toISOString();
        return `${moment(dt).format('DD/MM/YYYY')}`;
    }

    public getStatus(statusCode) {
        if (this.updateStatus) {
            return +this.updateStatus;
        } else {
            return +statusCode;
        }
    }

    public getParamsByStatusCode() {
        switch (this.getStatus(this.subsData.subsInfo.status)) {
            case 1:
                return {
                    statusName: 'Active',
                    textColor: 'color-light-blue'
                };
            case 2:
                return {
                    statusName: 'Paused',
                    textColor: 'color-light-blue'
                };
            case 3:
                return {
                    statusName: 'Unsubscribed',
                    textColor: 'color-red'
                };
            case 4:
                return {
                    statusName: 'Subscribed',
                    textColor: 'color-light-blue'
                };
        }
    }

    public getOrderDays() {
        const dt = [
            {
                id: 0,
                dayName: 'Sunday',
                isSelected: false
            },
            {
                id: 1,
                dayName: 'Monday',
                isSelected: false
            },
            {
                id: 2,
                dayName: 'Tuesday',
                isSelected: false
            },
            {
                id: 3,
                dayName: 'Wednesday',
                isSelected: false
            },
            {
                id: 4,
                dayName: 'Thursday',
                isSelected: false
            },
            {
                id: 5,
                dayName: 'Friday',
                isSelected: false
            },
            {
                id: 6,
                dayName: 'Saturday',
                isSelected: false
            },
        ];

        this.subsData.subsInfo.subscription_info.order_days.forEach(val => {
            dt.filter(e => {
                return e.isSelected = e.id === val;
            });
        });

        return dt;
    }

    public getDeliveryTimeSlot(deliveryTimeSlot) {
        if (this.updateDeliveryTimeSlot) {
            return this.updateDeliveryTimeSlot;
        } else {
            return deliveryTimeSlot;
        }
    }

    public disabledFunc = (templateRef: TemplateRef<any>) => {
        this.renderer2.setAttribute(templateRef.elementRef.nativeElement.nextSibling, 'disabled', 'true');
    }

    getSubscriptionPermission() {
        const permission = privilegesToArray(this._router.url.toLowerCase().includes('unsubscriptions') ? SubscriptionUnsubscriptionsPermissionsConstants : SubscriptionSubscriptionsPermissionsConstants);
        return permission;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
