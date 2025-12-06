import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { PagesService } from '@app/pages/pages.service';
import { AppState, getActiveRole } from '@app/store/root-reducer';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { delay } from 'rxjs/operators/delay';
import { catchError } from 'rxjs/operators/catchError';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { map } from 'rxjs/operators/map';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-assign-admins-modal',
  styleUrls: ['./assign-admins-modal.component.scss'],
  templateUrl: 'assign-admins-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignAdminsModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  roleTitle$: Observable<string>;
  form: FormGroup;
  users: FormArray;
  usersTypeahead$ = new EventEmitter<any>();
  suggestedUsers: any[];

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.suggestedUsers = [];
    this.handleTitle();
    this.initForm();
    this.users = this.form.get('users') as FormArray;
    this.loadSuggestedUsers();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onAdd(event, index) {
    this.suggestedUsers[index] = [];
    this.addItem();
  }

  close(): void {
    this.ngbActiveModal.close(this.getPreparedData());
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  onKeyUp(event, index) {
    this.usersTypeahead$.next({
      qry: event.target.value,
      index
    });
  }

  private getPreparedData() {
    const users = this.form.value.users
      .map(({id}) => id)
      .filter(id => !!id);

    return { users };
  }

  private loadSuggestedUsers() {
    this.usersTypeahead$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        debounceTime(500),
        switchMap(({qry, index}) => forkJoin(this.getSearchResults(qry), of(index))),
        delay(800),
        catchError(() => of(null))
      )
      .subscribe(data => {
        if (!data) {
          return;
        }
        const [items, index] = data;
        this.suggestedUsers[index] = items;
        this.cd.markForCheck();
      });
  }

  private handleTitle() {
    this.roleTitle$ = this.store.select(getActiveRole)
      .pipe(map(role => role.name));
  }

  private initForm() {
    this.form = this.fb.group({
      users: this.fb.array([ this.createItem() ])
    });
  }

  private createItem() {
    return this.fb.group({
      id: ''
    });
  }

  private addItem() {
    this.users.push(this.createItem());
  }

  private getSearchResults(qry) {
    if (!qry) {
      return of([]);
    }

    return this.api.searchRolesRoleUsers({qry})
      .pipe(
        map(users => {
          return users.filter(({_id}) => _id !== this.pagesService.getLoggedUserId());
        })
      );
  }
}
