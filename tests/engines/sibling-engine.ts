import { test } from '@playwright/test';

const createParentEngine = () => {
  const runQuery = (root: Node, selector: string): Node[] => {
    const returner: Node[] = [];

    const parent = root.parentElement;

    if (!parent) {
      return [];
    }

    for (const sibling of parent.children) {
      if (
        sibling !== root &&
        'matches' in sibling &&
        (sibling as Element).matches(selector)
      ) {
        returner.push(sibling);
      }
    }

    return returner;
  };

  return {
    query(root: Node, selector: string) {
      const siblings = runQuery(root, selector);
      if (siblings.length > 0) {
        return siblings[0];
      } else {
        return null;
      }
    },
    queryAll(root: HTMLElement, selector: string) {
      return runQuery(root, selector);
    },
  };
};

export const siblingEngineTest = test.extend<
  Record<never, never>,
  { selectorRegistration: void }
>({
  selectorRegistration: [
    async ({ playwright }, use) => {
      await playwright.selectors.register('sibling', createParentEngine);
      await use();
    },
    { scope: 'worker', auto: true },
  ],
});
