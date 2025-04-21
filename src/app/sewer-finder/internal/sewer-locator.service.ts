import { Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { getDistance } from 'geolib';
import { assertDefined } from '../../shared/util/assert-defined';

interface Node {
  lon: number;
  lat: number;
}

interface SewerState {
  current: Node | undefined;
  minDistance: number;
  nearest: Node | undefined;
  sewers: Node[];
}

@Injectable({
  providedIn: 'root',
})
export class SewerLocator {
  readonly #location = signal<undefined | { lat: number; lon: number }>(
    undefined,
  );

  setLocation(lat: number, lon: number) {
    this.#location.set({ lat, lon });
  }

  #sewers = httpResource(
    () => {
      const location = this.#location();
      if (!location) {
        return undefined;
      }
      const { lat, lon } = location;

      return {
        url: 'https://overpass-api.de/api/interpreter',
        method: 'POST',
        body: `
      [out:json];
      node["man_made"="manhole"](around:5000,${lat},${lon});
      out body;`,
      };
    },
    {
      defaultValue: {
        current: undefined,
        minDistance: 0,
        nearest: undefined,
        sewers: [],
      } as SewerState,
      parse: (response: unknown) => {
        const value = response as { elements: Node[] };
        const location = this.#location();
        assertDefined(location);

        const { lat, lon } = location;
        let nearest: Node | undefined;
        let minDistance = Infinity;

        for (const node of value.elements) {
          const dist = getDistance(
            { latitude: lat, longitude: lon },
            { latitude: node.lat, longitude: node.lon },
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearest = node;
          }
        }

        return {
          current: { lat, lon },
          minDistance,
          nearest,
          sewers: value.elements,
        } as SewerState;
      },
    },
  );

  sewers = this.#sewers.asReadonly();
}
