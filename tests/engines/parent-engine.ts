export const createParentEngine = () => {
  const runQuery = (root: Node, selector: string) => {
    console.log(`starting runQuery: ${selector}`);
    let current: Node | Element | null = root;
    while (current) {
      console.log(`aktuelles DOM Element %o`, current);
      if ('matches' in current) {
        if ((current as Element).matches(selector)) {
          console.log(current);
          return current;
        }
      }

      current = current.parentElement;
    }

    console.log('Habe nichts gefunden');
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
