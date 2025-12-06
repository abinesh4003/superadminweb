import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FINANCE_WITHDRAWAL_STATUS_REQUESTED } from '@app/core/constants';
import { PaginationPage } from '@app/core/models';
import { StorageService } from '@app/core/services/storage.service';
import { WithdrawalFilterSettingsService } from '@app/pages/finance/withdrawal/list/withdrawal-filter-settings.service';
import { WithdrawalListService } from '@app/pages/finance/withdrawal/list/withdrawal-list.service';
import { WithdrawalPermissionsConstants } from '@app/pages/finance/withdrawal/withdrawal-permissions.constants';
import { skip } from 'rxjs/operators/skip';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-withdrawal-list',
  templateUrl: 'withdrawal-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawalListComponent implements OnInit, OnDestroy {
  isPageLoaded = true;
  filterFormSettings$;
  filtersObj: any = {};
  page: PaginationPage;
  rows: any[];
  perms = WithdrawalPermissionsConstants;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private service: WithdrawalListService,
    private filterSettingsService: WithdrawalFilterSettingsService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.handleRowsLimit();
    this.initFiltersData();
    this.resetPageOffset();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.resetPageOffset();
  }

  setPage(pageInfo) {

    this.page.pageNumber = pageInfo.offset;
    this.loadTableData();
  }

  onDownloadSheet() {
    this.service.downloadSheet(this.rows);
  }

  onOpenDetailsModal(e, request) {
    e.preventDefault();

    this.service.openDetailsModal(request)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.resetPageOffset();
      });
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
    this.filtersObj = this.service.getInitFiltersData();
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  get isDisabledDownloadSheet() {
    return this.filtersObj.status !== FINANCE_WITHDRAWAL_STATUS_REQUESTED;
  }

  private loadTableData() {
    console.log('loadTableData');
    const queryObj = {
      ...this.service.getFiltersObj(this.filtersObj),
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit
    };

    this.service.getWithdrawRequests(queryObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        console.log('Data = ', data);
        this.initPage(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  private initPage({merchantRequest, count}): void {
    this.rows = merchantRequest ? merchantRequest : [];
    this.page.count = count;
  }

  private handleRowsLimit() {
    this.page = new PaginationPage();
    this.page.setLimit(this.storage.getRowsPerPage());
    this.storage.observeRowsPerPage()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skip(1)
      )
      .subscribe(key => {
        this.page.setLimit(key);
        this.resetPageOffset();
      });
  }
}
