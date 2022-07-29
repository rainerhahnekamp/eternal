// We are doing this as Typescript is getting confused between Cypress and Jest Types
// so we are explicitly telling it which expect statement to use
export const _expect = expect as unknown as jest.Expect;