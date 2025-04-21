import { inject, Injectable, ResourceStatus, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getDistance } from 'geolib';
import { lastValueFrom } from 'rxjs';

interface Node {
  lon: number;
  lat: number;
}

@Injectable({
  providedIn: 'root',
})
export class SewerLocator {
  readonly #http = inject(HttpClient);

  readonly #status = signal<ResourceStatus>(ResourceStatus.Idle);
  readonly #value = signal<{
    current: Node | undefined;
    minDistance: number;
    nearest: undefined | Node;
    sewers: Node[];
  }>({
    current: undefined,
    minDistance: 0,
    nearest: undefined,
    sewers: [],
  });

  readonly sewers = {
    status: this.#status.asReadonly(),
    value: this.#value.asReadonly(),
  };

  async setLocation(lat: number, lon: number) {
    const query = `
      [out:json];
      node["man_made"="manhole"](around:5000,${lat},${lon});
      out body;
    `;

    this.#status.set(ResourceStatus.Loading);

    const url = 'https://overpass-api.de/api/interpreter';
    const result = await lastValueFrom(
      this.#http.post<{ elements: Node[] }>(url, query, {
        responseType: 'json',
      }),
    );

    this.#status.set(ResourceStatus.Resolved);

    let nearest: Node | undefined;
    let minDistance = Infinity;

    for (const node of result.elements) {
      const dist = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: node.lat, longitude: node.lon },
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = node;
      }
    }

    this.#value.set({
      current: { lat, lon },
      minDistance,
      nearest,
      sewers: result.elements,
    });
  }
}
