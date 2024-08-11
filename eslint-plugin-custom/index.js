// https://medium.com/inato/using-typescript-to-build-custom-eslint-rules-faster-53ad1c9dee2b

export const signalStoreShouldPreferProtectedState =
  'signalStoreShouldPreferProtectedState';
export const signalStoreShouldPreferProtectedStateSuggest =
  'signalStoreShouldPreferProtectedStateSuggest';

module.exports = {
  rules: {
    name: "protected-state",
    meta: {
      type: "suggestion",
      hasSuggestions: true,
      ngrxModule: "signals",
      docs: {
        description: `A Signal Store should prefer protected state`,
      },
      schema: [],
      messages: {
        [signalStoreShouldPreferProtectedState]: `State changes should only managed by the Signal Store to prevent unintended modifications and provide clear ownership of where changes occur`,
        [signalStoreShouldPreferProtectedStateSuggest]: `{ protectedState: false } should be removed to prevent external state mutations.`,
      },
    },
    defaultOptions: [],
    create: (context) => {
      return {
        [`CallExpression[callee.name=signalStore][arguments.length>0] > ObjectExpression[properties.length>0] > Property[key.name=protectedState][value.value=false]`](
          node,
        ) {
          context.report({
            node,
            messageId: signalStoreShouldPreferProtectedState,
            suggest: [
              {
                messageId: signalStoreShouldPreferProtectedStateSuggest,
                fix: (fixer) => {
                  const sourceFile = context.sourceCode;
                  const tokenAfter = sourceFile.getTokenAfter(node);
                  const tokenAfterIsComma = tokenAfter?.value?.trim() === ",";
                  return fixer.removeRange([
                    node.range[0],
                    /* remove trailing comma as well */
                    tokenAfterIsComma ? tokenAfter.range[1] : node.range[1],
                  ]);
                },
              },
            ],
          });
        },
      };
    },
    "on-push": {
      defaultOptions: [],
      meta: {
        type: "suggestion",
        messages: {
          onPush: "Component has to be OnPush",
          inputDecorator: "Use the new input function",
          outputDecorator: "Use the new output function",
        },
        fixable: "code",
        schema: [], // no options
      },
      create: (context) => ({
        Decorator: (node) => {
          let hasOnPush = false;
          if (node.expression?.callee?.name === "Component") {
            node.expression.arguments.find((argument) => {
              const changeDetection = argument.properties.find(
                (property) => property.key.name === "changeDetection",
              );
              if (changeDetection?.value.property.name === "OnPush") {
                hasOnPush = true;
              }
            });

            if (!hasOnPush) {
              context.report({ node, message: "Component needs to be OnPush" });
            }
          }
        },
      }),
    },
    "signal-api": {
      defaultOptions: [],
      meta: {
        type: "suggestion",
        messages: {
          onPush: "Component has to be OnPush",
          inputDecorator: "Use the new input function",
          outputDecorator: "Use the new output function",
        },
        fixable: "code",
        schema: [], // no options
      },
      create: (context) => ({
        Decorator: (node) => {
          if (["Input", "Output"].includes(node.expression?.callee?.name)) {
            context.report({
              node,
              message: `${node.expression.callee.name} is not allowed`,
            });
          }
        },
      }),
    },
  },
};
