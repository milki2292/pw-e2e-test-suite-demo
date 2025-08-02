import { Page } from '@playwright/test';

export class LoginToSwag {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginStandardUser() {
    await this.page.getByPlaceholder('Username').fill('standard_user');
    await this.page.getByPlaceholder('Password').fill('secret_sauce');
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
