import { Rule } from '@angular-devkit/schematics';
import { updateDependency } from "../../util/update-dependency";

export default function (): Rule {
  return (_, context) => {
    updateDependency('@ngrx/signals', '18.1.0', _, context);
  };
}
