import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DeliveryAssistantsService} from '@app/pages/orders/delivery-assistants/delivery-assistants.service';
import {SubscriptionService} from '@app/pages/orders/subscription/subscription.service';
import {Subject} from 'rxjs/Subject';
import {OrdersService} from '@app/pages/orders/orders.service';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {combineLatest, map} from "rxjs/operators";
import {from} from "rxjs/observable/from";
import {forkJoin} from "rxjs/observable/forkJoin";

@Component({
  selector: 'pkz-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  tabs: any[];

  constructor(
      private activatedRoute: ActivatedRoute,
      private service: SubscriptionService,
      private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    forkJoin([
      this.service.getSubscriptionsCount({status: 0, category_id:"All", location_name: 'All'}),
      this.service.getSubscriptionsCount({status: 3, category_id:"All", location_name: 'All'})
    ]).subscribe(([subscribeCount, unsubscribeCount]) => {
      this.initTabs({
        subscriptions: {
          total: subscribeCount
        },
        unsubscriptions: {
          total: unsubscribeCount
        }
      })
    });
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
