import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pkz-switch-view-btn',
  templateUrl: 'switch-view-btn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchViewBtnComponent implements OnInit {
  @Input() tableView = true;
  @Output() switchView: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onChange() {
    this.switchView.emit(!this.tableView);
  }
}
