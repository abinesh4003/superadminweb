import {Component, Input, OnInit} from '@angular/core';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'pkz-orders-dashboard-card',
  templateUrl: './orders-dashboard-card.component.html',
  styleUrls: ['./orders-dashboard-card.component.scss']
})
export class OrdersDashboardCardComponent implements OnInit {
  @Input('label') label: string;
  @Input('value') value: string;
  @Input('percent') percent: string;
  @Input('isWarn') isWarn: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  public checkIfExist() {
    return !isNullOrUndefined(this.percent);
  }
}
