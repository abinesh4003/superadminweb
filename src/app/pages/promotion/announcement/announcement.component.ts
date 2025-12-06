import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService } from '@app/pages/promotion/announcement/announcement.service';

@Component({
  templateUrl: 'announcement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementComponent implements OnInit {
  isPageLoaded = true;
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: AnnouncementService
  ) {
  }

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    this.tabs = this.service.getTabs(this.activatedRoute);
  }
}
