import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterFormInputComponent } from '@app/shared/components/filter-form/input/filter-form-input.component';
import { FilterFormSelectComponent } from '@app/shared/components/filter-form/select/filter-form-select.component';

const components = {
  input: FilterFormInputComponent,
  select: FilterFormSelectComponent,
};

@Directive({
  selector: '[pkzFilterDynamicField]',
})
export class FilterDynamicFieldDirective implements OnInit {
  @Input() fieldConfig;
  @Input() form: FormGroup;

  component: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
  ) {}

  ngOnInit() {
    const component = components[this.fieldConfig.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);

    this.component = this.container.createComponent(factory);
    this.component.instance.fieldConfig = this.fieldConfig;
    this.component.instance.form = this.form;
  }
}
