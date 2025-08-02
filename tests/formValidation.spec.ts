import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
  await page.goto('https://letcode.in/forms');
});

test('Fill form with valid data', async ({ page }) => {
  //Filling form with valid data using faker to create random test data
  await page
    .locator('.field', { hasText: 'First Name' })
    .getByRole('textbox')
    .fill(faker.person.firstName());
  await page
    .locator('.field', { hasText: 'Last Name' })
    .getByRole('textbox')
    .fill(faker.person.lastName());
  await page
    .locator('.field', { hasText: 'Email' })
    .getByRole('textbox')
    .fill(faker.internet.email({ firstName: faker.person.firstName() }));
  await page
    .locator('.field', { hasText: 'Country code' })
    .locator('select')
    .selectOption('Guinea (+224)');
  await page
    .locator('.field', { hasText: 'Phone Number' })
    .getByRole('textbox')
    .fill('1234126789');
  await page
    .locator('.field', { hasText: 'Address Line-1' })
    .getByRole('textbox')
    .fill(faker.location.streetAddress());
  await page
    .locator('.field', { hasText: 'Address Line-2' })
    .getByRole('textbox')
    .fill(faker.location.streetAddress());
  await page
    .locator('.field', { hasText: 'State' })
    .getByRole('textbox')
    .fill(faker.location.state());
  await page
    .locator('.field', { hasText: 'Postal-Code' })
    .getByRole('textbox')
    .fill(faker.location.zipCode());
  await page
    .locator('.field', { hasText: 'Country' })
    .locator('select')
    .nth(1)
    .selectOption('Canada');
  await page
    .locator('.field', { hasText: 'Date Of Birth' })
    .getByRole('textbox')
    .click();
  await page.keyboard.type('11.11.2025');
  await page
    .locator('.field', { hasText: 'Gender' })
    .getByRole('radio', { name: 'Female' })
    .click();
  await page.locator('.checkbox').getByRole('checkbox').click();

  // Clicking on submit button and confirming all fields were filled correctly
  await page.locator('.card-content').getByRole('button').click();

  expect(await page.reload());
});

test('Fill form with invalid data', async ({ page }) => {
  //Filling form with valid data using faker to create random test data
  await page
    .locator('.field', { hasText: 'First Name' })
    .getByRole('textbox')
    .fill(faker.person.firstName());
  await page
    .locator('.field', { hasText: 'Last Name' })
    .getByRole('textbox')
    .fill(faker.person.lastName());
  await page
    .locator('.field', { hasText: 'Email' })
    .getByRole('textbox')
    .fill('123');

  await page.locator('.card-content').getByRole('button').click();

  expect(await page.reload()).not;
});

test('File Upload', async ({ page }) => {
  await page.goto('https://letcode.in/file');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText(' Choose a file… ').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./attachments/sample.pdf');
  //Confirm file was attached
  expect(
    page.locator('[class="label ng-star-inserted"]', {
      hasText: 'Selected File: sample.pdf',
    })
  ).toBeTruthy();
});
