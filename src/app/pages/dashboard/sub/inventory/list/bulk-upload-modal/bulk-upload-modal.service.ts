import { Injectable } from '@angular/core';
import { BulkUploadModalComponent } from '@app/pages/dashboard/sub/inventory/list/bulk-upload-modal/bulk-upload-modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { AppState, getSubCategoryId } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';

@Injectable()
export class BulkUploadModalService {

  constructor(
    private store: Store<AppState>,
    private modalService: ModalService
  ) {}

  openBulkUploadModal() {
    return this.store.select(getSubCategoryId)
      .pipe(
        switchMap((categoryId) => {
          const data = {
            options: {
              centered: true,
              windowClass: 'modal-size-700'
            },
            data: { categoryId }
          };

          return of(data);
        }),
        mergeMap((data) => this.modalService.open(BulkUploadModalComponent, data))
      );
  }
}
