import { PathKind, SchemaPath, validate } from '@angular/forms/signals';

export function validateSameValue<
  T extends SchemaPath<string, 1, PathKind.Child>,
>(field1: T, field2: T, message = 'Fields must have the same value') {
  return validate(field2, ({ valueOf }) => {
    if (valueOf(field1) === valueOf(field2)) {
      return null;
    }

    return { kind: 'sameValue', message };
  });
}
