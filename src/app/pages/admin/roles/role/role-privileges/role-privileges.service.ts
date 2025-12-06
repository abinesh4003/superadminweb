import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { PagesService } from '@app/pages/pages.service';
import { AppState, getActiveRole } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { TreeviewItem } from 'ngx-treeview';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';

@Injectable()
export class RolePrivilegesService {
  constructor(
    private store: Store<AppState>,
    private api: ApiService,
    private pagesService: PagesService
  ) {}

  prepareItemsForSubmit(items) {
    const obj = {};

    for (const item of items) {
      let value;
      const children = item.children;

      if (children && children[0]) {

        if (children[0].children) {
          value = this.prepareItemsForSubmit(children);
        } else {
          value = children
            .filter(({checked}) => checked)
            .map(({text}) => this.nameToKey(text));
        }
      }

      obj[this.nameToKey(item.text)] = value;
    }

    return obj;
  }

  private nameToKey(name) {
    return name.toLowerCase().split(' ').join('_');
  }

  getPrivileges() {
    const userId = this.pagesService.getLoggedUserId();
    return combineLatest(
      this.api.getRolesRolePrivileges(userId),
      this.store.select(getActiveRole)
    )
      .pipe(
        map(([allPrivileges, {privileges: checkedPrivileges}]) => {
          return this.formatPrivileges(allPrivileges, checkedPrivileges);
        })
      );
  }

  private formatPrivileges(all, partial) {
    const isAll = this.checkItemsAvailability(all);
    const isPartial = this.checkItemsAvailability(partial);

    if (!isAll) {
      return [];
    }

    if (!isPartial) {
      partial = {};
    }

    return this.formatItems(all, partial, 0)
      .map(item => new TreeviewItem(item));
  }

  private checkItemsAvailability(items) {
    return items && !!Object.keys(items).length;
  }

  private formatItems(all, partial, parentIndex = 0) {
    return Object.entries(all).map(([key, value], i) => {
      i = this.getIndex(parentIndex, i);
      const partialValue = partial && partial[key] || null;

      if (Array.isArray(value)) {
        return {
          text: this.formatName(key),
          children: this.formatChildren(value, partialValue, i),
          value: i
        };
      }

      return {
        text: this.formatName(key),
        children: this.formatItems(value, partialValue, i),
        value: i
      };
    });
  }

  private formatChildren(children, partialChildren, parentIndex) {
    return children.map((item, i) => {
      i = this.getIndex(parentIndex, i);

      const checked = partialChildren && partialChildren.includes(item) || false;
      return {
        value: i,
        text: this.formatName(item),
        checked
      };
    });
  }

  private getIndex(parentIndex, index) {
    index = !!parentIndex ? +[parentIndex, index].join('') : index;

    return ++index;
  }

  private formatName(name: string) {
    return name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
