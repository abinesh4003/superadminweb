import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pkz-routed-vertical-nav',
  styleUrls: ['./routed-vertical-nav.component.scss'],
  templateUrl: './routed-vertical-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedVerticalNavComponent {
  @Input() groups: any[];
  @Input() navWidth = 3;
  @Input() contentWidth = 9;
  @Input() set navs(items) {
    this.handleNavsChange(items);
  }
  @Output() changeNav: EventEmitter<any> = new EventEmitter();

  formattedGroups: any[];

  constructor(
    private router: Router
  ) {}

  selectTab(event, nav) {
    event.preventDefault();

    if (nav.disabled) {
      return false;
    }

    this.changeNav.emit(nav);
    this.router.navigate([nav.route], { queryParams: nav.queryParams});
  }

  private handleNavsChange(items) {
    this.formattedGroups = this.groups.map(({name, key, value}) => {
      const filtered =  items.filter(item => item[key] === value);
      return {
        name,
        navs: filtered
      };
    });
  }
}
