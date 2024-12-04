import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export interface ConfigurationFeatures {
  mockHolidays: boolean;
  mockCustomers: boolean;
  pagedCustomers: boolean;
}

export class Configuration {
  #baseUrl: string;
  #mockCustomers: boolean;
  #mockHolidays: boolean;
  #pagedCustomers: boolean;

  #storageKey = 'eternal-configuration';
  isServer = isPlatformServer(inject(PLATFORM_ID));

  constructor(
    baseUrl: string,
    mockCustomers = true,
    mockHolidays = true,
    pagedCustomers = true,
  ) {
    this.#baseUrl = baseUrl;
    const values = { mockCustomers, mockHolidays, pagedCustomers };

    this.#mockCustomers = values.mockCustomers;
    this.#mockHolidays = values.mockHolidays;
    this.#pagedCustomers = values.pagedCustomers;
    this.loadFromLocalStorage();
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

  get features() {
    return {
      mockHolidays: this.#mockHolidays,
      mockCustomers: this.#mockCustomers,
      pagedCustomers: this.#pagedCustomers,
    };
  }

  updateFeatures(configurationFeatures: Partial<ConfigurationFeatures>) {
    const { mockHolidays, mockCustomers, pagedCustomers } =
      configurationFeatures;

    this.#mockHolidays = mockHolidays ?? this.#mockHolidays;
    this.#mockCustomers = mockCustomers ?? this.#mockCustomers;
    this.#pagedCustomers = pagedCustomers ?? this.#pagedCustomers;

    localStorage.setItem(
      this.#storageKey,
      JSON.stringify(configurationFeatures),
    );
  }

  loadFromLocalStorage() {
    if (this.isServer) {
      return;
    }

    const storageData = localStorage.getItem(this.#storageKey);
    if (!storageData) {
      return;
    }

    const configuration = JSON.parse(storageData);
    const { mockCustomers, mockHolidays, pagedCustomers } = configuration;

    this.#mockCustomers = mockCustomers;
    this.#mockHolidays = mockHolidays;
    this.#pagedCustomers = pagedCustomers;
  }
}
