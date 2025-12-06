import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export class DatepickerDateAdapterService extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    const [day, month, year] = moment(date).format('DD-MM-YYYY').split('-').map(Number);
    return date ? {year, month, day: day} : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day, 0, 0, 0) : null;
  }
}
