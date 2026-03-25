import { InjectionToken } from '@angular/core';

export const ADDRESS_SUPPLIER = new InjectionToken<string[]>(
  'ADDRESS_SUPPLIER',
  { providedIn: 'root', factory: () => [] as string[] },
);
