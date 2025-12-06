import { Injectable } from '@angular/core';
import { listConstants } from '../constants';

@Injectable()
export class ConstantsService {
  constants: any;

  constructor() {
    this.constants = listConstants;
  }

  getNameById(id: number| string, list) {
    list = Array.isArray(list) ? list : this.getListByKey(list);

    const elem = list.find((el) => {
      if (!isNaN(parseInt(el.id, 10))) {
        return +el.id === +id;
      }
      return el.id === id;
    });

    return elem && elem.name;
  }

  getIdByName(name: string, list) {
    const elem = list.find((el) => el.name.toLowerCase() === name.toLowerCase());

    return elem && elem.id;
  }

  getListByKey(key) {
    return this.getList()[key];
  }

  private getList() {
    return this.constants || {};
  }
}
