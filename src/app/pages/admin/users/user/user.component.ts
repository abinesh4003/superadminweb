import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { AppState, getUsersUserBreadcrumb } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators/first';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { tap } from 'rxjs/operators/tap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-user',
  templateUrl: 'user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  tabs = [];
  breadcrumbName$: Observable<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(({id}) => this.userService.dispatchActiveUserId(id)),
        tap(({page}) => this.userService.dispatchUserPageType(page)),
        first(),
        mergeMap(({id}) => this.userService.initUserDetailsData(id, this.isAddPage())),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.breadcrumbName$ = this.store.select(getUsersUserBreadcrumb);
    this.tabs = this.userService.getRoutedTabs(this.activatedRoute, this.isAddPage());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  navigateToUsers(event) {
    event.preventDefault();

    this.router.navigate(['pages/admin/users']);
  }

  private isAddPage() {
    return this.activatedRoute.snapshot.params['page'] === 'add';
  }
}
