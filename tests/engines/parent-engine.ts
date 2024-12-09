export const createParentEngine = () => {
  const runQuery = (root: Node, selector: string) => {
    console.log(root);
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
