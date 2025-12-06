import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@app/core/models';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { DashboardSubPermissionsConstants } from '@app/pages/dashboard/sub/dashboard-sub-permissions.constants';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pkz-pages-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  items$: Observable<Category[]>;
  permsSub;
  imageOptions = {path: 'dsbd/sc/img/vw', width: 60};

  constructor(
    private api: ApiService,
    private constantsService: ConstantsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.items$ = this.api.getDashboardStoreCategoryList();
    this.permsSub = privilegesToArray(DashboardSubPermissionsConstants);
  }

  navigateToCategory(newId) {
    const urlTree = this.router.parseUrl(this.router.url);
    let path = 'upc';
    const targetSegment = urlTree.root.children.primary.segments[3];

    if (targetSegment) {
      path = targetSegment.path;
    }

    this.router.navigate([newId, path], {relativeTo: this.activatedRoute});
  }

  getStatusName(id): string {
    return this.constantsService.getNameById(id, 'sc_status');
  }
}
