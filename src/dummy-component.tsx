import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export function DummyComponent() {
  const title = signal("");
  const httpClient = inject(HttpClient);

  return ng`<h1>Hallo from {{ title() }}</h1>`;
}
