import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "@app/core/services/api.service";
import * as  moment from "moment";

@Component({
  selector: 'pkz-support-call-log-modal',
  templateUrl: './support-call-log-modal.component.html',
  styleUrls: ['./support-call-log-modal.component.scss']
})
export class SupportCallLogModalComponent implements OnInit {
  public messages$;
  data: any;
  form: FormGroup;

  constructor(private _api: ApiService, private ngbActiveModal: NgbActiveModal, private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      'message': new FormControl('', Validators.required)
    });
    if (this.data && this.data.orderId) {
      this.messages$ = this._api.getSupportMessages({order_id: this.data.orderId});
    }
    if (this.data && this.data.subsId) {
      this.messages$ = this._api.getSubsSupportMessages({subs_id: this.data.subsId});
    }
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  public formatDate(date) {
    return `${moment(date).format('DD/MM/YYYY hh:mm A')}`
  }

  public onSubmit() {
    if (!this.form.get('message').errors) {
      const message = this.form.get('message').value;
      this.ngbActiveModal.close(message);
    }
  }
}
