```bash
npx ng add @cypress/schematic
npm i -D playwright-webkit @testing-library/cypress axe-core cypress-axe
```

**cypress/fixtures/holidays.json**

```json
[
  {
    "title": "Unicorn",
    "teaser": "You found One Piece",
    "imageUrl": "/holiday/OnePiece.png",
    "description": "Congratulations, you finally found Unicorn. Roger would be proud of you."
  }
]
```

**cypress/support/e2e.ts**

```typescript
import "./commands";
import "@testing-library/cypress/add-commands";
```

**cypress/support/commands.ts**

```typescript
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    findByRole(role: string, textMatch: string | RegExp): Chainable<JQuery>;
  }
}
```

Update **scripts/branches.txt**
