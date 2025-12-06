export class Category {
  _id: string;
  type: number;
  status: number;
  display_name: string;
  image: string;
  category_number: string;

  constructor({_id, type, status, display_name, image, category_number}: any = {}) {
    this._id = _id;
    this.type = type;
    this.status = status;
    this.display_name = display_name;
    this.image = image;
    this.category_number = category_number;
  }
}

export class Dashboard {
  order: {
    escalation: string;
    refund: string;
    total_new_orders: string;
    orders_delivered: string;
    total_cancelled: string;
    replacement_request: string;
  };
  upc: {
    live_products: string;
    new_product_request: string;
    waiting_for_review: string;
    suspended: string;
    todays_upload: string;
  };
  sku: {
    live_products: string;
    new_product_request: string;
    waiting_for_review: string;
    suspended: string;
    todays_upload: string;
  };
  month_chart: {
    [key: string]: {
      name: string;
      value: number;
    }
  };
  location_chart: {
    [key: string]: {
      name: string;
      value: number;
    }
  };

  constructor(values = {}) {
    Object.assign(this, values);
  }
}

export class DashboardInventoryProduct {
  _id: string;
  upc?: number;
  sku?: number;
  product_name: string;
  manufacturer: string;
  category: string;
  keywords: string[];
  supplier_price: number;
  mrp: number;
  tax: number;
  status: number;
  image: string[];
  modified: string;
  created: string;

  constructor({
                _id,
                upc,
                product_name,
                manufacturer,
                category,
                keywords,
                supplier_price,
                mrp,
                tax,
                status,
                image,
                modified,
                created
              }: any = {}) {

    this._id = _id;
    this.upc = upc;
    this.product_name = product_name;
    this.manufacturer = manufacturer;
    this.category = category;
    this.keywords = keywords;
    this.supplier_price = supplier_price;
    this.mrp = mrp;
    this.tax = tax;
    this.status = status;
    this.image = image;
    this.modified = modified;
    this.created = created;
  }

}
