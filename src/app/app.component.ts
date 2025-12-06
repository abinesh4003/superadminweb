import { Component } from '@angular/core';

@Component({
  selector: 'pkz-app-root',
  template: `
    <router-outlet></router-outlet>
    <ngx-ui-loader></ngx-ui-loader>
  `
})
export class AppComponent {

}
