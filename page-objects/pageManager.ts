import { Page } from '@playwright/test';
import { LoginToSwag } from '../page-objects/loginToSwag';
import { CreateCart } from './createCart';
import { MoviesDetails } from './moviesDetails';

export class PageManager {
  private readonly page: Page;
  private readonly loginToSwag: LoginToSwag;
  private readonly createCart: CreateCart;
  private readonly moviesDetails: MoviesDetails;

  constructor(page: Page) {
    this.page = page;
    this.loginToSwag = new LoginToSwag(this.page);
    this.createCart = new CreateCart(this.page);
    this.moviesDetails = new MoviesDetails(this.page);
  }

  logIn() {
    return this.loginToSwag;
  }

  shoppingCart() {
    return this.createCart;
  }

  movies() {
    return this.moviesDetails;
  }
}
