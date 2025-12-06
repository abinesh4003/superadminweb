import { NgModule } from '@angular/core';
import { MessagesRoutingModule, routedComponents } from './messages-routing.module';

@NgModule({
  imports: [
    MessagesRoutingModule
  ],
  declarations: [
    ...routedComponents
  ]
})
export class MessagesModule {

}
