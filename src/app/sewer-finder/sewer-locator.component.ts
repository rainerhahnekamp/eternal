import { Component, inject, ResourceStatus, effect } from '@angular/core';
import { SewerLocator } from './internal/sewer-locator.service';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  template: `
    <div class="main">
      <h1>Sewer Locator</h1>
      <p>
        🕵️ Need to slip underground like a ninja? This tool scans your
        surroundings and pinpoints the nearest sewer manhole, straight from
        OpenStreetMap. Perfect for turtles in a hurry — or developers testing
        map data.
      </p>
      <p>
        🔍 Just allow location access and we’ll handle the rest. Sewer routes
        not guaranteed to be pizza-delivery safe.
      </p>

      <div class="my-4">
        <button mat-raised-button (click)="locate()">
          Locate closest sewer
        </button>
      </div>

      @switch (sewerLocator.status()) {
        @case (ResourceStatus.Loading) {
          <div>Scanning city blocks for sewers...</div>
        }
        @case (ResourceStatus.Error) {
          <div>
            Ooops! Could not locate the sewer. Shredder must be blocking the
            Signal.
          </div>
        }
        @case (ResourceStatus.Resolved) {
          @let result = sewerLocator.value();
          @if (result.nearest) {
            <div>
              <h2>Booyakasha! Sewer found!</h2>
              <p>Distance: {{ result.minDistance | number: '1.0-0' }} meters</p>
              <p>
                Coordinates: {{ result.nearest.lat }}, {{ result.nearest.lon }}
              </p>
            </div>
          }
        }
      }

      <div id="map"></div>
    </div>
  `,
  styleUrl: './sewer-locator.component.scss',
  imports: [DecimalPipe, MatButtonModule],
})
export class SewerLocatorComponent {
  protected readonly sewerLocator = inject(SewerLocator);
  protected map: L.Map | undefined;

  protected async locate() {
    const position = await this.#getCurrentPosition();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    void this.sewerLocator.setLocation(lat, lon);
  }

  #getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject),
    );
  }

  constructor() {
    effect(() => {
      const value = this.sewerLocator.value();
      if (!value.nearest || !value.current) {
        return;
      }

      const { lat, lon } = value.nearest;

      this.map = L.map('map').setView([lat, lon], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      L.marker([value.current.lat, value.current.lon], {
        icon: L.icon({
          iconUrl: 'assets/turtle-icon.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      })
        .addTo(this.map)
        .bindPopup('You are here 🐢')
        .openPopup();

      for (const sewer of value.sewers) {
        const { lat, lon } = sewer;
        const sewerMarker = L.marker([lat, lon], {
          icon: L.icon({
            iconUrl: 'assets/sewer-icon.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        });

        if (lat === value.nearest.lat && lon === value.nearest.lon) {
          sewerMarker.addTo(this.map).bindPopup('Nearest Sewer 🕳️').openPopup();
        } else {
          sewerMarker.addTo(this.map);
        }
      }
    });
  }

  protected readonly ResourceStatus = ResourceStatus;
}
