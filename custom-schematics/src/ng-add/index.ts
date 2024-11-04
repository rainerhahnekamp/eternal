import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { updateESLint } from '../util/update-eslint-plugin';

export default function ngAdd(): Rule {
  return (tree, _context: SchematicContext) => {
    updateESLint('0.0.1', tree, _context);

    return tree;
  };
}
