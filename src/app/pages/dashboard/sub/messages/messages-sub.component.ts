import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-messages-sub',
  template: '<h1>Messages Test</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesSubComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
