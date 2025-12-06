import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pkz-select-all',
  styleUrls: ['./select-all.component.scss'],
  templateUrl: 'select-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectAllComponent implements OnInit, OnChanges {
  @Input() areaTitle = '';
  @Input() items: any[] = [];
  @Input() disabledItems: any[] = [];
  @Input() selectedItems: any[] = [];
  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  formattedItems: any[] = [];
  isSelectedAll = false;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes) {
    this.formatItems();
    this.setSelectedAll();
  }

  toggleItem(val, item) {
    item.checked = val;

    this.emitChanges();
  }

  onSelectAll(val) {
    this.isSelectedAll = val;

    this.selectedItems = val ? this.items : [];
    this.formatItems();
    this.emitChanges();
  }

  private formatItems() {
    if (!this.items || !this.items.length) {
      return;
    }

    this.formattedItems = [];

    for (const item of this.items) {
      const obj = {
        ...item,
        checked: this.selectedItems.some(selItem => selItem.name === item.name),
        disabled: this.disabledItems.some(disItem => disItem.name === item.name)
      };
      this.formattedItems.push(obj);
    }
  }

  private emitChanges() {
    const items = this.formattedItems
      .filter(({checked}) => checked);

    this.select.emit(items);
  }

  private setSelectedAll() {
    const itemsLength = this.items.length;
    const checkedItemsLength = this.formattedItems.filter(({checked}) => checked).length;
    this.isSelectedAll = (itemsLength === checkedItemsLength);
  }
}
