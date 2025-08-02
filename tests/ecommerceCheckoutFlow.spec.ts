import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  // Login as standard user
  const pm = new PageManager(page);
  await pm.logIn().standardUser();
});

test('Add products to cart', async ({ page }) => {
  // Adding Backpack and T-Shirt to cart

  const backpack = page.locator('.inventory_item', {
    hasText: 'Sauce Labs Backpack',
  });
  const tShirt = page.locator('.inventory_item', {
    hasText: 'Sauce Labs bolt T-Shirt',
  });

  await backpack.getByRole('button').click();
  await tShirt.getByRole('button').click();

  // Opening shoping cart
  await page.locator('.shopping_cart_link').click();

  //Verifying if added items are present

  await expect(
    page.locator('.cart_item', { hasText: 'Backpack' })
  ).toBeVisible();

  await expect(
    page.locator('.cart_item', { hasText: 'T-Shirt' })
  ).toBeVisible();
});

test('Remove items from Cart', async ({ page }) => {
  const pm = new PageManager(page);

  await pm
    .shoppingCart()
    .add2Items('Sauce Labs Backpack', 'Sauce Labs Bike Light'); // I used logic from previous test to create method that will allow to select 2 items based on their names

  await pm.shoppingCart().removeItemsfromCart();

  //Confirm all items were removed

  await expect(page.getByRole('button', { name: 'Remove' })).toBeHidden();
});

test('Verify total price and Checkout', async ({ page }) => {
  const pm = new PageManager(page);

  //I used faker to generate random data
  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName();
  const randomZip = faker.location.zipCode();

  await pm
    .shoppingCart()
    .add2Items('Sauce Labs Backpack', 'Sauce Labs Bike Light');

  // Summing up prices of cart items
  const totalPrice = await pm.shoppingCart().sumUpPrices();

  //Click on Checkout button
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(
    page.locator('.title', { hasText: 'Checkout: Your Information' })
  ).toBeVisible();

  // Filling Your Information page
  await page.getByPlaceholder('First Name').fill(`${randomFirstName}`);
  await page.getByPlaceholder('Last Name').fill(`${randomLastName}`);
  await page.getByPlaceholder('Zip/Postal Code').fill(`${randomZip}`);

  //Going to  Overview
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(
    page.locator('.title', { hasText: 'Checkout: Overview' })
  ).toBeVisible();

  // Comparing total item price with value of items price from cart
  const priceTotalString = await page
    .locator('.summary_subtotal_label')
    .textContent();

  const priceTotalNumber = parseFloat(priceTotalString?.slice(13) || '');

  expect(priceTotalNumber == totalPrice);
});
