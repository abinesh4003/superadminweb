import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { PagesService } from '@app/pages/pages.service';
import * as admin from '@app/store/actions/admin.actions';
import { AppState, getActiveUser } from '@app/store/root-reducer';
import { validatePasswordMatch } from '@app/validators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operators/concatMap';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators/tap';

@Injectable()
export class UserService {

  constructor(
    private pagesService: PagesService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  deleteUserImage(userId) {
    return this.api.deleteUsersUserImage(userId);
  }

  checkEmail(data) {
    return this.api.usersCheckEmail(data)
      .pipe(catchError(() => of(null)));
  }

  createUser(data) {
    return this.api.addUsersUser(data);
  }

  updateUsersUserProfile(id, data) {
    return this.api.updateUsersUserProfile(id, data);
  }

  updateUser(userId, data) {
    data['modified_by'] = this.getLoggedUserId();

    return this.api.updateUsersUser(userId, data)
      .pipe(concatMap(() => this.initUserDetailsData(userId, false)));
  }

  initUserDetailsData(userId, isAddPage) {
    return this.getUsersUser(userId, isAddPage)
      .pipe(
        tap((user) => this.store.dispatch(new admin.ChangeActiveUser(user)))
      );
  }

  private getUsersUser(id, isAddPage) {
    if (isAddPage) {
      return of(null);
    }

    return this.api.getUsersUser(id);
  }

  getUsersUserCategories(id, queryObj) {
    return this.api.getUsersUserCategories(id, queryObj);
  }

  getUserDetailsForm(isAdd) {
    const requiredValidator = isAdd ? Validators.required : null;
    const emailValidators = isAdd ? Validators.compose([Validators.required, Validators.email]) : null;
    const config = {
      first_name: ['', requiredValidator],
      last_name: ['', requiredValidator],
      email_id: [{ value: '', disabled: !isAdd }, emailValidators],
      passwords: this.fb.group({
        password: ['', requiredValidator],
        confirm_password: ['', requiredValidator],
      }, {validator: validatePasswordMatch}),
      is_reset: true
    };

    return this.fb.group(config);
  }

  dispatchActiveUserId(id) {
    this.store.dispatch(new admin.ChangeActiveUserId(id));
  }

  dispatchUserPageType(page) {
    this.store.dispatch(new admin.ChangeUserPageType(page));
  }

  getRoutedTabs(activatedRoute, isAdd) {
    const url = this.pagesService.getComponentRoute(activatedRoute);
    const tabsData = this.getTabs(isAdd);

    return this.pagesService.getRoutedTabsData(tabsData, url);
  }

  getRoles(id, isSuperAdmin) {
    return this.api.getUsersUserRoles(id)
      .pipe(
        map((roles) => roles.filter(role => isSuperAdmin || !role.is_super_admin)),
        withLatestFrom(this.store.select(getActiveUser)),
        map(([roles, user]) => {
          const userRoles = user && user.role || [];

          return roles
            .map((role) => {
              return {
                ...role,
                checked: userRoles.includes(role._id),
                id: role._id
              };
            });
        })
      );
  }

  getLoggedUserId() {
    return this.pagesService.getLoggedUserId();
  }

  getUsersUserLocation(id) {
    return this.api.getUsersUserLocation(id);
  }

  getUsersUserLocationFilter(id, country) {
    return this.api.getUsersUserLocationFilter(id, country);
  }

  dispatchBreadcrumb(isAdd) {
    return this.store.select(getActiveUser)
      .pipe(tap(data => {
        const name = !isAdd && data ? data.first_name : 'New User';
        this.store.dispatch(new admin.ChangeUsersUserBreadcrumb(name));
      }));
  }

  getCategoryTypes(id) {
    return this.api.getUsersUserCategoryTypes(id)
      .pipe(
        map(types => {
          types.unshift({id: 0, name: 'All'});

          return types;
        })
      );
  }

  private getTabs(isAdd) {
    if (isAdd) {
      return [{
        title: 'User',
        route: 'user'
      }];
    }

    return [{
      title: 'User',
      route: 'user'
    }, {
      title: 'Roles',
      route: 'roles'
    }, {
      title: 'Locations',
      route: 'locations'
    }, {
      title: 'Store Category',
      route: 'sc'
    }];
  }
}
