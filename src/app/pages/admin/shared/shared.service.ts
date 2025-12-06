import { Injectable } from '@angular/core';
import { SC_STATUS_ALPHA, SC_STATUS_LIVE, SC_STATUS_OPEN, SC_TYPE_ALL } from '@app/core/constants';

@Injectable()
export class SharedService {
  constructor() {}

  getScInitFiltersData() {
    return {
      status: SC_STATUS_OPEN,
      type: SC_TYPE_ALL,
      text: ''
    };
  }

  getScFiltersObj(filtersObj) {
    let { type, status } = filtersObj;
    const { text } = filtersObj;

    type = (type === SC_TYPE_ALL) ? '' : type;
    status = (status === SC_STATUS_OPEN) ? [SC_STATUS_ALPHA, SC_STATUS_LIVE] : [status];
    return {
      type,
      status,
      text
    };
  }
}
