import { readonlyPrefix } from './readonly-prefix';
import { inputLimit } from './input-limit';

export = {
  configs: {
    recommended: {
      plugins: {
        custom: {
          rules: {
            'readonly-prefix': readonlyPrefix,
            'input-limit': inputLimit,
          },
        },
      },
      rules: {
        'custom/readonly-prefix': 'error',
        'custom/input-limit': 'error',
      },
    },
  },
};
