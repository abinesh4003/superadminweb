import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterDynamicFieldDirective } from '@app/shared/components/filter-form/dynamic-field/filter-dynamic-field.directive';
import { FilterFormComponent } from '@app/shared/components/filter-form/filter-form.component';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { FilterFormInputComponent } from '@app/shared/components/filter-form/input/filter-form-input.component';
import { FilterFormSelectComponent } from '@app/shared/components/filter-form/select/filter-form-select.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    FilterFormComponent,
    FilterFormInputComponent,
    FilterFormSelectComponent,
    FilterDynamicFieldDirective
  ],
  exports: [
    FilterFormComponent
  ],
  entryComponents: [
    FilterFormInputComponent,
    FilterFormSelectComponent
  ],
  providers: [
    FilterFormService
  ],
})
export class FilterFormModule {
}
