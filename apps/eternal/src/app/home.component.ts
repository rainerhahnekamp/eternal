import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'eternal-home',
  template: `<p>
      Eternal is an imaginary travel agency and is used as training application for Angular
      developers.
    </p>
    <p>
      You can click around, do whatever you want but don't expect to be able to book a real holiday
      😉.
    </p> `
})
export class HomeComponent {}

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeComponentModule {}
