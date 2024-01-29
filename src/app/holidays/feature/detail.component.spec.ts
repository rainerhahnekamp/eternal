import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DetailComponent } from '@app/holidays/feature/detail.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('Detail Component', () => {
  it('should test verify the id is 5', waitForAsync(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'detail/:id', component: DetailComponent }]),
      ],
    });

    const harness = await RouterTestingHarness.create('detail/5');

    const p: HTMLParagraphElement = harness.fixture.debugElement.query(
      By.css('p'),
    ).nativeElement;

    expect(p.textContent).toBe('Current Id: 5');

    await harness.navigateByUrl('/detail/6');
    expect(p.textContent).toBe('Current Id: 6');
  }));
});
