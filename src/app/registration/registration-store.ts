import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type ProductGroup = 'none' | 'newsletter' | 'eternal-journal';
export interface RegistrationState {
  productGroup: ProductGroup;
  customer: {
    firstname: string;
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    birthday: Date | undefined;
  };
  address: {
    street: string;
    streetNumber: string;
    zip: string;
    city: string;
    country: string;
    separateBillingAddress: boolean;
    billingAddress: {
      street: string;
      streetNumber: string;
      zip: string;
      city: string;
      country: string;
      vatNumber: string;
    };
  };
}

export const RegistrationStore = signalStore(
  { providedIn: 'root' },
  withState<RegistrationState>({
    productGroup: 'none',
    customer: {
      firstname: '',
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      birthday: undefined,
    },
    address: {
      street: '',
      streetNumber: '',
      zip: '',
      city: '',
      country: '',
      separateBillingAddress: false,
      billingAddress: {
        street: '',
        streetNumber: '',
        zip: '',
        city: '',
        country: '',
        vatNumber: '',
      },
    },
  }),

  withMethods((store) => ({
    setProductGroup(productGroup: ProductGroup) {
      patchState(store, { productGroup });
    },
  })),
);
