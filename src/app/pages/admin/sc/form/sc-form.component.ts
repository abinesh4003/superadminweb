import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SC_STATUS_ALPHA, SC_TYPE_PUBLIC } from '@app/core/constants';
import { IdName } from '@app/core/models/common.models';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { ScFormService } from '@app/pages/admin/sc/form/sc-form.service';
import { ScPermissionsConstants } from '@app/pages/admin/sc/sc-permissions.constants';
import { ScService } from '@app/pages/admin/sc/sc.service';
import { PagesService } from '@app/pages/pages.service';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { TreeComponent, TreeController } from 'ng2-tree';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { switchMap } from 'rxjs/operators/switchMap';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-sc-form',
  templateUrl: 'sc-form.component.html',
  styleUrls: ['./sc-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pageType: string;
  private categoryId: string;

  form: FormGroup;
  types$: Observable<IdName[]>;
  storeIcon: File|string|null;
  status = '';
  newCategoryName = '';
  perms = ScPermissionsConstants;
  imageOptions = {path: 'sc/img/vw'};
  categoriesTree;

  @ViewChild(TreeComponent) private treeCmp: TreeComponent;

  constructor(
    private fb: FormBuilder,
    private constantsService: ConstantsService,
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private pagesService: PagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private carouselService: CarouselService,
    private scService: ScService,
    private scFormService: ScFormService,
    private formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(({page, id}) => {
          this.categoryId = id;
          this.pageType = page;
          this.categoriesTree = this.scFormService.getDefaultSettings();
          this.initForm();
        }),
        switchMap((data: any) => this.getItemData(data))
      )
      .subscribe(data => {
        this.setLoadedData(data);
        this.setFormLists();
        this.checkNameDuplicate();
      });
  }

  onAddCategory(node) {
    const cb = (ctrl: TreeController) => {
      ctrl.addChild({value: '', children: []});
    };
    this.treeAction(node.id, cb);
  }

  onRenameCategory(node) {
    const cb = (ctrl) => ctrl.startRenaming();
    this.treeAction(node.id, cb);
  }

  onRemoveCategory(node) {
    const cb = (ctrl) => {
      this.pagesService.confirmActionModal(node.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          ctrl.remove();
          this.cd.markForCheck();
        });
    };
    this.treeAction(node.id, cb);
  }

  private treeAction(id, callback) {
    const treeController = id === 'root'
      ? this.treeCmp.rootComponent.controller
      : this.treeCmp.getControllerByNodeId(id);

    if (!treeController) {
      return;
    }

    callback(treeController);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave() {
    const cb = () => {
      this.navigateToStores();
    };
    this.submitForm(cb);
  }

  onSaveNext() {
    const cb = (resp) => {
      if (this.isAddPage()) {
        this.router.navigate([`pages/admin/sc/edit/${resp.data._id}/tmp`]);
      } else {
        this.router.navigate(['tmp'], {relativeTo: this.activatedRoute});
      }
    };
    this.submitForm(cb);
  }

  onNext() {
    this.router.navigate(['tmp'], {relativeTo: this.activatedRoute});
  }

  onImageChange(event) {
    if (this.isImageSaved()) {
      this.api.deleteStoreCategoryImage(this.categoryId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.storeIcon = event;
          this.cd.markForCheck();
        });
    } else {
      this.storeIcon = event;
    }
  }

  onZoom() {
    this.carouselService.open(this.storeIcon, this.imageOptions.path)
      .subscribe();
  }

  isFormValid(): boolean {
    return this.form.valid && !!this.storeIcon;
  }

  addCategoryName() {
    const name = this.newCategoryName.trim();

    if (!name) {
      return;
    }

    const cb = (ctrl: TreeController) => {
      ctrl.addChild({value: name, children: []});
      this.newCategoryName = '';
    };
    this.treeAction('root', cb);
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  isEditPage() {
    return this.pageType === 'edit';
  }

  isAddPage() {
    return this.pageType === 'add';
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  isFormDisabled() {
    return this.isViewPage();
  }

  getSubBreadcrumbName() {
    if (this.isAddPage()) {
      return 'New Store Category';
    } else {
      return this.name.value;
    }
  }

  navigateToStores(event?) {
    if (event) {
      event.preventDefault();
    }

    this.router.navigate(['pages/admin/sc']);
  }

  isInvalidField(fieldName) {
    const field = this[fieldName];
    return this.formHelper.isInvalidField(field);
  }

  private submitForm(callback): void {
    if (!this.isFormValid()) {
      return;
    }

    const observable = this.isAddPage()
      ? this.api.createStoreCategory(this.getPreparedFormData())
      : this.api.updateStoreCategory(this.categoryId, this.getPreparedFormData());

    observable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((resp) => callback(resp));
  }

  private getItemData({id}) {
    if (id && !this.isAddPage()) {
      return this.api.viewStoreCategory(id);
    }

    return of(null);
  }

  private setLoadedData(data) {
    if (!data) {
      return;
    }

    const {status, type, display_name: name, image, product_category} = data;
    const category_keywords = this.getCategoryKeywords(data);
    const formConfig = {status, type, name, category_keywords};

    this.categoriesTree = this.scFormService.getCategoriesTree(product_category);
    this.storeIcon = image;

    this.form.setValue(formConfig);
    this.cd.markForCheck();
  }

  private getCategoryKeywords({category_keywords = []}) {
    if (!category_keywords) {
      return [];
    }

    return category_keywords.filter(item => !['null', 'undefined', ''].includes(item));
  }

  private checkNameDuplicate() {
    this.name.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(500),
        switchMap((qry) => {
          if (qry) {
            return this.api.checkDuplicateCategoryName({qry});
          }

          return of(qry);
        })
      )
      .subscribe((data) => {
        if (!data) {
          return;
        }

        if (!data.success) {
          this.name.setErrors({'duplicatedField': true});
        }
        this.cd.markForCheck();
      });
  }

  private getPreparedFormData() {
    if (!this.form.get('category_keywords').value.length) {
      this.form.get('category_keywords').setValue(['']);
    }

    const data = {
      ...this.form.value,
      product_category: this.scFormService.getTreeData(this.treeCmp.tree.children)
    };
    const formData = this.formHelper.getFormData(data);

    if (!this.isImageSaved()) {
      this.formHelper.handleFileFormData(formData, this.storeIcon, 'icon');
    }

    return formData;
  }

  private isImageSaved() {
    return typeof this.storeIcon === 'string';
  }

  private setFormLists(): void {
    this.types$ = this.scService.getFormattedCategoryTypes();
    this.status = this.constantsService.getNameById(
      this.form.get('status').value,
      this.constantsService.getListByKey('sc_status')
    );
  }

  private initForm(): void {
    const config = {
      status: SC_STATUS_ALPHA,
      type: SC_TYPE_PUBLIC,
      name: ['', Validators.required],
      category_keywords: [{ value: [], disabled: this.isFormDisabled() }]
    };

    this.form = this.fb.group(config);
  }

  get name() {
    return this.form.get('name');
  }

  get category_keywords() {
    return this.form.get('category_keywords');
  }
}
