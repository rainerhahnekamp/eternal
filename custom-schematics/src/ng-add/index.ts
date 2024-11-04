import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { updateDependency } from '../util/update-dependency';

export function ngAdd(): Rule {
  return (tree, _context: SchematicContext) => {
    updateDependency('@ngrx/signals', '18.0.0', tree, _context);

    return tree;
  };
}
