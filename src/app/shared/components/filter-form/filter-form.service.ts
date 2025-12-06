import { Injectable } from '@angular/core';
import { deepExtend } from '@nebular/auth/helpers';

@Injectable()
export class FilterFormService {

  constructor() {}

  addOptionsToSettings(settings, options) {
    return settings.map((elem) => {
      if (options && options[elem['name']]) {
        deepExtend(elem, options[elem['name']]);
      }

      return elem;
    });
  }

  getControlClass(config) {
    const width = config.width || 3;
    const offset = config.offset || 0;

    return `col-${width} offset-${offset}`;
  }

}
