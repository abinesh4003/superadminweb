import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-products-status',
  styleUrls: ['./products-status.component.scss'],
  templateUrl: 'products-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsStatusComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
