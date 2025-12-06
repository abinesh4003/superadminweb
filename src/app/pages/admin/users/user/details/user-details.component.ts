import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';
import { PagesService } from '@app/pages/pages.service';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { AppState, getActiveUser, getActiveUserId, getUserPageType } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators/first';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { skipWhile } from 'rxjs/operators/skipWhile';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-user-details',
  templateUrl: 'user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pageType: string;

  form: FormGroup;
  userPhoto: File|string;
  origData: any;
  userPhotoTitle = 'User photo';
  perms = UsersPermissionsConstants;
  imageOptions = {path: 'spad/us/img/vw'};

  constructor(
    private carouselService: CarouselService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private pagesService: PagesService,
    private store: Store<AppState>,
    private formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.store.select(getUserPageType)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        first(),
        tap((page) => {
          this.pageType = page;
          this.form = this.userService.getUserDetailsForm(this.isAddPage());
        }),
        mergeMap(() => this.store.select(getActiveUser)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        this.setLoadedData(data);
        this.checkEmailDuplicate();
        this.initBreadcrumb();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.origData = null;
  }

  isAddPage() {
    return this.pageType === 'add';
  }

  isEditPage() {
    return this.pageType === 'edit';
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    const observable = this.isAddPage()
      ? this.userService.createUser(this.getPreparedFormData())
      : this.updateUserProfile(this.getPreparedFormData());

    observable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((resp) => {
        if (this.isAddPage()) {
          const id = resp.data.user_id;
          this.router.navigate([`../edit/${id}/roles`], {relativeTo: this.activatedRoute.parent});
        }
      });
  }

  isFormDisabled() {
    return this.isViewPage();
  }

  private setLoadedData(data) {
    if (!data) {
      return;
    }

    const {first_name, last_name, email_id, profile_image, user_name} = data;
    const formConfig = {first_name, last_name, email_id};

    this.userPhoto = profile_image;
    this.userPhotoTitle = user_name;
    this.form.patchValue(formConfig);
    this.origData = data;
    this.cd.markForCheck();
  }

  private getPreparedFormData() {
    const userId = this.userService.getLoggedUserId();
    const {first_name, last_name, email_id, is_reset, passwords: { password }} = this.form.value;
    const data = {
      first_name,
      last_name,
      email_id,
      is_reset
    };

    if (!this.isEditPage() || this.isEditPage() && password && password.trim().length) {
      data['password'] = password;
    }

    if (this.isEditPage()) {
      data['modified_by'] = userId;
    } else {
      data['created_by'] = userId;
    }

    const formData = this.formHelper.getFormData(data);

    if (typeof this.userPhoto !== 'string') {
      this.formHelper.handleFileFormData(formData, this.userPhoto, 'profile_image');
    }

    return formData;
  }

  private checkEmailDuplicate() {
    this.email_id.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(1000),
        skipWhile((qry) => {
          if (!this.origData) {
            return false;
          }

          if (this.origData.email_id) {
            return this.origData.email_id === qry;
          }

          return false;
        }),
        switchMap((qry) => {
          if (qry) {
            return this.userService.checkEmail({qry});
          }

          return of(null);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        if (data && !data.success) {
          this.email_id.setErrors({'duplicatedField': true});
          this.cd.markForCheck();
        }
      });
  }

  onImageChange(event) {
    if (this.isImageSaved()) {
      this.store.select(getActiveUser)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          mergeMap(({_id}) => this.userService.deleteUserImage(_id))
        )
        .subscribe(() => {
          this.userPhoto = event;
          this.cd.markForCheck();
        });
    } else {
      this.userPhoto = event;
    }
  }

  private isImageSaved() {
    return typeof this.userPhoto === 'string';
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  onZoom() {
    this.carouselService.open(this.userPhoto, this.imageOptions.path)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  isInvalidField(fieldName) {
    const field = this[fieldName];
    return this.formHelper.isInvalidField(field);
  }

  isFormValid() {
    return this.form.valid;
  }

  private initBreadcrumb() {
    this.userService.dispatchBreadcrumb(this.isAddPage())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private updateUserProfile(data) {
    return this.store.select(getActiveUserId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((id) => this.userService.updateUsersUserProfile(id, data))
      );
  }

  get first_name() {
    return this.form.get('first_name');
  }

  get last_name() {
    return this.form.get('last_name');
  }

  get email_id() {
    return this.form.get('email_id');
  }

  get passwords() {
    return this.form.get('passwords');
  }

  get password() {
    return this.passwords.get('password');
  }

  get confirm_password() {
    return this.passwords.get('confirm_password');
  }
}
