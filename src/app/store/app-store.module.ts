import { NgModule } from '@angular/core';
import { appReducers, metaReducers } from '@app/store/root-reducer';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'SHOPOR Admin Store DevTools',
      logOnly: environment.production
    })
  ]
})
export class AppStoreModule {
}
