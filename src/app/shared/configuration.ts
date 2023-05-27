export type ConfigurationFeatures = {
  mockHolidays: boolean;
  mockCustomers: boolean;
};

export class Configuration {
  #baseUrl: string;
  #mockCustomers: boolean;
  #mockHolidays: boolean;

  #storageKey = 'eternal-configuration';

  constructor(baseUrl: string, mockCustomers = true, mockHolidays = true) {
    this.#baseUrl = baseUrl;
    const values = { mockCustomers, mockHolidays };

    this.#mockCustomers = values.mockCustomers;
    this.#mockHolidays = values.mockHolidays;
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

  get features() {
    return {
      mockHolidays: this.#mockHolidays,
      mockCustomers: this.#mockCustomers
    };
  }

  updateFeatures(configurationFeatures: Partial<ConfigurationFeatures>) {
    const { mockHolidays, mockCustomers } = configurationFeatures;

    this.#mockHolidays = mockHolidays ?? this.#mockHolidays;
    this.#mockCustomers = mockCustomers ?? this.#mockCustomers;

    localStorage.setItem(this.#storageKey, JSON.stringify(configurationFeatures));
  }
}
