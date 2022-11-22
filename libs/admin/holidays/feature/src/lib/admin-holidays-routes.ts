import { Routes } from '@angular/router';
import { HolidaysContainerComponent } from './holidays-container.component';
import { AddHolidayComponent } from './add-holiday-component';
import { EditHolidayComponent } from './edit-holiday.component';

export const adminHolidaysRoutes: Routes = [
  { path: '', component: HolidaysContainerComponent },
  { path: 'add', component: AddHolidayComponent },
  { path: ':id', component: EditHolidayComponent },
];
