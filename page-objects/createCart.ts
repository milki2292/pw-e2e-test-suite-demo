import { Page, expect } from '@playwright/test';

export class CreateCart {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async add2Items(item1: string, item2: string) {
    const firstItem = this.page.locator('.inventory_item', {
      hasText: `${item1}`,
    });
    const secondItem = this.page.locator('.inventory_item', {
      hasText: `${item2}`,
    });

    await firstItem.getByRole('button').click();
    await secondItem.getByRole('button').click();

    // Opening shoping cart
    await this.page.locator('.shopping_cart_link').click();

    //Verifying if added items are present

    await expect(
      this.page.locator('.cart_item', { hasText: `${item1}` })
    ).toBeVisible();

    await expect(
      this.page.locator('.cart_item', { hasText: `${item2}` })
    ).toBeVisible();
  }

  async removeItemsfromCart() {
    const items = await this.page.locator('.cart_item_label').all();
    const count = items.length;

    for (let i = 0; i < count; i++) {
      await this.page.getByRole('button', { name: 'Remove' }).first().click();
    }
  }

  async sumUpPrices() {
    const prices = this.page.locator('.inventory_item_price').all();

    let sum: number = 0;

    for (const price of await prices) {
      let stringValue = await price.textContent();
      let numberValue = parseFloat(stringValue?.slice(1) || '');
      sum = sum + numberValue;
    }

    return sum;
  }
}
