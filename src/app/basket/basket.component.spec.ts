import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import BasketComponent from '@app/basket/basket.component';
import { SyncService } from '@app/basket/sync.service';
import { BasketService } from '@app/basket/basket.service';

describe('BasketComponent', () => {
  it('should increase the quantity of the product', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BasketComponent],
    }).createComponent(BasketComponent);
    const syncService = TestBed.inject(SyncService);
    const spy = spyOn(syncService, 'sync');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const total: HTMLDivElement = fixture.debugElement.query(
      By.css('[data-testid="total"]'),
    ).nativeElement;
    expect(total.textContent).toBe('18');

    fixture.debugElement
      .query(By.css('[data-testid="btn-increase"]'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(total.textContent).toBe('21');
  });

  it('should test the BasketService', () => {
    const syncService = TestBed.inject(SyncService);
    const spy = spyOn(syncService, 'sync');

    const basketService = TestBed.inject(BasketService);
    TestBed.flushEffects();
    expect(basketService.totalPrice()).toBe(18);

    basketService.increase(1);
    TestBed.flushEffects();
    expect(basketService.totalPrice()).toBe(21);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
