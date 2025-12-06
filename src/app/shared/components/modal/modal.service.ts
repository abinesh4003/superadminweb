import { Injectable } from '@angular/core';
import { ConfirmModalComponent } from '@app/shared/components/modal/confirm-modal/confirm-modal.component';
import { RejectModalComponent } from '@app/shared/components/modal/reject-modal/reject-modal.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs/observable/from';

interface ModalInterface {
  title?: string;
  message?: string;
  options?: NgbModalOptions;
  data?: any;
}

@Injectable()
export class ModalService {

  constructor(
    private modalService: NgbModal
  ) {}

  open(content, {title, message, data, options}: ModalInterface = {}) {
    const modalRef = this.modalService.open(content, options);

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.data = data;

    return from(modalRef.result);
  }

  openConfirm(data: ModalInterface) {
    return this.open(ConfirmModalComponent, data);
  }

  openReject(data?: ModalInterface) {
    return this.open(RejectModalComponent, data);
  }
}
