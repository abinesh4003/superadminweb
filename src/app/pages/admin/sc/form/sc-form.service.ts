import { Injectable } from '@angular/core';

@Injectable()
export class ScFormService {

  constructor() {}

  getTreeData(rootItems) {
    const arr = this.getArrayFromTree(rootItems);

    if (arr.length) {
      return this.flattenArray(arr);
    }

    return [''];
  }

  private getArrayFromTree(tree) {
    if (!tree) {
      return '';
    }

    if (Array.isArray(tree)) {
      return tree.map(item => this.getArrayFromTree(item));
    }

    if (tree.children && tree.children.length) {
      return tree.children.map((item) => {
        const fromChildren = this.getArrayFromTree(item);

        if (Array.isArray(fromChildren)) {
          return fromChildren.map(el => `/${tree.value}` + el);
        }

        return `/${tree.value}` + fromChildren;
      }).flat();
    }

    return `/${tree.value}`;
  }

  private flattenArray(arr, obj = {}) {
    arr.forEach(item => {
      if (typeof item === 'string') {
        obj[item] = null;
      } else {
        this.flattenArray(item, obj);
      }
    });

    return Object.keys(obj);
  }

  getDefaultSettings() {
    return {
      value: 'Categories',
      id: 'root',
      settings: {
        static: true,
        isCollapsedOnInit: false,
        cssClasses: {
          expanded: 'fa fa-caret-down',
          collapsed: 'fa fa-caret-right',
          empty: 'fa fa-caret-right disabled',
          leaf: 'fa'
        }
      },
      children: []
    };
  }

  getCategoriesTree(items) {
    return {
      ...this.getDefaultSettings(),
      children: this.getTreeChildren(items)
    };
  }

  private getTreeChildren(items, parentIndex = 0) {
    const obj = {};

    items.forEach((item, i) => {
      const itemArr = item.split('/').filter(el => !!el);
      const index = this.getIndex(parentIndex, i);
      this.mutateObject(itemArr, obj, index);
    });

    return this.childrenToArray(obj);
  }

  private mutateObject(arr, obj, parentIndex) {
    if (!arr.length) {
      return;
    }
    const value = arr.shift();
    const key = this.getObjKey(value);

    if (!obj[key]) {
      obj[key] = {
        value,
        id: parentIndex
      };
    }

    if (arr.length) {
      if (!obj[key].children) {
        obj[key].children = {};
      }

      const index = this.getIndex(parentIndex, Object.keys(obj[key].children).length);
      this.mutateObject(arr, obj[key].children, index);
    } else {
      obj[key].children = [];
    }
  }

  private getObjKey(name) {
    return name.split(' ').join('_').toLowerCase();
  }

  private getIndex(parentIndex, index) {
    index = !!parentIndex ? +[parentIndex, index].join('') : index;
    return ++index;
  }

  private childrenToArray(srcObj) {
    const obj = {};

    Object.entries(srcObj)
      .forEach(([key, value]) => {
        if (!obj[key]) {
          obj[key] = value;

          if (value.children) {
            obj[key].children = this.childrenToArray(value.children);
          }
        }
      });

    return Object.values(obj);
  }
}
