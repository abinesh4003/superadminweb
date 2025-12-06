import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RemittanceListComponent} from "@app/pages/finance/remittance/list/remittance-list.component";
import {RemittanceComponent} from "@app/pages/finance/remittance/remittance.component";
import {CodHistoryComponent} from "@app/pages/finance/remittance/cod-history/cod-history.component";

const routes: Routes = [
    {
        path: '',
        component: RemittanceComponent,
        children: [
            {
                path: 'cod-history',
                component: CodHistoryComponent
            },
            {
                path: '',
                component: RemittanceListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RemittanceRoutingModule {
}

export const routedComponents = [
    RemittanceListComponent,
    RemittanceComponent
];
