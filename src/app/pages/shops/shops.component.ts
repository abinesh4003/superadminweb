import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-pages-shops',
  templateUrl: './shops.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopsComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
