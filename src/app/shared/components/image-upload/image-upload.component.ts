import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SharedHelperService } from '@app/shared/services/shared-helper.service';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-image-upload',
  styleUrls: ['./image-upload.component.scss'],
  templateUrl: 'image-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent implements OnInit, OnChanges, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() title: string;
  @Input() imageUrl = '';
  @Input() path = '';
  @Input() width = 200;
  @Input() height = 200;
  @Input() minHeight = 0;
  @Input() disabled = false;
  @Input() deleteAvailable = true;
  @Input() reinitWithSource = false;
  @Input() smallIcons = false;
  @Output() imageChange: EventEmitter<File|Blob> = new EventEmitter();
  @Output() zoom: EventEmitter<any> = new EventEmitter();

  file: File|Blob;
  hasUploadedImage = false;
  imageResource: SafeUrl|string;

  imageOptions: {path: string, width: number};

  @ViewChild('fileInput') fileInput;

  constructor(
    private cd: ChangeDetectorRef,
    private sharedHelperService: SharedHelperService,
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.imageOptions = {path: this.path, width: this.width};
    this.reinitImage();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges({imageUrl}: SimpleChanges) {
    if (imageUrl && !imageUrl.currentValue) {
      this.resetImageData();
    }
  }

  isImageAvailable() {
    return this.hasUploadedImage || !!this.imageUrl;
  }

  onImageChange(event) {
    if (!(event.target.files && event.target.files[0])) {
      return;
    }

    const cb = () => {
      this.file = event.target.files[0];
      this.fileProcessing();
      this.emitFile();
    };

    this.removeImageDialog(cb, 'replace');
  }

  onZoom() {
    this.zoom.emit();
  }

  onImageDelete() {
    const cb = () => {
      this.resetImageData();
      this.imageChange.emit(null);
    };
    this.removeImageDialog(cb, 'delete');
  }

  private reinitImage() {
    if (!this.reinitWithSource) {
      return;
    }

    this.sharedHelperService.getImageBlob(this.imageUrl, {path: this.path})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.file = data;
          this.hasUploadedImage = true;
          this.imageResource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
          this.emitFile();
        }
      });
  }

  private resetImageData() {
    this.imageUrl = '';
    this.hasUploadedImage = false;
    this.file = null;
    this.imageResource = '';
    this.resetFileInput();
  }

  private removeImageDialog(callback, action) {
    if (!this.imageUrl.length || !this.deleteAvailable) {
      callback();
      return;
    }

    this.modalService.openConfirm({
      message: `Are you sure you want to ${action} the image?`,
      options: {
        size: 'sm'
      }
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        callback();
      }, () => {
        this.resetFileInput();
      });
  }

  private resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  private fileProcessing() {
    this.imageUrl = '';
    this.sharedHelperService.fileToBase64(this.file)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: string) => {
        this.hasUploadedImage = true;
        this.imageResource = result;
        this.cd.markForCheck();
      });
  }

  private emitFile() {
    this.imageChange.emit(this.file);
  }
}
