import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
  PROMOTION_ANNOUNCEMENT_TAB_PUSH,
  PROMOTION_ANNOUNCEMENT_TAB_SMS
} from '@app/core/constants';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { PagesService } from '@app/pages/pages.service';
import { AnnouncementFormService } from '@app/pages/promotion/announcement/form/announcement-form.service';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { tap } from 'rxjs/operators/tap';
import { catchError } from 'rxjs/operators/catchError';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { delay } from 'rxjs/operators/delay';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { finalize } from 'rxjs/operators/finalize';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil, } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-announcement-form',
  templateUrl: 'announcement-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementFormComponent implements OnInit, OnDestroy {
  pageType = '';
  form: FormGroup;
  storesLoading = false;
  stores$: Observable<any>;
  storesTypeahead$ = new Subject<string>();
  customerCount: number;
  perms;
  isPageLoaded = false;
  targetTypes = [{id: 1, name: 'Customer'}, {id: 2, name: 'Merchant'}, {id: 3, name: 'Both'}];

  private ngUnsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private service: AnnouncementFormService,
    private pagesService: PagesService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private formHelper: FormHelperService
  ) {
  }

  ngOnInit() {
    this.pageType = this.route.snapshot.data['pageType'];
    this.perms = this.service.getPermissions(this.pageType);
    this.searchForStores();
    this.initForm();
    this.loadPageData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isFormDisabled() {
    return !this.pagesService.hasPermission(this.perms.edit);
  }

  isSMSPage() {
    return this.pageType === PROMOTION_ANNOUNCEMENT_TAB_SMS;
  }

  isPushPage() {
    return this.pageType === PROMOTION_ANNOUNCEMENT_TAB_PUSH;
  }

  isEmailPage() {
    return this.pageType === PROMOTION_ANNOUNCEMENT_TAB_EMAIL;
  }

  isFormValid() {
    return this.form.valid;
  }

  isInvalidField(fieldName) {
    const field = this.form.get(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  onTest() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    this.service.testAction(this.pageType, this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onPublish() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    this.service.publishAction(this.pageType, this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.resetForm();
      });
  }

  onReset() {
    this.resetForm();
  }

  get allowedMessageLength() {
    if (this.isPushPage()) {
      return 256;
    } else if (this.isSMSPage()) {
      return 280;
    }
  }

  private searchForStores() {
    this.stores$ = this.storesTypeahead$
      .pipe(
        filter(keyword => keyword.trim().length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(keyword => {
          this.storesLoading = true;
          this.cd.detectChanges();
          return this.service.searchAdsStoreList(keyword).pipe(
            finalize(() => this.storesLoading = false),
            catchError(() => of([]))
          );
        }),
        delay(800)
      );
  }

  private initForm() {
    const config = this.service.getFormConfig(this.pageType, this.allowedMessageLength);
    this.form = this.fb.group(config);
  }

  private loadPageData() {
    combineLatest(
      this.selectedStore.valueChanges.pipe(
        startWith(null),
        map(item => item && item._id || '')
      ),
      this.form.get('targetType').valueChanges.pipe(startWith(null))
    )
      .pipe(
        switchMap(([storeId, targetType]) => this.getCustomerCount(storeId, targetType)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  private getCustomerCount(storeId, targetType) {
    return this.service.getPromotionAnnouncementCustomerCount(storeId, targetType).pipe(
      tap((count) => this.customerCount = count),
      catchError(() => empty()),
      finalize(() => {
        this.isPageLoaded = true;
        this.cd.detectChanges();
      })
    );
  }

  textareaRowsCount() {
    if (this.isSMSPage()) {
      return 7;
    } else if (this.isPushPage()) {
      return 10;
    } else if (this.isEmailPage()) {
      return 15;
    }
  }

  get message() {
    return this.form.get('message');
  }

  get selectedStore() {
    return this.form.get('selectedStore');
  }

  private resetForm() {
    this.form.reset();
    this.form.get('option').setValue(1);
  }
}
