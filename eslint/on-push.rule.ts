//medium.com/inato/using-typescript-to-build-custom-eslint-rules-faster-53ad1c9dee2b

import { TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'onPush' | 'inputDecorator' | 'outputDecorator';

const myRule: TSESLint.RuleModule<MessageIds> = {
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    messages: {
      onPush: 'Component has to be OnPush',
      inputDecorator: 'Use the new input function',
      outputDecorator: 'Use the new output function',
    },
    fixable: 'code',
    schema: [], // no options
  },
  create: (context) => ({}),
};

export default myRule;
