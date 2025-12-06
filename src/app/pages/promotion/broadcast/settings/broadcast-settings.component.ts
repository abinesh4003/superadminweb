import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '@app/pages/pages.service';
import { PromotionBroadcastMerchantsPermissionsConstants } from '@app/pages/promotion/broadcast/promotion-broadcast-permissions.constants';
import { PromotionBroadcastService } from '@app/pages/promotion/broadcast/promotion-broadcast.service';
import { BroadcastSettingsService } from '@app/pages/promotion/broadcast/settings/broadcast-settings.service';
import { Subject } from 'rxjs/Subject';
import { finalize } from 'rxjs/operators/finalize';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  templateUrl: 'broadcast-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BroadcastSettingsComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  rootBreadcrumbName: string;
  form: FormGroup;
  promoId: string;
  promoContactsId: string;
  requestType: string;
  promoDetails: any;
  perms = PromotionBroadcastMerchantsPermissionsConstants;

  private ngUnsubscribe = new Subject();

  constructor(
    private promotionBroadcastService: PromotionBroadcastService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: BroadcastSettingsService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private pagesService: PagesService
  ) {
  }

  ngOnInit() {
    this.rootBreadcrumbName = this.promotionBroadcastService.getTabNameByRoute(this.route);
    this.promoId = this.route.snapshot.paramMap.get('promoId');
    this.promoContactsId = this.route.snapshot.paramMap.get('promoContactsId');
    this.requestType = this.route.snapshot.paramMap.get('requestType');
    this.loadPromotionDetails();
  }

  private loadPromotionDetails() {
    this.service.getRequestView({
      _id: this.promoId,
      promo_contacts_id: this.promoContactsId,
      request_type: this.requestType
    })
      .pipe(
        finalize(() => {

        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.initForm(data);
        this.isPageLoaded = true;
        this.cd.detectChanges();
      });
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isFormDisabled() {
    return !this.pagesService.hasPermission(this.perms.edit);
  }

  onReject() {
    this.service.rejectRequestView(this.promoId, this.requestType)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.navigateBack());
  }

  onApprove() {
    if (!this.isFormValid()) {
      return;
    }

    this.service.approveRequestView({
      _id: this.promoId,
      short_message: this.form.get('shortMessage').value.trim(),
      request_type: this.requestType
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.navigateBack());
  }

  onTestEmail() {
    const data = {
      email_template_id: this.promoDetails.promotion_types.email_template_id
    };

    this.service.openTestEmailModal(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  isFormValid() {
    return this.form.valid;
  }

  onTestSMS() {
    if (!this.isFormValid()) {
      return;
    }

    const data = {
      text_message: this.form.get('shortMessage').value.trim()
    };
    this.service.openTestSMSModal(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm(data) {
    const promotionTypes = data.promotion_types;
    const shortMessage = promotionTypes.short_message || '';
    const smsCount = promotionTypes.sms && promotionTypes.sms.sms_count || null;
    const pushCount = promotionTypes.push && promotionTypes.push.push_count || null;
    const emailCount = promotionTypes.email && promotionTypes.email.email_count || null;
    const config = {
      shortMessage: [shortMessage || '', Validators.maxLength(160)],
      smsCount,
      pushCount,
      emailCount,
      emailTemplateTitle: promotionTypes.email_template_title,
      shortMessageTitle: promotionTypes.short_message_title
    };
    this.form = this.fb.group(config);
    this.promoDetails = data;
  }
}
