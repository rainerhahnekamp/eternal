export type ConfigurationFeatures = {
  mockHolidays: boolean;
  mockCustomers: boolean;
  useTestid: boolean;
};

export class Configuration {
  #baseUrl: string;
  #mockCustomers: boolean;
  #mockHolidays: boolean;
  #useTestid: boolean;

  #storageKey = 'eternal-configuration';

  constructor(baseUrl: string, mockCustomers = true, mockHolidays = true, useTestid = true) {
    this.#baseUrl = baseUrl;
    const values = { mockCustomers, mockHolidays, useTestid };
    // const savedValues = JSON.parse(localStorage.getItem(this.#storageKey) || '{}');
    // Object.assign(values, savedValues);

    this.#mockCustomers = values.mockCustomers;
    this.#mockHolidays = values.mockHolidays;
    this.#useTestid = values.useTestid;
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
  get useTestid() {
    return this.#useTestid;
  }

  get features() {
    return {
      mockHolidays: this.#mockHolidays,
      mockCustomers: this.#mockCustomers,
      useTestid: this.#useTestid
    };
  }

  updateFeatures(configurationFeatures: Partial<ConfigurationFeatures>) {
    const { mockHolidays, mockCustomers, useTestid } = configurationFeatures;

    this.#useTestid = useTestid ?? this.#useTestid;
    this.#mockHolidays = mockHolidays ?? this.#mockHolidays;
    this.#mockCustomers = mockCustomers ?? this.#mockCustomers;

    localStorage.setItem(this.#storageKey, JSON.stringify(configurationFeatures));
  }
}
