import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '@app/shared/components/modal/confirm-modal/confirm-modal.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RejectModalComponent } from '@app/shared/components/modal/reject-modal/reject-modal.component';

const COMPONENTS = [
  ModalComponent,
  ConfirmModalComponent,
  RejectModalComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    ...COMPONENTS
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule {
}
