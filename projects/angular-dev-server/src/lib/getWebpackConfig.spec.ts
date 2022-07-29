import { AngularWebpackPlugin } from "@ngtools/webpack"
import { getWebpackConfig } from "./getWebpackConfig";
import { Configuration } from 'webpack';
describe('getWebpackConfig', () => {
    it('should prepend the tmpDir to the tsconfig path and return the Webpack Configuration', async() => {
  
        // arrange
        const tmpDir = '/myTempDir/123456789/tmp'
        const expected: Configuration = {
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
                  loader: 'raw-loader'
                },
                { // Angular linker needed to link partial-ivy code
                  // See https://angular.io/guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli
                  test: /\.m?js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      plugins: ['@angular/compiler-cli/linker/babel'],
                      compact: false,
                      cacheDirectory: true
                    }
                  }
                }
              ],
            },
            resolve: {
                extensions: ['.ts', '.js'],
            },
            plugins: [
                new AngularWebpackPlugin({
                    tsconfig: `${tmpDir}/tsconfig.cy.json`
                }),
            ],
        }

        // act
        const actual = await getWebpackConfig(tmpDir);

        // assert
        expect(actual).toEqual(expected);
    })
})