import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

@Injectable()
export class UsersFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Status',
    name: 'status',
    options: [],
  }, {
    type: 'select',
    label: 'Role',
    name: 'role',
    options: [],
    width: 4
  }, {
    type: 'input',
    label: 'User',
    name: 'text',
    width: 5
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService,
    private api: ApiService
  ) {}

  getFilterSettings() {
    return forkJoin([
      this.getAsyncOptions(),
      of(this.getOptions()),
    ])
      .pipe(
        map(([asyncOptions, syncOptions]) => {
          const commonOptions = {...asyncOptions, ...syncOptions};

          return this.filterFormService.addOptionsToSettings(this.settings, commonOptions);
        })
      );
  }

  private getOptions() {
    return {
      status: {
        options: this.constantsService.getListByKey('admin_users_statuses')
      }
    };
  }

  private getAsyncOptions() {
    return this.api.getRolesList()
      .pipe(
        map(roles => {
          const formattedRoles = roles.map(({_id, name}) => {
            return {
              id: _id,
              name
            };
          });

          formattedRoles.unshift({id: '', name: 'All'});

          return {
            role: {
              options: formattedRoles
            }
          };
        })
      );
  }
}

