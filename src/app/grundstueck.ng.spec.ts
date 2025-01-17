import { TestBed } from '@angular/core/testing';
import { Grundstueck, Grundstuecke } from "./grundstuecks.ng";
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { createMock } from "@testing-library/angular/jest-utils";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";

const grundstuecke: Grundstueck[] = [
  {
    id: 1,
    flaeche: 100,
    nummer: '1',
    kgName: 'Korneuburg',
    kgNummer: '1',
  },
  {
    id: 2,
    flaeche: 200,
    nummer: '2',
    kgName: 'Wien',
    kgNummer: '2',
  },
  {
    id: 3,
    flaeche: 300,
    nummer: '3',
    kgName: 'Mödling',
    kgNummer: '3',
  },
  {
    id: 4,
    flaeche: 400,
    nummer: '4',
    kgName: 'Baden',
    kgNummer: '4',
  },
];

describe('Grundstücke', () => {
  const setup = (runCd = true) => {
    const httpClient = createMock(HttpClient)
    const fixture = TestBed.configureTestingModule({
      imports: [Grundstuecke],
      providers: [provideNoopAnimations(), {provide: HttpClient, useValue: httpClient}],
    }).createComponent(Grundstuecke);

    if (runCd) {
      fixture.detectChanges();
    }

    const user = userEvent.setup();

    return { fixture, user, httpClient };
  };

  it('should init', () => {
    setup(true);
  });

  it('should show 4 grundstücke', async () => {
    const { fixture, httpClient } = setup(false);
    httpClient.get.mockReturnValue(of(grundstuecke))

    fixture.autoDetectChanges(true);

    // tick();
    // fixture.detectChanges()

    await fixture.whenStable();

    const grundstueckeElements = fixture.debugElement.queryAll(
      By.css('[data-testid=grundstueck]'),
    );
    expect(grundstueckeElements.length).toBe(4);
  });

  it('should search for Mödling', async () => {
    const { fixture, user, httpClient } = setup(false);
    httpClient.get.mockReturnValueOnce(of(grundstuecke))
    fixture.autoDetectChanges(true);

    await user.type(screen.getByRole('textbox', {
      name: /kastralname/i,
    }), "Mö")

    httpClient.get.mockReturnValueOnce(of(grundstuecke.filter(g => g.kgName === 'Mödling')))
    await userEvent.click(screen.getByRole('button', { name: /suche/i }));

    await fixture.whenStable();

    const grundstueckeElements = screen.getAllByTestId('grundstueck');
    screen.logTestingPlaygroundURL()
    expect(grundstueckeElements.length).toBe(4);
  });
});
