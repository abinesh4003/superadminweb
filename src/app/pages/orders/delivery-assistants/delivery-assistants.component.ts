import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "@app/pages/orders/orders.service";
import {DeliveryAssistantsService} from "@app/pages/orders/delivery-assistants/delivery-assistants.service";
import {takeUntil} from "rxjs/operators/takeUntil";

@Component({
  selector: 'pkz-delivery-assistants',
  templateUrl: './delivery-assistants.component.html',
  styleUrls: ['./delivery-assistants.component.scss']
})
export class DeliveryAssistantsComponent implements OnInit {
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: DeliveryAssistantsService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    this.tabs = this.service.getTabs(this.activatedRoute);
    this.cd.markForCheck();
  }

}
