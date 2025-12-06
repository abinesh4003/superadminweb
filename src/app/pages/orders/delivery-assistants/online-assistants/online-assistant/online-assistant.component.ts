import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DeliveryAssistantsService} from "@app/pages/orders/delivery-assistants/delivery-assistants.service";
import {filter, take} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'pkz-online-assistant',
  templateUrl: './online-assistant.component.html',
  styleUrls: ['./online-assistant.component.scss']
})
export class OnlineAssistantComponent implements OnInit {

  public assistantInfo$: Observable<any>;
  iconOptions = {path: '/delivery/profile/img', width: 100};

  constructor(private _activatedRoute: ActivatedRoute, private _service: DeliveryAssistantsService) {
  }

  ngOnInit() {
    this._activatedRoute.params
      .pipe(take(1))
      .subscribe(params => {
        const assistantId = params['a_id'];
        const orderId = params['o_id'];

        this.assistantInfo$ = this._service.getOnlineAssistantInfo(assistantId, orderId)
      })
  }

  getGoogleMapsLink(coordinates) {
    return `http://www.google.com/maps/place/${coordinates[1]}, ${coordinates[0]}`
  }

  getDeliveryStatusById(deliveryStatusId) {
    switch (deliveryStatusId) {
      case 0:
        return 'Assigned';
      case 1:
        return 'Started';
      case 2:
        return 'Reached';
      case 3:
        return 'Shipping';
    }
  }

  public deliveryHistory() {

  }
}
