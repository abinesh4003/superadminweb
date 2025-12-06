import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-profile',
  template: `<h1>Profile</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
