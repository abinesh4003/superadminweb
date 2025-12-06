import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { InventoryListService } from '@app/pages/dashboard/sub/inventory/list/inventory-list.service';
import { AppState, isUpcInventoryTab } from '@app/store/root-reducer';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver/FileSaver';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-bulk-upload-modal',
  templateUrl: 'bulk-upload-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkUploadModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  isFileProgress = false;
  isFileUploaded = false;
  data: any;
  file: File;
  isUpcTab = true;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private cd: ChangeDetectorRef,
    private inventoryListService: InventoryListService,
    private store: Store<AppState>,
    private formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.store.select(isUpcInventoryTab)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => this.isUpcTab = value);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onDownload() {
    this.inventoryListService.getDashboardInventorySampleDownload(this.isUpcTab, this.data.categoryId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({blob, filename}) => {
        saveAs(blob, filename);
        this.close();
      });
  }

  onUpload(file) {
    const data = {
      status: 1,
      added_by: 'admin'
    };

    const formData = this.formHelper.getFormData(data);
    this.formHelper.handleFileFormData(formData, file, 'template');
    this.isFileProgress = true;
    this.inventoryListService.makeDashboardInventoryBulkUpload(this.isUpcTab, this.data.categoryId, formData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((progressData) => {
        this.isFileUploaded = progressData.done;
        this.cd.markForCheck();
      });
  }

  onFileChange(event) {
    const files = event.target.files;
    if (!(files && files[0])) {
      return;
    }

    this.file = files[0];
    this.onUpload(this.file);
  }

  getUploadedValue() {
    if (this.isFileUploaded) {
      return 100;
    } else if (this.isFileProgress) {
      return 50;
    }

    return 0;
  }

  close(): void {
    this.ngbActiveModal.close();
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
