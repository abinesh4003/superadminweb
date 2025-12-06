import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DeliveryAssistantsService} from "@app/pages/orders/delivery-assistants/delivery-assistants.service";
import {filter, take, takeUntil, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {Subject} from "rxjs/Subject";
import {ImageViewerComponent} from "@app/pages/orders/image-viewer/image-viewer.component";
import {ModalService} from "@app/shared/components/modal/modal.service";

@Component({
  selector: 'pkz-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public assistantInfo$: Observable<any>;
  public assistantStatus: number;

  iconOptions = {path: 'delivery/profile/img', width: 100};
  iconOptions2 = {path: 'delivery/view/img', width: 100};

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private cd: ChangeDetectorRef,
              private _modalService: ModalService,
              private _service: DeliveryAssistantsService) {
  }

  ngOnInit() {
    this._activatedRoute.params
      .pipe(take(1), filter(params => params['id']))
      .subscribe(({id}) => {
        this.assistantInfo$ = this._service.getAssistantInfo(id)
      })
  }

  public updateAssistantStatus(queryObj) {
    this._service.updateAssistantStatus(queryObj)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(_ => {
          this.assistantStatus = +queryObj.status;
          this.cd.detectChanges();
        }))
      .subscribe();
  }

  public approveAssistant(associate_id) {
    this.updateAssistantStatus({associate_id, status: 1});
  }

  public viewImage(image, imageOptions) {
    this._modalService.open(ImageViewerComponent, {
      options: {size: "lg"},
      data: {image, imageOptions: {...imageOptions, width: 750}}
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  public takeAction(associate_id, status) {
    this._service.openRejectAssistantModal(status)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(feedback => {
        this.updateAssistantStatus({associate_id, status, feedback});
      })
  };

  public goBack() {
    this._router.navigate(['../'], {relativeTo: this._activatedRoute});
  };

  public isButtonDisabled(associateStatus, status) {
    if (this.assistantStatus) {
      return this.assistantStatus === status;
    } else {
      return associateStatus === status;
    }
  }

  public getStatus(status) {
    if (this.assistantStatus) {
      switch (this.assistantStatus) {
        case 1:
          return 'Active';
        case 3:
          return 'Suspended';
        case 4:
          return 'Resigned';
        case 2:
          return 'Rejected'
      }
    } else {
      switch (status) {
        case 0:
          return 'Waiting for Review';
        case 1:
          return 'Active';
        case 2:
          return 'Rejected';
        case 3:
          return 'Suspended';
        case 4:
          return 'Resigned';
        case 5:
          return 'Terminated'
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
