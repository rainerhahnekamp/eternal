import { HttpContextToken } from '@angular/common/http';

export const ANONYMOUS_CONTEXT = new HttpContextToken(() => false);
