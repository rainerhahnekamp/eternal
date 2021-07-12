import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../home/home.component';
import { mock } from '../shared/mock';
import { GdpcComponent } from './gdpc.component';

describe('GdpcComponent', () => {
  it('should check confirmation in London-style', () => {
    const router = mock<Router>({
      navigateByUrl: jest.fn()
    });
    new GdpcComponent(router).consent();

    expect(router.navigateByUrl).toBeCalledWith('/home');
  });

  it('should make sure that gdpc confirmation redirects to home', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [GdpcComponent, HomeComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'gdpc',
            component: GdpcComponent
          },
          {
            path: 'home',
            component: HomeComponent
          }
        ])
      ]
    }).createComponent(GdpcComponent);

    const location = TestBed.inject(Location);
    fixture.detectChanges();
    const consentButton = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    consentButton.click();
    expect(location.path()).toBe('/home');
  });
});
