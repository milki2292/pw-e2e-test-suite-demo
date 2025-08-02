import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { LoginToSwag } from '../page-objects/loginToSwag'; // importing LoginToSwag class

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
});

test('Login User with correct email and password', async ({ page }) => {
  // const pm = new PageManager(page); - It is possible to use page manager class
  // await pm.logIn().standardUser();

  const logIn = new LoginToSwag(page); // Creating new instance of LoginToSwag
  await logIn.standardUser(); // Using method from LoginToSwag class

  await expect(page.locator('#contents_wrapper')).toBeVisible(); //User is logged in and articles section is visible
});

test('Login User with incorrect email and password', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('standard_user123');
  await page.getByPlaceholder('Password').fill('secret_sauce123');
  await page.getByRole('button').click();

  await expect(
    page.getByRole('heading', { name: 'Epic sadface' })
  ).toBeVisible(); // Error message is visible and user is not logged in
});

test('Logout User', async ({ page }) => {
  const logIn = new LoginToSwag(page);
  await logIn.standardUser();
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();

  const loginSite = page.locator('.login_container'); // Assiging locator to a variable

  await expect(loginSite).toBeVisible(); // Login site is visible, user is logged out
});

test('Locked-out user scenario', async ({ page }) => {
  const pm = new PageManager(page);
  await pm.logIn().lockedUser(); // Login as locked user with usage of page manager

  await expect(
    page.locator(
      'div h3:text("Epic sadface: Sorry, this user has been locked out.")'
    )
  ).toBeVisible();
});
