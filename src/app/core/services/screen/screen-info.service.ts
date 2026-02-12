import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenInfoService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getScreenWidth(): number {
    if (isPlatformBrowser(this.platformId)) {
      return screen.height;
    }
    return 0;
  }
}
