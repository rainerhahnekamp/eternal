export const createParentEngine = () => {
  const runQuery = (root: Node, selector: string) => {
    let current: Node | Element | null = root;

    while (current) {
      console.info(current);
      if ('matches' in current) {
        if ((current as Element).matches(selector)) {
          return current;
        }
      }

      current = current.parentElement;
    }

    return null;
  };

  return {
    query(root: Node, selector: string): Node | null {
      return runQuery(root, selector);
    },

    queryAll(root: Node, selector: string): Node[] {
      const node = runQuery(root, selector);

      return node ? [node] : [];
    },
  };
};
