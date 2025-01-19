// https://medium.com/inato/using-typescript-to-build-custom-eslint-rules-faster-53ad1c9dee2b

module.exports = {
  rules: {
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
