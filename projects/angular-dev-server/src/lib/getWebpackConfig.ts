import { AngularWebpackPlugin } from '@ngtools/webpack';
import { Configuration } from 'webpack';

export async function getWebpackConfig(tmpDir: string): Promise<Configuration> {
  /* We are using JIT mode as AOT has issues with overriding components (e.g. component providers etc...)
   * Cf. https://github.com/jordanpowell88/angular-ct/issues/36 */
  const jitMode = true;

  return {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: '@ngtools/webpack',
        },
        {
          test: /(\.scss|\.sass)$/,
          use: ['raw-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          loader: 'raw-loader',
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
        },
        {
          // Angular linker needed to link partial-ivy code
          // See https://angular.io/guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                [
                  '@angular/compiler-cli/linker/babel',
                  { linkerJitMode: jitMode },
                ],
              ],
              compact: false,
              cacheDirectory: true,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new AngularWebpackPlugin({
        jitMode,
        tsconfig: `${tmpDir}/tsconfig.cy.json`,
      }),
    ],
  };
}
