import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pkz-routed-tabs',
  templateUrl: './routed-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedTabsComponent {
  @Input() tabs: any[];
  @Input() fullWidth = false;
  @Output() changeTab: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router
  ) {}

  selectTab(event, tab) {
    event.preventDefault();

    if (tab.disabled) {
      return false;
    }

    this.changeTab.emit(tab);
    this.router.navigate([tab.route], { queryParams: tab.queryParams});
  }
}
