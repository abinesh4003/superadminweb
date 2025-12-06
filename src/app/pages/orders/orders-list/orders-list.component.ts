import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "@app/pages/orders/orders.service";
import {takeUntil} from "rxjs/operators/takeUntil";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'pkz-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: OrdersService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.service.getAllOrdersCount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.initTabs(data));
  }

  private initTabs(ordersCount): void {
    this.tabs = this.service.getTabs(this.activatedRoute, ordersCount);
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
