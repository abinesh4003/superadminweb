import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'pkz-reject-assistant-modal',
  templateUrl: './reject-assistant-modal.component.html',
  styleUrls: ['./reject-assistant-modal.component.scss']
})
export class RejectAssistantModalComponent implements OnInit {
  public form: FormGroup;
  public data: any;

  constructor(private ngbActiveModal: NgbActiveModal, private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      'feedbackMessage': new FormControl('', Validators.required)
    })
  }

  onConfirm(): void {
    if (this.form.valid) {
      this.ngbActiveModal.close(this.form.controls['feedbackMessage'].value);
    }
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  public getTitle() {
    if (this.data.status) {
      switch (this.data.status) {
        case 3: return 'Suspend';
        case 4: return 'Resigned';
        case 2: return 'Reject'
      }
    } else return '';
  }

}
