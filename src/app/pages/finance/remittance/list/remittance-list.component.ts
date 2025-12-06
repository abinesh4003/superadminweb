import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PaginationPage } from '@app/core/models';
import { StorageService } from '@app/core/services/storage.service';
import { skip } from 'rxjs/operators/skip';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import {RemittanceFilterSettingsService} from "@app/pages/finance/remittance/list/remittance-filter-settings.service";
import {RemittancePermissionsConstants} from "@app/pages/finance/remittance/remittance-permissions.constants";
import {ConstantsService} from "@app/core/services/constants.service";
import {RemittanceService} from "@app/pages/finance/remittance/remittance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
  FINANCE_REMITTANCE_STATUS_APPROVED,
  FINANCE_REMITTANCE_STATUS_PENDING, FINANCE_REMITTANCE_STATUS_REJECTED,
  FINANCE_REMITTANCE_STATUS_TRANSFERRED
} from "@app/core/constants";

@Component({
  selector: 'pkz-remittance-list',
  templateUrl: 'remittance-list.component.html',
  styleUrls:[
    'remittance-list.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemittanceListComponent implements OnInit, OnDestroy {
  isPageLoaded = true;
  filterFormSettings$;
  filtersObj: any = {};
  page: PaginationPage;
  rows: any[];
  perms = RemittancePermissionsConstants;
  statusTypes: {id: number, name: string}[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: RemittanceService,
    private filterSettingsService: RemittanceFilterSettingsService,
    private constantsService: ConstantsService,
    private storage: StorageService,
  ) {}

  ngOnInit() {
    this.handleRowsLimit();
    this.initFiltersData();
    this.resetPageOffset();
    this.statusTypes = this.constantsService.getListByKey('finance_remittance_status_types');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;

    if(!filtersObj.search_key) {
      this.filtersObj = {
        status: filtersObj.status
      }
    }
    this.resetPageOffset();
  }

  setPage(pageInfo) {

    this.page.pageNumber = pageInfo.offset;
    this.loadTableData();
  }

  onOpenDetailsModal(e, request) {
    e.preventDefault();

    this.service.getRemittanceInfo({_id: request._id, status: request.status})
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((order: any) => {
          switch (order.payment_info.status) {
            case FINANCE_REMITTANCE_STATUS_TRANSFERRED:
              order.payment_info.reference_id = order.payment_info.transferred ? order.payment_info.transferred.reference_id : null;
              break;
            case FINANCE_REMITTANCE_STATUS_PENDING:
              order.payment_info.reference_id = order.payment_info.pending ? order.payment_info.pending.reference_id : null;
              break;
            case FINANCE_REMITTANCE_STATUS_APPROVED:
              order.payment_info.reference_id = order.payment_info.approved ? order.payment_info.approved.reference_id : null;
              break;
            case FINANCE_REMITTANCE_STATUS_REJECTED:
              order.payment_info.reference_id = order.payment_info.rejected ? order.payment_info.rejected.reference_id : null;
              break;
            default:
              break;
          }

          this.service.openDetailsModal({order: order, statusTypes: this.statusTypes})
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
              this.resetPageOffset();
            });
        });
  }

  openCodHistory(request): void {
    this.service.codHistoryQueryObj = {
      status: request.status,
      delivered_orders: request.delivered_orders
    };
    this.router.navigate(['cod-history'], {relativeTo: this.activatedRoute});
  }

  showEditBtn(status: number): boolean {
    return status !== FINANCE_REMITTANCE_STATUS_PENDING;
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
    this.filtersObj = this.service.getInitFiltersData();
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private loadTableData() {
    console.log('loadTableData');
    const queryObj = {
      ...this.filtersObj,
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit
    };

    this.service.getRemittance(queryObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        data.remittance.forEach(order => {
          switch (order.status) {
            case FINANCE_REMITTANCE_STATUS_TRANSFERRED:
              order.reference_id = order.transferred ? order.transferred.reference_id : null;
              break;
            case FINANCE_REMITTANCE_STATUS_PENDING:
              order.reference_id = order.pending ? order.pending.reference_id : null;
              break;
            case FINANCE_REMITTANCE_STATUS_APPROVED:
              order.reference_id = order.approved ? order.approved.reference_id : null;
              break;
            case FINANCE_REMITTANCE_STATUS_REJECTED:
              order.reference_id = order.rejected ? order.rejected.reference_id : null;
              break;
            default:
              break;
          }
        });

        console.log('Data = ', data);
        this.initPage({data: data.remittance, count: data.count});
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  private initPage({data, count}): void {
    this.rows = data ? data : [];
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
