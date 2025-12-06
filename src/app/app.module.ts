import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppService } from '@app/app.service';
import { AppStoreModule } from '@app/store/app-store.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AuthModule } from '@app/auth/auth.module';
import { CoreModule } from '@app/core/core.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TreeviewModule } from 'ngx-treeview';
import { Ng2Webstorage } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'pkz-shopor-app'}),
    BrowserAnimationsModule,
    HttpClientModule,
    TransferHttpCacheModule,
    AppRoutingModule,
    AppStoreModule,
    NgbModule.forRoot(),
    AuthModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    Ng2Webstorage.forRoot({prefix: 'pkz'}),
    TreeviewModule.forRoot(),
    NgxPermissionsModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
