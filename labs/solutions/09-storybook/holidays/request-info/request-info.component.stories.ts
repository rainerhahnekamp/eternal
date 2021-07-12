import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { RequestInfoComponent } from './request-info.component';

export default {
  title: 'Eternal/RequestInfo',
  component: RequestInfoComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule
      ]
    })
  ]
} as Meta;

const Template: Story<RequestInfoComponent> = (args: RequestInfoComponent) => ({
  component: RequestInfoComponent,
  props: args
});

export const Normal = Template.bind({});
