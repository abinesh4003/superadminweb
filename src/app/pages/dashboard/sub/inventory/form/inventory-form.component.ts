import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DB_INV_STATUS_DRAFT,
  DB_INV_STATUS_LIVE,
  DB_INV_STATUS_REJECTED,
  DB_INV_STATUS_SUSPENDED,
  DB_INV_STATUS_TERMINATED,
  DB_INV_STATUS_WAITING_REVIEW
} from '@app/core/constants';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { GlobalToasterService } from '@app/core/services/global-toaster.service';
import { InventoryFormService } from '@app/pages/dashboard/sub/inventory/form/inventory-form.service';
import { map } from 'rxjs/operators/map';
import { concatMap } from 'rxjs/operators/concatMap';
import { MessageHistoryModalComponent } from '../../shared/message-history-modal/message-history-modal.component';
import { InventoryService } from '@app/pages/dashboard/sub/inventory/inventory.service';
import { PagesService } from '@app/pages/pages.service';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import {
  AppState,
  getSubCategoryId,
  getInventoryStatusTab,
  isUpcInventoryTab
} from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { zip } from 'rxjs/observable/zip';
import { takeWhile } from 'rxjs/operators/takeWhile';
import { skipWhile } from 'rxjs/operators/skipWhile';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-inventory-form',
  styleUrls: ['./inventory-form.component.scss'],
  templateUrl: 'inventory-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pageType: string;
  private tabId: number;
  private status: number;
  private categoryId: string;
  private productId: string;

  isPageLoaded = false;
  form: FormGroup;
  formConfig: any[];
  imagesObj: { [key: string]: File|string } = {};
  imagesKeys: string[];
  rootBreadcrumbName: string;
  categories: string[];
  keywords: string[];
  assignUsers: any[];
  isUpcTab = true;
  isShownFeedbackError = false;
  defaultCategoryValue = null;
  perms;
  bindedInitForm;
  imageOptions = {path: 'inv/img/vw', width: 150};
  selectedCategoryPartials = [];
  selectorIndexes = [0];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private pagesService: PagesService,
    private store: Store<AppState>,
    private router: Router,
    private inventoryService: InventoryService,
    private inventoryFormService: InventoryFormService,
    private carouselService: CarouselService,
    private toaster: GlobalToasterService,
    private modalService: ModalService,
    private formHelper: FormHelperService
  ) {}

  ngOnInit() {
    zip(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      this.store.select(getSubCategoryId),
      this.store.select(isUpcInventoryTab)
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        takeWhile(([{page}, {tabId, status}, categoryId]) => {
          if (page === 'add') {
            return !!page && !!tabId && !!categoryId;
          }
          return !!page && !!tabId && !!status && !!categoryId;
        }),
        tap(([{page, id}, {tabId, status}, categoryId, isUpcTab]) => {
          this.perms = this.inventoryService.getPermissions(isUpcTab, tabId);
          this.tabId = +tabId;
          this.pageType = page;
          this.productId = id;
          this.categoryId = categoryId;
          this.isUpcTab = isUpcTab;
          this.inventoryService.changeInventoryStatusTab(this.tabId);
          this.rootBreadcrumbName = this.inventoryService.getStatusName(this.tabId);

          if (!this.isAddProduct()) {
            this.status = +status;
          }
        }),
        switchMap(() => {
          return this.inventoryFormService.getDashboardInventoryProductTemplate(this.isUpcTab, this.categoryId);
        }),
        concatMap((templates) => {
          this.bindedInitForm = this.initForm.bind(this, templates);
          this.bindedInitForm();
          this.initImagesData();
          this.handleFeedbackChange();

          return zip(
            this.getItemData(this.categoryId, this.productId, this.status),
            this.getDropdownOpts()
          );
        })
      )
      .subscribe(([data, [categories, keywords, assignUsers]]) => {
        this.categories = categories;
        this.assignUsers = assignUsers;
        this.keywords = keywords;
        this.setLoadedData(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });

    this.store.select(getInventoryStatusTab)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skipWhile(tabId => tabId === this.tabId)
      )
      .subscribe(() => this.navigateToProductsTable());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave() {
    let status = this.inventoryService.getStatusByTab(this.tabId);
    if (this.isWFRTab() && this.isProductSuspended()) {
      status = DB_INV_STATUS_SUSPENDED;
    }

    const cb = () => {
      if (!this.isWFRTab()) {
        this.navigateToProductsTable();
      }
    };

    if (this.isValidProductName()) {
      this.submitForm(status, cb, true);
    }
  }

  getCategoriesOptions(index) {
    const constructedCategory = this.getConstructedCategory(index);
    const category = index === 0 ? '' : constructedCategory;

    const opts = this.categories
      .filter(item => item.startsWith(category))
      .map(item => {
        return item.split('/').filter(el => !!el)[index];
      })
      .filter(el => !!el)
      .sort();

    return Array.from(new Set(opts));
  }

  onChangeSubCategory(event, index) {
    this.selectedCategoryPartials[index] = event;
    this.selectorIndexes = this.getIndexesArr(event ? index + 1 : index);
    this.selectedCategoryPartials = this.selectedCategoryPartials.filter(el => !!el).slice(0, this.selectorIndexes.length);

    this.updateCategoryFormControlValue();
    this.handleCategorySelectors();
  }

  private updateCategoryFormControlValue() {
    this.category.setValue(this.getConstructedCategory());
    this.category.markAsDirty();
  }

  private getIndexesArr(length) {
    length = length === 0 ? 1 : length;
    return Array.from({length}, (item, i) => i);
  }

  handleCategorySelectors() {
    const availableCategories = this.getAvailableCategoriesAfterSelection();
    const count = this.selectedCategoryPartials.filter(item => !!item).length;

    if (availableCategories.length) {
      this.selectorIndexes.push(count);
    }
  }

  private getAvailableCategoriesAfterSelection() {
    const selectedCategoryPath = this.getConstructedCategory();

    if (!selectedCategoryPath) {
      return [];
    }
    return this.categories
      .filter(item => item.startsWith(selectedCategoryPath))
      .map(item => item.replace(selectedCategoryPath, ''))
      .filter(item => !!item);
  }

  private getConstructedCategory(length = 0) {
    const selectedCategoryPartials = this.selectedCategoryPartials.filter(el => !!el);
    const partials = length
      ? selectedCategoryPartials.slice(0, length)
      : selectedCategoryPartials;

    const path = partials
      .filter(item => !!item)
      .join('/');

    if (!path) {
      return '';
    }

    return '/' + path;
  }

  private isProductSuspended() {
    return this.status === DB_INV_STATUS_SUSPENDED;
  }

  onSaveContinue() {
    const status = DB_INV_STATUS_DRAFT;
    const cb = () => {
      this.addNewProduct();
    };

    if (this.isValidProductName()) {
      this.submitForm(status, cb, true);
    }
  }

  private isValidProductName() {
    this.product_name.markAsDirty();
    return !this.isInvalidField('product_name');
  }

  onSubmitContinue() {
    const status = DB_INV_STATUS_WAITING_REVIEW;
    const cb = () => {
      this.addNewProduct();
    };
    this.submitForm(status, cb);
  }

  onSubmitForReview() {
    const status = DB_INV_STATUS_WAITING_REVIEW;
    const cb = () => {
      this.navigateToProductsTable();
    };
    this.submitForm(status, cb);
  }

  onCancel() {
    const message = 'Do you want to Cancel and go back?';
    this.modalAfterFormChanged(message)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.navigateToProductsTable();
      });
  }

  onApproveSale() {
    const data = {status: DB_INV_STATUS_LIVE};

    if (!this.canSubmitForm()) {
      return;
    }

    this.changeStatus(this.categoryId, this.productId, data);
  }

  onReject() {
    const data = {
      status: DB_INV_STATUS_REJECTED,
      feedback: this.getUserFeedback(),
      rejected_by: this.getRejectedBy()
    };
    const message = `Changes not saved!, are you still want to reject <b>${this.getProductName()}</b>?`;
    let observable;

    if (this.form.dirty) {
      observable = this.modalAfterFormChanged(message);
    } else if (this.isUserFeedbackValid()) {
      observable = this.pagesService.confirmActionModal(this.getProductName(), 'reject');
    } else {
      this.isShownFeedbackError = true;
      return;
    }

    observable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeStatus(this.categoryId, this.productId, data);
      });
  }

  private getRejectedBy() {
    return this.isMDraftTab() ? 'admin' : 'reviewer';
  }

  onTerminate() {
    this.changeStatusWithFeedback(DB_INV_STATUS_TERMINATED, 'terminate');
  }

  onSuspend() {
    this.changeStatusWithFeedback(DB_INV_STATUS_SUSPENDED, 'suspend');
  }

  private modalAfterFormChanged(message) {
    if (this.form.dirty) {
      return this.modalService.openConfirm({
        message,
        options: {
          size: 'sm'
        }
      });
    }

    return of(null);
  }

  private changeStatusWithFeedback(status, action) {
    const data = {
      status,
      feedback: this.getUserFeedback(),
      rejected_by: this.getRejectedBy()
    };

    if (this.isUserFeedbackValid()) {
      this.pagesService.confirmActionModal(this.getInventoryIdentifier(), action)
        .subscribe(() => this.changeStatus(this.categoryId, this.productId, data));
    } else {
      this.isShownFeedbackError = true;
    }
  }

  isSaveAllowed() {
    return this.hasPermission(this.perms.edit) && this.isEditProduct()
      || this.hasPermission(this.perms.add_new_product) && (this.isAddProduct() || this.isCopyProduct());
  }

  isSaveContinueAllowed() {
    return this.isDraftTab() && this.isSaveAllowed();
  }

  isSubmitContinueAllowed() {
    return this.isDraftTab() && this.isSaveAllowed();
  }

  isSubmitForReviewAllowed() {
    return this.isDraftTab() || this.isMDraftTab();
  }

  isRejectAllowed() {
    return this.hasPermission(this.perms.reject)
      && !this.isAddProduct()
      && !this.isCopyProduct()
      && (
        this.isMDraftTab() ||
        this.isWFRTab() ||
        this.isLiveTab() && this.isProductSuspended()
      );
  }

  isApproveForSaleAllowed() {
    return this.hasPermission(this.perms.approve) &&
      (
        this.isWFRTab()
        || this.isLiveTab() && this.isProductSuspended()
      );
  }

  isFeedbackAllowed() {
    return this.isRejectAllowed() || this.isTerminateAllowed() || this.isSuspendAllowed();
  }

  isCancelAllowed() {
    return !this.isLiveTab();
  }

  isOkAllowed() {
    return this.isLiveTab();
  }

  isTerminateAllowed() {
    return !this.isProductSuspended() && this.hasPermission(this.perms.terminate) && this.isLiveTab();
  }

  isSuspendAllowed() {
    return !this.isProductSuspended() && this.hasPermission(this.perms.suspend) && this.isLiveTab();
  }

  isAssignToAllowed() {
    return this.isSubmitForReviewAllowed();
  }

  isDraftTab() {
    return this.inventoryService.isDraftTab(this.tabId);
  }

  isMDraftTab() {
    return this.inventoryService.isMDraftTab(this.tabId);
  }

  isWFRTab() {
    return this.inventoryService.isWFRTab(this.tabId);
  }

  isLiveTab() {
    return this.inventoryService.isLiveTab(this.tabId);
  }

  isInvalidField(fieldName) {
    const field = this.form.get(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  isFormValid() {
    return this.form.valid;
  }

  onImageChange(event, key) {
    if (this.isImageSaved(key)) {
      this.inventoryFormService.deleteInventoryImage(
        this.categoryId,
        this.productId,
        key,
        this.imagesObj[key]
      )
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.imagesObj[key] = event;
          this.form.markAsDirty();
          this.cd.markForCheck();
        });
    } else {
      this.imagesObj[key] = event;
      this.form.markAsDirty();
    }
  }

  private isImageSaved(key) {
    return typeof this.imagesObj[key] === 'string' && !this.isCopyProduct();
  }

  onZoom(event, key) {
    this.carouselService.open(this.imagesObj, this.imageOptions.path, key)
      .subscribe();
  }

  isViewProduct() {
    return this.pageType === 'view';
  }

  isAddProduct() {
    return this.pageType === 'add';
  }

  isEditProduct() {
    return this.pageType === 'edit';
  }

  isCopyProduct() {
    return this.pageType === 'copy';
  }

  isFormDisabled() {
    return this.isViewProduct();
  }

  getSubBreadcrumbName() {
    if (this.isViewProduct() || this.isEditProduct()) {
      return this.getProductName();
    }

    return 'Add new product';
  }

  private getProductName() {
    return this.product_name.value;
  }

  getOptions(fieldName) {
    switch (fieldName) {
      case 'keywords':
        return this.keywords;
      case 'category':
        return this.categories;
    }
  }

  isUserFeedbackValid() {
    const feedback = this.getUserFeedback();

    return !!feedback && feedback.trim().length > 0;
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  openMessageHistory() {
    this.modalService.open(MessageHistoryModalComponent, {
      options: {
        windowClass: 'modal-size-700'
      },
      data: {
        messages: this.feedback.value,
        feedback: this.getUserFeedback(),
        isFeedbackAllowed: this.isFeedbackAllowed()
      }
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(message => {
        this.userFeedback.setValue(message);
      });
  }

  isMessageHistoryBtnAllowed() {
    const feedback = this.feedback.value;
    return Array.isArray(feedback) && feedback.length > 0;
  }

  private addNewProduct() {
    if (this.isAddProduct()) {
      this.resetForm();
    } else {
      this.router.navigate(['add'], {
        relativeTo: this.activatedRoute.parent,
        queryParams: this.activatedRoute.snapshot.queryParams
      });
    }
  }

  private getDropdownOpts() {
    return zip(
      this.inventoryFormService.getDashboardInventoryProductCategories(this.categoryId),
      this.inventoryFormService.getDashboardInventoryProductKeywords(this.categoryId),
      this.inventoryFormService.getAssignToUsers(this.isUpcTab, this.categoryId)
    );
  }

  private changeStatus(categoryId, productId, data) {
    const added_by = this.form.get('added_by').value;
    this.isShownFeedbackError = false;
    this.inventoryFormService.changeStatusDashboardInventoryProduct(this.isUpcTab, categoryId, productId, added_by, data)
      .subscribe(() => {
        this.navigateToProductsTable();
      });
  }

  private initImagesData() {
    this.imagesKeys = Array.from({ length: 6 }, (item, i) => `image${i + 1}`);
    this.imagesObj = {};

    for (const key of this.imagesKeys) {
      this.imagesObj[key] = null;
    }
  }

  private getItemData(categoryId, productId, status) {
    if (productId) {
      return this.inventoryFormService.getDashboardInventoryProductView(this.isUpcTab, categoryId, productId, {status})
        .pipe(
          map(data => {
            if (this.isCopyProduct()) {
              const {upc, sku, ...rest} = data;

              return rest;
            }
            return data;
          })
      );
    }

    return of(null);
  }

  private setLoadedData(data) {
    if (!data) {
      return;
    }

    const formObj = {};

    [
      'feedback',
      'review_assigned',
      'draft_assigned',
      'added_by'
    ]
      .filter((key) => !!data[key])
      .forEach(key => formObj[key] = data[key]);

    this.formConfig
      .forEach(({name}) => {
        let dataValue = data[name];

        if (dataValue === undefined || dataValue === 'undefined') {
          return;
        }

        if (dataValue === 'null') {
          dataValue = null;
        } else if (Array.isArray(dataValue)) {
          dataValue = dataValue.filter(item => !['null', 'undefined', ''].includes(item));
        }

        formObj[name] = dataValue;
      });

    this.setLoadedCategory(data);
    this.setImages(data);

    if (!this.assignUsers.some(({_id}) => _id === formObj['review_assigned'])) {
      formObj['review_assigned'] = '';
    }

    this.form.patchValue(formObj);
    this.cd.markForCheck();
  }

  private setLoadedCategory(data) {
    if (!data.category) {
      return;
    }
    const categories = data.category.split('/').filter(el => !!el);

    if (!categories.length) {
      return;
    }

    this.selectedCategoryPartials = categories;
    this.selectorIndexes = this.getIndexesArr(categories.length);
  }

  private setImages(data) {
    data.images.forEach(({keyid, name}) => this.imagesObj[keyid] = name);
  }

  private navigateToProductsTable() {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  private submitForm(status, callback, skipValidation = false): void {
    this.isShownFeedbackError = false;

    if (!this.canSubmitForm(skipValidation)) {
      return;
    }

    const observable = (this.isAddProduct() || this.isCopyProduct())
      ? this.inventoryFormService.addDashboardInventoryProduct(
          this.isUpcTab,
          this.categoryId,
          this.getPreparedFormData(status)
        )
      : this.inventoryFormService.updateDashboardInventoryProduct(
          this.isUpcTab,
          this.categoryId,
          this.productId,
          this.getPreparedFormData(status)
        );

    observable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        callback();
        this.form.markAsPristine();
        this.cd.markForCheck();
      });
  }

  private canSubmitForm(skipValidation = false) {
    if (!skipValidation) {
      if (!this.isFormValid()) {
        this.formHelper.showErrorForMissedFields(this.form.controls);
        return false;
      }

      if (!this.imagesObj.image1) {
        this.toaster.showError('The first image is mandatory.');
        return false;
      }

      if (this.getImagesCount() < 1) {
        this.toaster.showError('Minimum 1 images required');
        return false;
      }
    }

    return true;
  }

  private getImagesCount() {
    return Object.values(this.imagesObj).filter(item => !!item).length;
  }

  private initForm(data): void {
    const isNewProduct = this.isAddProduct() || this.isCopyProduct();
    const config = this.inventoryFormService.getFormConfig(data, isNewProduct, this.isFormDisabled());

    this.formConfig = this.inventoryFormService.getConfigForTemplate(data);
    this.form = this.fb.group(config);
  }

  private getPreparedFormData(status) {
    const {feedback, userFeedback, ...rest} = this.form.getRawValue();
    const data = {
      ...rest,
      status,
      draft_assigned: this.pagesService.getLoggedUserId()
    };

    const formData = this.formHelper.getFormData(data);

    Object.entries(this.imagesObj).forEach(([key, val]) => {
      if (!val || typeof val ===  'string') {
        return;
      }
      this.formHelper.handleFileFormData(formData, val, key);
    });

    return formData;
  }

  private resetForm() {
    this.bindedInitForm();
    this.initImagesData();
  }

  private getInventoryIdentifier() {
    const key = this.isUpcTab ? 'upc' : 'sku';

    return this.form.get(key).value;
  }

  private getUserFeedback() {
    return this.userFeedback.value;
  }

  private handleFeedbackChange() {
    this.userFeedback.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.isUserFeedbackValid()) {
          this.isShownFeedbackError = false;
        }
        this.userFeedback.markAsPristine();
      });
  }

  get category() {
    return this.form.get('category');
  }

  get product_name() {
    return this.form.get('product_name');
  }

  get feedback() {
    return this.form.get('feedback');
  }

  get userFeedback() {
    return this.form.get('userFeedback');
  }
}
