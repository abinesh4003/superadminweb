import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PkzLogoutComponent } from '@app/auth/logout/logout.component';
import { PkzRequestPasswordComponent } from '@app/auth/request-password/request-password.component';
import { PkzResetPasswordComponent } from '@app/auth/reset-password/reset-password.component';
import { PkzLoginComponent } from './login/login.component';
import { PkzAuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: PkzAuthComponent,
    children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: PkzLoginComponent},
      {path: 'request-password', component: PkzRequestPasswordComponent},
      {path: 'reset-password', component: PkzResetPasswordComponent},
      {path: 'logout', component: PkzLogoutComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}

export const routedComponents = [
  PkzAuthComponent,
  PkzLoginComponent,
  PkzRequestPasswordComponent,
  PkzResetPasswordComponent,
  PkzLogoutComponent
];
