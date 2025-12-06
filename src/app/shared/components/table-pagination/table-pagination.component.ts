import {
  ChangeDetectionStrategy,
  Component, Input,
  OnInit
} from '@angular/core';
import { StorageService } from '@app/core/services/storage.service';
import { DataTableFooterComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'pkz-table-pagination',
  styleUrls: ['./table-pagination.component.scss'],
  templateUrl: 'table-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePaginationComponent extends DataTableFooterComponent implements OnInit {
  @Input() pageSize: number;
  @Input() limits = [25, 50, 75, 100, 500];

  constructor(
    private storage: StorageService
  ) {
    super();
  }

  ngOnInit() {
    this.initRowsPerPage();
  }

  private initRowsPerPage() {
    if (this.limits.includes(this.pageSize)) {
      this.storage.setRowsPerPage(this.pageSize);
    } else {
      this.storage.setRowsPerPage(this.limits[0]);
    }
  }

  onChangeLimit(event, newLimit) {
    event.preventDefault();

    this.storage.setRowsPerPage(newLimit);
  }

  onChangePager(event) {
    this.page.emit(event);
  }

  isActiveRowsPerPage(rows) {
    return rows === this.storage.getRowsPerPage();
  }
}
