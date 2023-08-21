export default class Nyc {
  constructor(config: { tempDirectory: string; reporter: ['html'] });
  report(): Promise<string>;
}
