import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators/map';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'pkz-filter-form',
  templateUrl: 'filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterFormComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() config: any[] = [];
  @Input() values: any;
  @Input() emitOnInit = false;
  @Input() embedded = false;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.form = this.createForm();
    this.handleFilterChange();
    this.setValues();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges() {
    this.setValues();
  }

  private setValues() {
    if (!this.form || !this.values) {
      return;
    }

    Object.entries(this.values)
      .forEach(([name, value]) => {
        if (this.form.get(name)) {
          this.form.get(name).setValue(value, {emitEvent: false});
        }
      });
  }

  private handleFilterChange() {
    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(500),
        map((values) => {
          Object.entries(values)
            .forEach(([key, value]) => {
              if (typeof value === 'string') {
                values[key] = value.trim();
              }
            });

          return values;
        })
      )
      .subscribe((values) => {
        this.filterChanged.emit(values);
      });
  }

  private createForm() {
    const group = this.fb.group({});

    this.config.forEach(control => {
      group.addControl(control.name, this.fb.control(null));
    });

    return group;
  }
}
