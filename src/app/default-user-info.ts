import { UserInfo } from "./quiz/feature/quiz.component";
import { inject, Injectable } from "@angular/core";
import { UserService } from "./shared/user.service";
import { BookingInfoService } from "./booking/api/booking-info.service";

@Injectable()
export class DefaultUserInfo implements UserInfo {
  userService = inject(UserService)
  bookingInfo = inject(BookingInfoService)


  hasUserBooked(holiday: string): boolean {
    if (!this.userService.getUser()) {
     return false;
    }

    return this.bookingInfo.hasUserBooked(holiday);
  }
}
