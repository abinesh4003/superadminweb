import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pkz-status-tabs',
  templateUrl: './status-tabs.component.html',
  styleUrls: ['./status-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusTabsComponent implements OnInit {
  @Input() tabs: any[];
  @Input() activeTabId: number;
  @Output() selectTab: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onSelectTab(event, tab) {
    event.preventDefault();

    this.selectTab.emit(tab);
  }
}
