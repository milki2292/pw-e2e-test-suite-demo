import { test, expect } from '@playwright/test';

//this test is run only on mobile device and it is defined in playwright.config.ts file

test.beforeEach(async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');
});

test('Add/delete todo items', async ({ page }) => {
  //Adding options
  await page.getByRole('textbox').fill('1st option');
  await page.keyboard.press('Enter');
  await page.getByRole('textbox').fill('2nd option');
  await page.keyboard.press('Enter');

  //Checking if 2 options were added
  expect(
    ((await page.getByRole('list').getByRole('checkbox').all()).length = 2)
  ).toBeTruthy;

  //Completing 1st option
  await page.getByRole('list').getByRole('checkbox').first().click();
  //Going to Active section
  await page.getByRole('link', { name: 'Active' }).click();
  //Checking if only 2nd option is visible
  expect(await page.locator('li label', { hasText: '2nd option' }).isVisible());
  expect(await page.locator('li label', { hasText: '1st option' }).isHidden());
  //Going to Completed section
  await page.getByRole('link', { name: 'Completed' }).click();
  //Checking if 1st option is visible
  expect(await page.locator('li label', { hasText: '1st option' }).isVisible());
  //Clearing completed items
  await page.getByRole('button', { name: 'Clear completed' }).click();
  //Going back to all items
  await page.getByRole('link', { name: 'All' }).click();
  //Chcecking if only 1 item left
  expect(
    ((await page.getByRole('list').getByRole('checkbox').all()).length = 1)
  ).toBeTruthy;
});
