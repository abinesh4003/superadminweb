import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ScService {
  constructor(
    private api: ApiService
  ) {}

  getCategoryTypes() {
    return this.getFormattedCategoryTypes()
      .pipe(
        map(types => {
          types.unshift({id: 0, name: 'All'});

          return types;
        })
      );
  }

  getFormattedCategoryTypes() {
    return this.api.getStoreCategoryTypes();
  }
}
