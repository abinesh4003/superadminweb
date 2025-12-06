import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';

@Component({
  selector: 'pkz-filter-form-select',
  templateUrl: 'filter-form-select.component.html',
  styleUrls: ['./filter-form-select.component.scss']
})
export class FilterFormSelectComponent implements OnInit {
  fieldConfig;
  form: FormGroup;

  @HostBinding('class') @Input() class: string;

  constructor(
    private filterFormService: FilterFormService
  ) {}

  ngOnInit() {
    this.class = this.filterFormService.getControlClass(this.fieldConfig);
  }
}
