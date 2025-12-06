import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-orders-sub',
  template: '<h1>Orders</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersSubComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
