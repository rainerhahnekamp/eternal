import { HttpContext, HttpContextToken } from '@angular/common/http';

export function withContextTokens(...tokens: HttpContextToken<boolean>[]) {
  const context = new HttpContext();
  for (const token of tokens) {
    context.set(token, true);
  }

  return context;
}
