import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsCardChargesPermissionsConstants } from '@app/pages/admin/settings/settings-permissions.constants';
import { PagesService } from '@app/pages/pages.service';

@Component({
  selector: 'pkz-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    const url = this.pagesService.getComponentRoute(this.activatedRoute);
    const tabsData = [{
      title: 'Common Charges',
      route: 'charges',
      skip: !this.pagesService.hasPermissions(SettingsCardChargesPermissionsConstants.PATH)
    }]
      .filter(item => !item.skip);

    this.tabs = this.pagesService.getRoutedTabsData(tabsData, url);
  }
}
