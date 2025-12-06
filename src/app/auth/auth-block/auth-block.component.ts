import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pkz-auth-block',
  styleUrls: ['./auth-block.component.scss'],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PkzAuthBlockComponent {
}
