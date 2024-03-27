import { test } from '@playwright/test';

const createParentEngine = () => {
  const runQuery = (root: Node, selector: string) => {
    let current: Node | Element | null = root;
    while (current) {
      if ('matches' in current) {
        if ((current as Element).matches(selector)) {
          console.log(current);
          return current;
        }
      }

      current = current.parentElement;
    }

    return null;
  };

  return {
    query(root: Node, selector: string) {
      return runQuery(root, selector);
    },
    queryAll(root: HTMLElement, selector: string) {
      const node = runQuery(root, selector);

      return node ? [node] : [];
    },
  };
};

export const parentEngineTest = test.extend<
  Record<never, never>,
  { registrierung: void }
>({
  registrierung: [
    async ({ playwright }, use) => {
      await playwright.selectors.register('eltern', createParentEngine);
      await use();
    },
    { scope: 'worker', auto: true },
  ],
});
