import { writeFileSync } from 'fs';
import { join } from 'path';

type SpecPattern = string | string[];

export const generateTsConfigContent = (specPattern: SpecPattern, projectRoot: string): string => {
  const getFilePath = (fileName: string): string => join(projectRoot, fileName);
  const getCySupportFile: string = join(projectRoot, 'cypress/support/component.ts');

  const getIncludePaths = (): string[] => {
    if (Array.isArray(specPattern)) {
      return [...specPattern.map((sp) => getFilePath(sp)), getCySupportFile];
    }

    if (typeof specPattern === 'string') {
      return [getFilePath(specPattern), getCySupportFile];
    }

    return [];
  };

  return `
{
  "extends": "${getFilePath('tsconfig.base.json')}",
  "compilerOptions": {
    "outDir": "${getFilePath('out-tsc/cy')}",
    "types": ["${getFilePath('node_modules/cypress')}"],
    "allowSyntheticDefaultImports": true
  },
  "include": [${getIncludePaths().map((x) => `"${x}"`)}]
}
`;
};

export const generateTsConfig = (
  specPattern: SpecPattern,
  projectRoot: string,
  tempDir: string
): void => {
  const tsconfigContent = generateTsConfigContent(specPattern, projectRoot).replace(/\\/g, '/');
  console.log(tsconfigContent);
  writeFileSync(`${tempDir}/tsconfig.cy.json`, tsconfigContent);
};
