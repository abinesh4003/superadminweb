import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { map } from 'rxjs/operators/map';

@Injectable()
export class FinanceService {
  constructor(
    private api: ApiService
  ) {}

  getFinanceLocationsList() {
    return this.api.getFinanceLocationsList()
      .pipe(map(this.getLocationOptions));
  }

  private getLocationOptions(locations) {
    const formattedLocations = locations.map(({_id, name}) => {
      return {
        id: _id,
        name
      };
    });
    formattedLocations.unshift({ id: '', name: 'All' });

    return formattedLocations;
  }
}
