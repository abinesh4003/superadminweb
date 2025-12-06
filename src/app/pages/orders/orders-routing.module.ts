import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrdersComponent} from './orders.component';
import {OrdersListComponent} from "@app/pages/orders/orders-list/orders-list.component";
import {OrdersDashboardComponent} from "@app/pages/orders/orders-dashboard/orders-dashboard.component";
import {NewOrdersComponent} from "@app/pages/orders/orders-list/new-orders/new-orders.component";
import {PackagingOrdersComponent} from "@app/pages/orders/orders-list/packaging-orders/packaging-orders.component";
import {DispatchedOrdersComponent} from "@app/pages/orders/orders-list/dispatched-orders/dispatched-orders.component";
import {OnTheWayOrdersComponent} from "@app/pages/orders/orders-list/on-the-way-orders/on-the-way-orders.component";
import {DeliveredOrdersComponent} from "@app/pages/orders/orders-list/delivered-orders/delivered-orders.component";
import {CancelledOrdersComponent} from "@app/pages/orders/orders-list/cancelled-orders/cancelled-orders.component";
import {ReplacementRequestOrdersComponent} from "@app/pages/orders/orders-list/replacement-request-orders/replacement-request-orders.component";
import {
  ALL_DELIVERY_ASSISTANTS,
  CANCELLED_ORDERS_TAB,
  DELIVERED_ORDERS_TAB,
  DISPATCHED_ORDERS_TAB,
  NEW_ORDERS_TAB,
  ON_THE_WAY_ORDERS_TAB,
  ONLINE_DELIVERY_ASSISTANTS,
  PACKAGING_ORDERS_TAB,
  REPLACEMENT_REQUEST_ORDERS_TAB,
  SUBSCRIPTIONS_TAB,
  UNSUBSCRIPTIONS_TAB,
} from '@app/core/constants';
import {OrdersDashboardCardComponent} from "@app/pages/orders/orders-dashboard/orders-dashboard-card/orders-dashboard-card.component";
import {privilegesToArray} from "@app/core/utils/privileges.helper";
import {
  DeliveryAssistantsAllPermissionsConstants,
  DeliveryAssistantsConstants,
  DeliveryAssistantsOnlinePermissionsConstants, OrdersALLPermissionsConstants, OrdersCancelledPermissionsConstants,
  OrdersDashboardPermissionsConstants, OrdersDeliveredPermissionsConstants,
  OrdersDispatchedPermissionsConstants,
  OrdersNewPermissionsConstants,
  OrdersPackagingPermissionsConstants, OrdersReplacementPermissionsConstants,
  OrdersShippingPermissionsConstants,
  SubscriptionConstants,
  SubscriptionSubscriptionsPermissionsConstants, SubscriptionUnsubscriptionsPermissionsConstants,
} from '@app/pages/orders/orders-permissions.constants';
import {NgxPermissionsGuard} from "ngx-permissions";
import {OrderDetailsComponent} from "@app/pages/orders/order-details/order-details.component";
import {OrderListFilterComponent} from "@app/pages/orders/orders-list/order-list-filter/order-list-filter.component";
import {OrdersTableComponent} from "@app/pages/orders/orders-list/orders-table/orders-table.component";
import {getRoute} from "@app/pages/orders/orders-routing-utils";
import {DeliveryAssistantsComponent} from "@app/pages/orders/delivery-assistants/delivery-assistants.component";
import {AssistantsListComponent} from "@app/pages/orders/delivery-assistants/assistants-list/assistants-list.component";
import {OnlineAssistantsComponent} from "@app/pages/orders/delivery-assistants/online-assistants/online-assistants.component";
import {AssistantComponent} from "@app/pages/orders/delivery-assistants/assistants-list/assistant/assistant.component";
import {OnlineAssistantComponent} from "@app/pages/orders/delivery-assistants/online-assistants/online-assistant/online-assistant.component";
import {SubscriptionComponent} from '@app/pages/orders/subscription/subscription.component';
import {SubscriptionsComponent} from '@app/pages/orders/subscription/subscriptions/subscriptions.component';
import {UnsubscriptionsComponent} from '@app/pages/orders/subscription/unsubscriptions/unsubscriptions.component';
import {SubscriptionDetailComponent} from '@app/pages/orders/subscription/subscription-detail/subscription-detail.component';

