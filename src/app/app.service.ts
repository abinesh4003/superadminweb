import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class AppService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
