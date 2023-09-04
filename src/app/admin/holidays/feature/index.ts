import { Routes } from '@angular/router';
import { HolidaysContainerComponent } from './holidays-container.component';
import { AddHolidayComponent } from './add-holiday-component';
import { EditHolidayComponent } from './edit-holiday.component';

const index: Routes = [
  { path: '', component: HolidaysContainerComponent },
  { path: 'add', component: AddHolidayComponent },
  { path: ':id', component: EditHolidayComponent },
];

export default index;
