import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {OrdersRoutingModule, routedComponents} from './orders-routing.module';
import {OrdersService} from "@app/pages/orders/orders.service";
import {OrdersDashboardFilterSettingsService} from "@app/pages/orders/orders-dashboard/orders-dashboard-filter-settings.service";
import {OrdersDashboardService} from "@app/pages/orders/orders-dashboard/orders-dashboard.service";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {NgSelectModule} from "@ng-select/ng-select";
import {OrdersListService} from "@app/pages/orders/orders-list/orders-list.service";
import {OrdersListFilterSettingsService} from "@app/pages/orders/orders-list/orders-list-filter-settings.service";
import {ProductsFilterSettingsService} from "@app/pages/orders/order-details/products-filter-settings.service";
import {CancelOrderModalComponent} from './cancel-order-modal/cancel-order-modal.component';
import {NgbDropdown, NgbDropdownMenu} from "@ng-bootstrap/ng-bootstrap/dropdown/dropdown";
import {ChangeOrderStatusConfirmationModalComponent} from './change-order-status-confirmation-modal/change-order-status-confirmation-modal.component';
import {EditDeliveryTimeModalComponent} from './edit-delivery-time-modal/edit-delivery-time-modal.component';
import { SupportCallLogModalComponent } from './support-call-log-modal/support-call-log-modal.component';
import { ProductExpiryDetailsModalComponent } from './product-expiry-details-modal/product-expiry-details-modal.component';
import { AcceptOrderModalComponent } from './accept-order--modal/accept-order--modal.component';
import { AssignDeliveryBoyModalComponent } from './assign-delivery-boy-modal/assign-delivery-boy-modal.component';
import { ReplacementProductModalComponent } from './replacement-product-modal/replacement-product-modal.component';
import { ChangeOrderModalComponent } from './change-order-modal/change-order-modal.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { DeliveryAssistantsComponent } from './delivery-assistants/delivery-assistants.component';
import { AssistantsListComponent } from './delivery-assistants/assistants-list/assistants-list.component';
import { OnlineAssistantsComponent } from './delivery-assistants/online-assistants/online-assistants.component';
import {DeliveryAssistantsService} from "@app/pages/orders/delivery-assistants/delivery-assistants.service";
import {DeliveryAssistantsFilterSettingsService} from "@app/pages/orders/delivery-assistants/delivery-assistants-filter-settings.service";
import { DeliveryAssistantsFilterFormComponent } from './delivery-assistants/delivery-assistants-filter-form/delivery-assistants-filter-form.component';
import { DeliveryAssistantsTableComponent } from './delivery-assistants/delivery-assistants-table/delivery-assistants-table.component';
import { OnlineAssistantComponent } from './delivery-assistants/online-assistants/online-assistant/online-assistant.component';
import { AssistantComponent } from './delivery-assistants/assistants-list/assistant/assistant.component';
import { RejectAssistantModalComponent } from './delivery-assistants/reject-assistant-modal/reject-assistant-modal.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionsComponent } from './subscription/subscriptions/subscriptions.component';
import { UnsubscriptionsComponent } from './subscription/unsubscriptions/unsubscriptions.component';
import { SubscriptionService } from '@app/pages/orders/subscription/subscription.service';
import { SubscriptionTableComponent } from './subscription/subscription-table/subscription-table.component';
import { SubscriptionDetailComponent } from './subscription/subscription-detail/subscription-detail.component';
import {SubscriptionTableService} from '@app/pages/orders/subscription/subscription-table.service';
import { SubscriptionTableFilterComponent } from './subscription/subscription-table-filter/subscription-table-filter.component';
import {SubscriptionTableFilterService} from '@app/pages/orders/subscription/subscription-table-filter-settings.service';
import { OrderHistoryModalComponent } from './order-history-modal/order-history-modal.component';
import { RechargeLogModalComponent } from './recharge-log-modal/recharge-log-modal.component';
import { PauseSubscriptionConfirmationModalComponent } from './pause-subscription-confirmation-modal/pause-subscription-confirmation-modal.component';
import { UnsubscribeConfirmationModalComponent } from './unsubscribe-confirmation-modal/unsubscribe-confirmation-modal.component';
import { TransferAmountModalComponent } from './transfer-amount-modal/transfer-amount-modal.component';
import { RechargeReminderModalComponent } from './recharge-reminder-modal/recharge-reminder-modal.component';
import { EditStartDateModalComponent } from './edit-start-date-modal/edit-start-date-modal.component';
import { PreferredDeliveryTimeModalComponent } from './preferred-delivery-time-modal/preferred-delivery-time-modal.component';
import {SubsProductsFilterSettingsService} from '@app/pages/orders/subscription/subscription-detail/subs-products-filter-settings.service';

const entryComponents = [
  CancelOrderModalComponent,
  ChangeOrderStatusConfirmationModalComponent,
  EditDeliveryTimeModalComponent,
  SupportCallLogModalComponent,
  ProductExpiryDetailsModalComponent,
  AcceptOrderModalComponent,
  AssignDeliveryBoyModalComponent,
  ReplacementProductModalComponent,
  ChangeOrderModalComponent,
  ImageViewerComponent,
  RejectAssistantModalComponent,
  OrderHistoryModalComponent,
  RechargeLogModalComponent,
  PauseSubscriptionConfirmationModalComponent,
  UnsubscribeConfirmationModalComponent,
  TransferAmountModalComponent,
  RechargeReminderModalComponent,
  EditStartDateModalComponent,
  PreferredDeliveryTimeModalComponent,
];

@NgModule({
  imports: [
    OrdersRoutingModule,
    SharedModule,
    NgxChartsModule,
    NgxPermissionsModule.forChild(),
    NgSelectModule,
  ],
  providers: [
    OrdersService,
    OrdersDashboardFilterSettingsService,
    OrdersDashboardService,
    OrdersListService,
    OrdersListFilterSettingsService,
    ProductsFilterSettingsService,
    DeliveryAssistantsService,
    DeliveryAssistantsFilterSettingsService,
    NgbDropdownMenu,
    NgbDropdown,
    SubscriptionService,
    SubscriptionTableService,
    SubscriptionTableFilterService,
    SubsProductsFilterSettingsService
  ],
  declarations: [
    ...routedComponents,
    ...entryComponents,
    DeliveryAssistantsComponent,
    AssistantsListComponent,
    OnlineAssistantsComponent,
    DeliveryAssistantsFilterFormComponent,
    DeliveryAssistantsTableComponent,
    OnlineAssistantComponent,
    AssistantComponent,
    SubscriptionComponent,
    SubscriptionsComponent,
    UnsubscriptionsComponent,
    SubscriptionTableComponent,
    SubscriptionDetailComponent,
    SubscriptionTableFilterComponent,
  ],
  entryComponents: [
    ...entryComponents
  ]
})
export class OrdersModule {

}
