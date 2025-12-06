import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'pkz-preferred-delivery-time-modal',
  templateUrl: './preferred-delivery-time-modal.component.html',
  styleUrls: ['./preferred-delivery-time-modal.component.scss']
})
export class PreferredDeliveryTimeModalComponent implements OnInit {
  data: any;
  from;
  to;
  showError = false;

  constructor(private ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {
    this.from = {
      hour: new Date(this.data.subsInfo.deliveryTime.from).getHours(),
      minute: new Date(this.data.subsInfo.deliveryTime.from).getMinutes()
    };
    this.to = {
      hour: new Date(this.data.subsInfo.deliveryTime.to).getHours(),
      minute: new Date(this.data.subsInfo.deliveryTime.to).getMinutes()
    };
  }

  getInputValue(dt) {
    return this.formatAMPM(new Date(1999, 1, 1, dt.hour, dt.minute));
  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ampm;
    return strTime;
  }

  confirm() {
    this.showError = false;
    const from: any = new Date(this.data.subsInfo.deliveryTime.from.split(' ')[0]);
    from.setHours(this.from.hour);
    from.setMinutes(this.from.minute);
    const to: any = new Date(this.data.subsInfo.deliveryTime.to.split(' ')[0]);
    to.setHours(this.to.hour);
    to.setMinutes(this.to.minute);

    if (from >= to) {
      this.showError = true;
      return;
    }

    const body = {
      _id: this.data.subsInfo._id,
      startDate: this.data.subsInfo.start_date,
      deliveryTime: {
        from: moment(from).toISOString(),
        to: moment(to).toISOString(),
        offset: this.data.subsInfo.deliveryTime.offset
      }
    };

    this.ngbActiveModal.close(body);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

}
