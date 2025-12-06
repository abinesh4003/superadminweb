import {OrderDetailsComponent} from "@app/pages/orders/order-details/order-details.component";

export function getRoute(tabPath, component) {
  return {
    path: tabPath,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: component
      },
      {
        path: ':id/details', component: OrderDetailsComponent
      }
    ]
  }
};
