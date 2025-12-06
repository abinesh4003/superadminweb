import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'pkz-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnDestroy, OnChanges {
  @Input('from') from: string;
  timerId: any;
  seconds: number;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges() {
    this.calculateTime();
  }

  private calculateTime() {
    const now = moment(new Date());
    this.seconds = now.diff(moment(this.from), "seconds");
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(() => {
      this.seconds += 1;
      this.cd.markForCheck();
    }, 1000)
  }

  public get formatTime() {
    const secondsInDay = 60 * 60 * 24;
    const days = Math.floor(this.seconds / secondsInDay);
    const hours = Math.floor((this.seconds - secondsInDay * days) / 3600);
    const minutes = Math.floor((this.seconds - (secondsInDay * days) - (hours * 3600)) / 60);
    const seconds = this.seconds - (secondsInDay * days) - (hours * 3600) - (minutes * 60);
    if (days > 0) {
      const daysLabel = days === 1 ? 'day' : 'days';
      const hoursLabel = hours === 1 ? 'hour' : 'hours';
      if (hours > 0) {
        return `${days} ${daysLabel}, ${hours} ${hoursLabel}`
      } else {
        return `${days} ${daysLabel}`
      }
    }
    let formattedHours = `${hours}`;
    if (hours < 10) {
      formattedHours = `0${hours}`;
    }
    let formattedMinutes = `${minutes}`;
    if (minutes < 10) {
      formattedMinutes = `0${minutes}`;
    }
    let formattedSeconds = `${seconds}`;
    if (seconds < 10) {
      formattedSeconds = `0${seconds}`;
    }
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  ngOnDestroy(): void {
    this.timerId && clearInterval(this.timerId);
  }
}
