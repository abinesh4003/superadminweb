import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pkz-table-delete-btn',
  templateUrl: 'table-delete-btn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDeleteBtnComponent implements OnInit {
  @Input() disabled = false;
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.delete.emit();
  }
}