const routes: Routes = [{
  path: '',
  component: OrdersComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard'
    },
    {
      path: 'dashboard',
      component: OrdersDashboardComponent,
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(OrdersDashboardPermissionsConstants),
          redirectTo: 'pages/orders/all'
        }
      }
    },
    {
      path: 'all',
      component: OrdersListComponent,
      canActivate: [NgxPermissionsGuard],
      canActivateChild: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(OrdersALLPermissionsConstants),
          redirectTo: 'pages/orders/delivery-assistants/online'
        }
      },
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: NEW_ORDERS_TAB
        },
        {
          path: NEW_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersNewPermissionsConstants),
              redirectTo: `pages/orders/all/${PACKAGING_ORDERS_TAB}`
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: NewOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        },
        {
          path: PACKAGING_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersPackagingPermissionsConstants),
              redirectTo: `pages/orders/all/${DISPATCHED_ORDERS_TAB}`
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: PackagingOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        },
        {
          path: DISPATCHED_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersDispatchedPermissionsConstants),
              redirectTo: `pages/orders/all/${ON_THE_WAY_ORDERS_TAB}`
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: DispatchedOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        },
        {
          path: ON_THE_WAY_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersShippingPermissionsConstants),
              redirectTo: `pages/orders/all/${DELIVERED_ORDERS_TAB}`
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: OnTheWayOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        },
        {
          path: DELIVERED_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersDeliveredPermissionsConstants),
              redirectTo: `pages/orders/all/${CANCELLED_ORDERS_TAB}`
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: DeliveredOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        },
        {
          path: CANCELLED_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersCancelledPermissionsConstants),
              redirectTo: `pages/orders/all/${REPLACEMENT_REQUEST_ORDERS_TAB}`
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: CancelledOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        },
        {
          path: REPLACEMENT_REQUEST_ORDERS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(OrdersReplacementPermissionsConstants),
              redirectTo: 'pages/orders/delivery-assistants/online'
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: ReplacementRequestOrdersComponent
            },
            {
              path: ':id/details', component: OrderDetailsComponent
            }
          ]
        }
      ]
    },
    {
      path: 'delivery-assistants',
      component: DeliveryAssistantsComponent,
      canActivate: [NgxPermissionsGuard],
      canActivateChild: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(DeliveryAssistantsConstants),
          redirectTo: 'pages/orders/subscription/subscriptions'
        }
      },
      children: [
        {
          path: ONLINE_DELIVERY_ASSISTANTS,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(DeliveryAssistantsOnlinePermissionsConstants),
              redirectTo: 'pages/orders/delivery-assistants/all'
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: OnlineAssistantsComponent
            },
            {
              path: ':a_id/:o_id', component: OnlineAssistantComponent
            }
          ]
        },
        {
          path: ALL_DELIVERY_ASSISTANTS,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(DeliveryAssistantsAllPermissionsConstants),
              redirectTo: 'pages/orders/subscription/subscriptions'
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: AssistantsListComponent
            },
            {
              path: ':id', component: AssistantComponent
            }
          ]
        },
        {
          path: '',
          pathMatch: 'full',
          redirectTo: ONLINE_DELIVERY_ASSISTANTS
        },
      ]
    },



    {
      path: 'subscription',
      component: SubscriptionComponent,
      canActivate: [NgxPermissionsGuard],
      canActivateChild: [NgxPermissionsGuard],
      data: {
        permissions: {
          only:  privilegesToArray(SubscriptionConstants),
          redirectTo: 'pages/dashboard/main'
        }
      },
      children: [
        {
          path: SUBSCRIPTIONS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(SubscriptionSubscriptionsPermissionsConstants),
              redirectTo: 'pages/orders/subscription/unsubscriptions'
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: SubscriptionsComponent
            },
            {
              path: ':id/details', component: SubscriptionDetailComponent
            }
          ]
        },
        {
          path: UNSUBSCRIPTIONS_TAB,
          canActivate: [NgxPermissionsGuard],
          canActivateChild: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: privilegesToArray(SubscriptionUnsubscriptionsPermissionsConstants),
              redirectTo: 'pages/dashboard/main'
            }
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: UnsubscriptionsComponent
            },
            {
              path: ':id/details', component: SubscriptionDetailComponent
            }
          ]
        },
        {
          path: '',
          pathMatch: 'full',
          redirectTo: SUBSCRIPTIONS_TAB
        },
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {
}

export const routedComponents = [
  OrdersComponent,
  OrdersListComponent,
  OrdersDashboardComponent,
  NewOrdersComponent,
  PackagingOrdersComponent,
  DispatchedOrdersComponent,
  OnTheWayOrdersComponent,
  DeliveredOrdersComponent,
  CancelledOrdersComponent,
  ReplacementRequestOrdersComponent,
  OrdersDashboardCardComponent,
  OrderListFilterComponent,
  OrdersTableComponent,
  OrderDetailsComponent,
];
