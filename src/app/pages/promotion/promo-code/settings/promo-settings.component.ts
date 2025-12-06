import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '@app/pages/pages.service';
import { PromoService } from '@app/pages/promotion/promo-code/promo.service';
import { PromoSettingsService } from '@app/pages/promotion/promo-code/settings/promo-settings.service';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-promo-settings',
  templateUrl: 'promo-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoSettingsComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  rootBreadcrumbName: string;
  form: FormGroup;
  promoId: string;
  data;
  perms;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private promoService: PromoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PromoSettingsService,
    private cd: ChangeDetectorRef,
    private pagesService: PagesService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.promoId = this.route.snapshot.paramMap.get('id');
    this.perms = this.promoService.getPermissions(this.route);
    this.rootBreadcrumbName = this.promoService.getTabNameByRoute(this.route);
    this.getItemData(this.promoId)
      .subscribe(data => {
        this.data = data;
        this.isPageLoaded = true;
        this.cd.markForCheck();
        console.log(data);
      });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getItemData(id) {
    return this.service.getPromoCodeDetails({_id: id});
  }

  isFormDisabled() {
    return !this.pagesService.hasPermission(this.perms.edit);
  }

  onToggleActivate() {
    this.service.togglePromoCodeActivation({_id: this.data._id})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.navigateBack();
      });
  }

  private navigateBack() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  isActivePromo() {
    return this.data.promo_active_status === 1;
  }

  onSave() {
//  todo
  }

  onSubmitRequest() {
//  todo
  }

  private initForm() {
    const config = {
      text: ''
    };
    this.form = this.fb.group(config);
  }
}
