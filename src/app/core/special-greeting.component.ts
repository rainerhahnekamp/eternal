import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';

const vienna = {
  longitude: 16.3719,
  latitude: 48.2082,
};

// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

@Component({
    selector: 'app-special-greeting',
    template: `@if (showSpecialGreeting()) {
    <div>
      <h3>{{ greeting() }}</h3>
      <p>
        You are {{ distanceFromVienna() | number: '1.0-0' }} kilometers away
        from us.
      </p>
      <p>Your current time is {{ time | date: 'HH:mm' }}</p>
    </div>
  }`,
    imports: [DecimalPipe, DatePipe]
})
export class SpecialGreetingComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  showSpecialGreeting = signal(false);
  greeting = signal('');
  distanceFromVienna = signal(0);
  time = new Date();

  constructor() {
    this.setup();
  }

  async setup() {
    if (!this.isBrowser) {
      return;
    }

    const status = await window.navigator.permissions.query({
      name: 'geolocation',
    });
    console.log(`status: ${status.state}`);
    if (status.state !== 'granted') {
      return;
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject),
    );
    const { longitude, latitude } = position.coords;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    )
      .then((res) => res.json())
      .then((address) => {
        const greetings: Record<string, string> = {
          de: 'Ein herzliches Willkommen an unsere Gäste von',
          en: 'We very welcome our guests from',
          es: 'bienvenidos nuestros invitados de',
        };
        if (address?.name) {
          const locale = navigator.language.split('-')[0];
          const welcome =
            locale in greetings ? greetings[locale] : greetings['en'];
          this.greeting.set(`${welcome} ${address.name}`);
          this.distanceFromVienna.set(
            getDistanceFromLatLonInKm(
              latitude,
              longitude,
              vienna.latitude,
              vienna.longitude,
            ),
          );
          this.showSpecialGreeting.set(true);
        }
      });
  }
}
