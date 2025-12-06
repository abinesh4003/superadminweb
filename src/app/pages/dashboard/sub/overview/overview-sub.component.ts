import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-overview-sub',
  template: '<h1>Overview</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewSubComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
