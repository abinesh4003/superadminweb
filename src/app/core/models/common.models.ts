export class ChartResults {
  name: string;
  value: number;

  constructor({name, value}: any = {}) {
    this.name = name;
    this.value = value;
  }
}

export class IdName {
  id: number;
  name: string;

  constructor({id, name}: any = {}) {
    this.id = id;
    this.name = name;
  }
}

export class PaginationPage {
  count: number;
  limit: number;
  pageNumber: number;

  constructor({count = 0, limit = 10, pageNumber = 0}: any = {}) {
    this.count = count;
    this.limit = limit;
    this.pageNumber = pageNumber;
  }

  setLimit(newLimit) {
    this.limit = newLimit;
  }
}

export class ConfigureColumn {
  name: string;
  prop: string;
  checked: boolean;

  constructor({name, prop, checked}: any = {}) {
    this.name = name;
    this.prop = prop;
    this.checked = checked;
  }
}

export class ImageDataToRetrieve {
  path: string;
  width?: number;
  height?: number;
  imagePropName?: string;
}
