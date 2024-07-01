# Installation Instructions

```bash
npx ng add @angular/material
```

Open `styles.scss` and add the following rules:

```scss
@use "@angular/material" as mat;

$palette: (
  50: #e4f2f6,
  100: #bcdfe7,
  200: #90c9d8,
  300: #64b3c8,
  400: #42a3bc,
  500: #2193b0,
  600: #1d8ba9,
  700: #1880a0,
  800: #147697,
  900: #0b6487,
  A100: #b7e8ff,
  A200: #84d8ff,
  A400: #51c8ff,
  A700: #37c0ff,
  contrast: (
    50: #000000,
    100: #000000,
    200: #000000,
    300: #000000,
    400: #000000,
    500: #ffffff,
    600: #ffffff,
    700: #ffffff,
    800: #ffffff,
    900: #ffffff,
    A100: #000000,
    A200: #000000,
    A400: #000000,
    A700: #000000,
  ),
);

@include mat.core();
$candy-app-primary: mat.define-palette($palette);
$candy-app-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$candy-app-warn: mat.define-palette(mat.$red-palette);
$candy-app-theme: mat.define-light-theme(
  (
    color: (
      primary: $candy-app-primary,
      accent: $candy-app-accent,
      warn: $candy-app-warn,
    ),
    typography: mat.define-typography-config(),
  )
);
@include mat.all-component-themes($candy-app-theme);

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  background-image: linear-gradient(white, white), url("./assets/large-bg.jpg");
  background-size: cover;
  background-blend-mode: saturation;
}

a {
  color: #2193b0;
}

.error {
  color: map-get(mat.$red-palette, 500);
}

mat-checkbox + mat-checkbox,
mat-radio-button + mat-radio-button {
  margin-left: 1.5em;
}

.content-width {
  width: 450px;
}

h2 {
  font-weight: bold;
  font-size: 125%;
}

// tailwind fix
.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-right-style: hidden;
}
```

```bash
npm i @auth0/auth0-angular date-fns @angular/material-date-fns-adapter
```

```bash
npx ng add @angular-eslint/schematics
```

```bash
npm i @ngrx/store @ngrx/eslint-plugin @ngrx/store-devtools @ngrx/effects
```

Add this to your **.eslintrc.json**:

```json
{
  "files": ["*.ts"],
  "extends": ["plugin:@ngrx/strict"]
}
```

```bash
npm i -D prettier tailwindcss postcss autoprefixer
npx tailwindcss init
```

In **tailwind.config.js** set the `content` property's value to:

```js
{
  content: ["./src/app/**/*.{html,ts}"];
}
```

```bash
npm i -D @softarc/sheriff-core @softarc/eslint-plugin-sheriff
```

Add this to your **.eslintrc.json**:

```json
{
  "files": ["*.ts"],
  "extends": ["plugin:@softarc/sheriff/default"]
}
```
