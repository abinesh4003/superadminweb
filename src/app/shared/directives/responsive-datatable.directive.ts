import { Directive, OnDestroy, OnInit, Self } from '@angular/core';
import { AppService } from '@app/app.service';
import { AppState, getShowSidebar } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[pkzResponsiveDatatable]'
})
export class ResponsiveDatatableDirective implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    @Self() private table: DatatableComponent,
    private store: Store<AppState>,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.store.select(getShowSidebar)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        setTimeout(() => {
          this.table.recalculate();

          if (this.appService.isBrowser()) {
            window.dispatchEvent(new Event('resize'));
          }
        }, 400);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
