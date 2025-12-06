import { HttpResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class GlobalToasterService implements ErrorHandler {
  constructor(
    private toaster: ToastrService
  ) {}

  handleError(body) {
    const message = this.getErrorMessage(body);

    if (this.isString(message)) {
      this.showError(message);
    }

    return _throw(body);
  }

  handleSuccess(body) {
    const message = this.getSuccessMessage(body);

    if (this.isString(message)) {
      this.showSuccess(message);
    }
  }

  handleRequest(event) {
    if (!(event instanceof HttpResponse && event.body)) {
      return;
    }

    const body = event.body;
    if (body.success === false) {
      this.handleError(body);
    } else if (body.success === true) {
      this.handleSuccess(body);
    }
  }

  showFormFieldError() {
    const message = 'Please, correct form errors';

    this.handleError(message);
  }

  showError(message) {
    this.toaster.error(message, 'Error!');
  }

  showSuccess(message) {
    this.toaster.success(message, 'Success!');
  }

  private getErrorMessage(body) {
    if (this.isString(body)) {
      return body;
    } else if (body.success === false && body.message) {
      return body.message;
    } else if (body.error) {

      if (this.isString(body.error) && body.error.toLowerCase().indexOf('doctype') !== -1) {
        return null;
      }
      return this.getErrorMessage(body.error);
    }

    return body;
  }

  private getSuccessMessage(body) {
    if (this.isString(body)) {
      return body;
    } else if (body.success === true && body.message) {
      return body.message;
    }

    return body;
  }

  private isString(val) {
    return typeof val === 'string';
  }
}


