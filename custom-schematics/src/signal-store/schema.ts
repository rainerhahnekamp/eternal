export interface Schema {
  name: string;
  skipState: boolean;
  skipMethods: boolean;
  skipComputed: boolean;
  withHooks: boolean;
}
