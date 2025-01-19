import { signal } from '@angular/core';

export interface ConfigurationFeatures {
  mockHolidays: boolean;
  mockCustomers: boolean;
  pagedCustomers: boolean;
  runHeartbeat: boolean;
}

export class Configuration {
  #baseUrl: string;
  #mockCustomers: boolean;
  #mockHolidays: boolean;
  #runHeartbeat = signal(true);
  #pagedCustomers: boolean;

  #storageKey = 'eternal-configuration';

  constructor(
    baseUrl: string,
    mockCustomers = true,
    mockHolidays = true,
    pagedCustomers = true,
    runHeartbeat = false,
  ) {
    this.#baseUrl = baseUrl;
    const values = { mockCustomers, mockHolidays, pagedCustomers };

    this.#mockCustomers = values.mockCustomers;
    this.#mockHolidays = values.mockHolidays;
    this.#pagedCustomers = values.pagedCustomers;
    this.#runHeartbeat.set(runHeartbeat);
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  get mockCustomers() {
    return this.#mockCustomers;
  }
  get mockHolidays() {
    return this.#mockHolidays;
  }
  get pagedCustomers() {
    return this.#pagedCustomers;
  }
  get runHeartbeat() {
    return this.#runHeartbeat.asReadonly();
  }

  updateFeatures(configurationFeatures: Partial<ConfigurationFeatures>) {
    const { mockHolidays, mockCustomers, pagedCustomers, runHeartbeat } =
      configurationFeatures;

    this.#mockHolidays = mockHolidays ?? this.#mockHolidays;
    this.#mockCustomers = mockCustomers ?? this.#mockCustomers;
    this.#pagedCustomers = pagedCustomers ?? this.#pagedCustomers;
    this.#runHeartbeat.set(runHeartbeat ?? this.#runHeartbeat());

    localStorage.setItem(
      this.#storageKey,
      JSON.stringify(configurationFeatures),
    );
  }
}
