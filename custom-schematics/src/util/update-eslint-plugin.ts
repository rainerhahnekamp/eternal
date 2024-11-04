import { JsonValue } from '@angular-devkit/core';
import { SchematicContext, Tree } from '@angular-devkit/schematics';

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function assertPackageJson(
  packageJson: JsonValue,
): asserts packageJson is PackageJson {
  if (
    packageJson &&
    typeof packageJson === 'object' &&
    !Array.isArray(packageJson)
  ) {
    if (!('devDependencies' in packageJson)) {
      packageJson.devDependencies = {};
    }

    if (!('dependencies' in packageJson)) {
      packageJson.dependencies = {};
    }

    return;
  } else {
    throw new Error('package.json is not an object');
  }
}

export function updateESLint(
  version: string,
  tree: Tree,
  _context: SchematicContext,
): void {
  const packageJson = tree.readJson('package.json');
  assertPackageJson(packageJson);

  if (
    packageJson.devDependencies['@rainerhahnekamp/eslint-plugin'] !== version
  ) {
    packageJson.devDependencies['@rainerhahnekamp/eslint-plugin'] = version;
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    _context.logger.info(
      "Updated '@rainerhahnekamp/eslint-plugin' to version " + version,
    );
  }
}
