import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  OnDestroy,
  OnInit, QueryList, ViewChildren
} from '@angular/core';
import { PagesService } from '@app/pages/pages.service';
import { PromotionAdsScratchCardPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-reward-modal',
  templateUrl: 'reward-modal.component.html',
  styleUrls: ['./reward-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardModalComponent implements OnInit, OnDestroy {
  title: string;
  newItem = '';
  data: any;
  list: any[];
  inputType: string;
  perms = PromotionAdsScratchCardPermissionsConstants;
  @ViewChildren('input') inputRefs: QueryList<ElementRef>;
  private editItemIndex = null;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private pagesService: PagesService
  ) {
  }

  ngOnInit() {
    this.inputType = this.data.inputType || 'text';
    this.list = this.data.list || [];
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  close(): void {
    const list = this.inputRefs.map(item => item.nativeElement.value);
    this.ngbActiveModal.close(list);
  }

  isItemEditing(index) {
    return this.editItemIndex === index;
  }

  onAddItem() {
    const item = this.newItem.trim();

    if (!item) {
      return;
    }

    this.list.unshift(item);
    this.newItem = '';
  }

  onEditItem(input: HTMLInputElement, index) {
    if (input) {
      input.focus();
    }
    this.editItemIndex = index;
  }

  onUpdateItem() {
    this.editItemIndex = null;
  }

  isEditAllowed() {
    return this.hasPermission(this.perms.edit);
  }

  private hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  onDeleteItem(index) {
    this.list = this.list.filter((elem, i) => i !== index);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
