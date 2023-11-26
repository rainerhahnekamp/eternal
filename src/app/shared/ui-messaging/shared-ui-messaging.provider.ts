import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

export const sharedUiMessagingProvider = [importProvidersFrom(MatDialogModule)];
