import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.rottentomatoes.com/');
  await page.getByRole('button', { name: 'Reject All' }).click();
});

test('Search by title', async ({ page }) => {
  const pm = new PageManager(page);

  //Searching movies by names
  await pm.movies().searchByTitle('shawshank');

  await expect(
    page.locator('rt-text[slot="title"][context="heading"]')
  ).toContainText('The Shawshank Redemption');

  await page.waitForTimeout(500);

  await pm.movies().searchByTitle('home alone');

  await expect(
    page.locator('rt-text[slot="title"][context="heading"]')
  ).toContainText('Home Alone');
});

test('Search by filtering', async ({ page }) => {
  const pm = new PageManager(page);

  //Searching movies by category
  await page.locator('[data-qa="masthead:movies-dvds-link"]').click();

  //Scrolling down to avoid hiding popup
  await page.mouse.wheel(0, 100);

  await page.locator('.footer__copyright-legal').nth(1).click();

  expect(page.isHidden('.header-wrap')).toBeTruthy();

  //Selecting movies by genre and rating
  await pm
    .movies()
    .searchByfilters('genre', 'Action Comedy Crime', 'rating', 'PG R', true);

  expect(
    await page.locator('empty-state h2', { hasText: 'No results' }).isVisible()
  ).toBeFalsy();

  await page.goto('https://www.rottentomatoes.com/');

  await page.locator('[data-qa="masthead:movies-dvds-link"]').click();

  await page.mouse.wheel(0, 100);

  await page.locator('.footer__copyright-legal').nth(1).click();

  await pm
    .movies()
    .searchByfilters('genre', 'Holiday News', 'rating', 'NC-17', false);

  await page.mouse.wheel(0, -200);

  const noResuts = await page
    .locator('empty-state h2', { hasText: 'No results' })
    .isVisible();

  expect(noResuts == true);
});
