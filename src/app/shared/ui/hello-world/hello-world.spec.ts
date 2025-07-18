import { TestBed } from '@angular/core/testing';
import { HelloWorldComponent } from './hello-world';
import { provideZonelessChangeDetection } from '@angular/core';
import { screen } from '@testing-library/angular';

describe('Hello World Component', () => {
  it('should display Hello World', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(HelloWorldComponent);

    const helloWorldText = await screen.findByText('Hello World');
    expect(helloWorldText).toBeTruthy();
  });
});
