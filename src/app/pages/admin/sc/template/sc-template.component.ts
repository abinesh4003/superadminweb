import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SC_STATUS_ALPHA, SC_STATUS_LIVE } from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { ScPermissionsConstants } from '@app/pages/admin/sc/sc-permissions.constants';
import { ScCustomFieldModalComponent } from '@app/pages/admin/sc/template/sc-custom-field-modal/sc-custom-field-modal.component';
import { PagesService } from '@app/pages/pages.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';
import * as XLSX from 'xlsx';

@Component({
  selector: 'pkz-sc-template',
  templateUrl: 'sc-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScTemplateComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pageType: string;
  private categoryId: string;

  isPageLoaded = false;
  origData: any;
  rows: any[];
  sorts: any[];
  perms = ScPermissionsConstants;

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private constantsService: ConstantsService,
    private modalService: ModalService,
    private pagesService: PagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(({page, id}) => {
          this.categoryId = id;
          this.pageType = page;
        }),
        switchMap(({id}) => this.api.viewStoreCategory(id))
      )
      .subscribe(data => {
        this.initPage(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getFormatName(id): string {
    return this.constantsService.getNameById(id, 'sc_format');
  }

  isEditPage() {
    return this.pageType === 'edit';
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  submitData(): void {
    const data = {
      template: this.formatRows(this.rows)
    };
    this.api.updateStoreCategoryViewTemplate(this.origData._id, data)
      .subscribe();
  }

  private formatRows(rows) {
    return rows.map(row => {
      if (row.hasOwnProperty('default') && (row.default === null || row.default === undefined)) {
        delete row.default;
      }

      return row;
    });
  }

  onDeleteField(event, row): void {
    event.preventDefault();

    this.pagesService.confirmActionModal(row.display_name)
      .subscribe(() => {
        const rows = this.rows.slice();
        const index = rows.indexOf(row);

        if (index !== -1) {
          rows.splice(index, 1);
          this.rows = [...rows];
        }
      });
  }

  onPreview() {
    const headers = this.rows
      .filter(({req_store}) => req_store)
      .map(({key_name, display_name}) => {
        if (display_name.indexOf('%') !== -1) {
          return `${key_name}(%)`;
        }
        return key_name;
      });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);

    /* save to file */
    XLSX.writeFile(wb, `store-preview_${this.origData.display_name}.xlsx`);
  }

  addCustomField(): void {
    const allowedFieldNames = this.rows.map(({display_name}) => display_name.toLowerCase());
    this.modalService.open(ScCustomFieldModalComponent,
      {
        options: {
          size: 'lg'
        },
        data: {
          fieldNames: allowedFieldNames
        }
      })
      .subscribe(({key_id, key_name, ...result}) => {
        const rows = this.rows.slice();
        const keys = rows.map(item => item.key_id);
        const maxIndex = Math.max(...keys);
        key_name = this.convertDisplayNameToKeyName(result.display_name);
        key_id = maxIndex + 1;
        const fieldObj = {
          key_id,
          key_name,
          ...result
        };

        this.rows = [
          ...rows,
          fieldObj
        ];
      });
  }

  onChange(val, key, row): void {
    row[key] = val;
  }

  changeCategoryStatus() {
    const data = {
      status: this.isLiveStoreCategory() ? SC_STATUS_LIVE : SC_STATUS_ALPHA
    };

    this.api.updateStoreCategory(this.origData._id, data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  toggleStatusIcon() {
    const status = this.origData.status;
    this.origData.status = (status === SC_STATUS_LIVE)
      ? SC_STATUS_ALPHA
      : SC_STATUS_LIVE;
  }

  isLiveStoreCategory() {
    return this.origData.status === SC_STATUS_LIVE;
  }

  navigateToStores(event) {
    event.preventDefault();

    this.router.navigate(['pages/admin/sc']);
  }

  private initPage(data): void {
    this.origData = data;
    this.rows = data.template;
    this.initSorts();
  }

  private initSorts() {
    this.sorts = [{prop: 'key_id', dir: 'asc'}];
  }

  private convertDisplayNameToKeyName(value) {
    return value.toLowerCase().split(' ').join('_');
  }
}
