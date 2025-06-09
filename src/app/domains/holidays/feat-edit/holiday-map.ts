import { Component, effect } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-holiday-map',
  template: ` <div id="map"></div> `,
  styles: `
    #map {
      height: 250px;
      width: 100%;
    }
  `,
  imports: [],
})
export class HolidayMap {
  map: L.Map | undefined;
  #getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject),
    );
  }

  constructor() {
    const lat = 49.9929;
    const lon = 8.2473;

    effect(() => {
      this.map = L.map('map').setView([lat, lon], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    });
  }
}
