import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-pages-merchants',
  templateUrl: './merchants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MerchantsComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
