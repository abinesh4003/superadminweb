import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pkz-pages-billings',
  templateUrl: './billings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingsComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
