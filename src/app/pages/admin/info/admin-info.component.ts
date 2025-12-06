import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-admin-info',
  template: `<h1>Information</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminInfoComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
