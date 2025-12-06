import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsSubComponent } from '@app/pages/dashboard/sub/settings/settings-sub.component';

const routes: Routes = [
  {path: '', component: SettingsSubComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsSubRoutingModule {
}

export const routedComponents = [
  SettingsSubComponent
];
