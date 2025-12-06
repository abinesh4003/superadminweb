import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export class DatepickerDateFormatterService extends NgbDateParserFormatter {
  readonly DT_FORMAT = 'DD/MM/YYYY';

  parse(value: string): NgbDateStruct {
    if (value) {
      value = value.trim();
      const {years, months, date} = moment(value, this.DT_FORMAT).toObject();
      return {year: years, month: months + 1, day: date};
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }

    const mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) {
      return '';
    }
    return mdt.format(this.DT_FORMAT);
  }
}
