import { Component, inject, linkedSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationStore } from './registration-store';
import { form, required, Field } from '@angular/forms/signals';
import { ProductSelectionCard } from './product-selection-card';
import { Router } from '@angular/router';

type ProductType = 'newsletter' | 'eternal-journal';

@Component({
  selector: 'app-product-selection',
  template: `
    @let productGroup = formData().productGroup;
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-bold mb-8 text-center">
        Select Your Subscription
      </h1>

      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <app-product-selection-card
          [field]="productForm.productGroup"
          productGroup="newsletter"
          title="Newsletter"
          subtitle="Free Account"
        >
          <div class="py-4">
            <p class="text-lg font-semibold mb-2">Electronic Newsletter</p>
            <p class="text-gray-600">
              Stay updated with our latest travel insights, tips, and
              destination highlights delivered directly to your inbox.
            </p>
            <div class="mt-4">
              <span class="text-2xl font-bold text-primary">Free</span>
            </div>
          </div>
        </app-product-selection-card>

        <app-product-selection-card
          [field]="productForm.productGroup"
          productGroup="eternal-journal"
          title="Eternal Journal"
          subtitle="Monthly Subscription"
        >
          <div class="py-4">
            <p class="text-lg font-semibold mb-2">Monthly Country Focus</p>
            <p class="text-gray-600">
              Receive a beautifully crafted monthly journal that deep dives into
              one particular country, exploring its culture, history,
              traditions, and hidden gems.
            </p>
            <div class="mt-4">
              <span class="text-2xl font-bold text-primary">Premium</span>
            </div>
          </div>
        </app-product-selection-card>
      </div>

      <div class="flex justify-center gap-4 mt-8">
        <button mat-button color="primary" (click)="skip()" class="px-8 py-2">
          Skip and continue
        </button>

        <button
          mat-raised-button
          color="primary"
          [disabled]="productGroup === 'none'"
          (click)="continue()"
          [class]="{
            'px-8': true,
            'py-2': true,
            invisible: productForm.productGroup().value() === 'none',
          }"
        >
          Continue
        </button>
      </div>
    </div>
  `,
  imports: [
    MatButton,
    MatCardModule,
    MatIconModule,
    ProductSelectionCard,
    Field,
  ],
})
export class ProductRegistrationScreen {
  readonly #registrationStore = inject(RegistrationStore);
  readonly #router = inject(Router);

  formData = linkedSignal(() => ({
    productGroup: this.#registrationStore.productGroup(),
  }));

  productForm = form(this.formData, (path) => {
    required(path.productGroup);
  });

  protected selectProduct(product: ProductType) {
    this.#registrationStore.setProductGroup(product);
  }

  protected continue() {
    this.#router.navigate(['/registration/customer']);
  }

  protected skip() {
    // Skip product selection and proceed to sign up
    // Product group remains 'none' when skipped
    this.continue();
  }
}
