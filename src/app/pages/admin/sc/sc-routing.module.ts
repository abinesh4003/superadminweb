import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScFormComponent } from '@app/pages/admin/sc/form/sc-form.component';
import { ScListComponent } from '@app/pages/admin/sc/list/sc-list.component';
import { ScTemplateComponent } from '@app/pages/admin/sc/template/sc-template.component';

const routes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: ScListComponent
  }, {
    path: ':page',
    children: [{
      path: '',
      component: ScFormComponent,
    }]
  }, {
    path: ':page/:id',
    children: [{
      path: '',
      component: ScFormComponent,
    }, {
      path: 'tmp',
      component: ScTemplateComponent
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScRoutingModule {
}

export const routedComponents = [
  ScListComponent,
  ScFormComponent,
  ScTemplateComponent
];

