import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';

@Component({
  selector: 'pkz-filter-form-input',
  templateUrl: 'filter-form-input.component.html'
})
export class FilterFormInputComponent implements OnInit {
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
