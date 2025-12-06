import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigureColumn } from '@app/core/models';

@Component({
  selector: 'pkz-table-configure-columns',
  templateUrl: 'table-configure-columns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableConfigureColumnsComponent implements OnInit {
  @Input() set columns(cols) {
    this.origColumns = cols;
    this.configureColumns = this.getConfigureColumns(cols);
  }
  @Output() changeColumns: EventEmitter<any> = new EventEmitter<any>();

  origColumns: any[];
  configureColumns: ConfigureColumn[];

  constructor() {}

  ngOnInit() {}

  toggleColumn(checked, col) {
    col.checked = checked;
    const filteredColumns = this.configureColumns
      .filter(item => item.checked)
      .map(item => {
        return this.origColumns.find(c => c.name === item.name);
      });

    this.changeColumns.emit(filteredColumns);
  }

  onSave() {

  }

  private getConfigureColumns(columns) {
    return columns.map(item => {
      return {
        ...item,
        checked: true
      };
    });
  }
}
