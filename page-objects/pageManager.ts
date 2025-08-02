import { Page } from '@playwright/test';
import { LoginToSwag } from '../page-objects/loginToSwag';

export class PageManager {
  private readonly page: Page;
  private readonly loginToSwag: LoginToSwag;

  constructor(page: Page) {
    this.page = page;
    this.loginToSwag = new LoginToSwag(this.page);
  }

  logIn() {
    return this.loginToSwag;
  }
}
