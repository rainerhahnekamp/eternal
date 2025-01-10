import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingInfoService {
  hasUserBooked(title: string) {
    return title === 'Norway';
  }
}
