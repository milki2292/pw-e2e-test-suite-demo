import { test, expect, request } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByText('Sign in').click();
  await page.getByRole('textbox', { name: 'Email' }).fill('kstest99@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('welcome123');
  await page.getByRole('button').click();
});

test('Modifying API Response', async ({ page }) => {
  //Interception of API call
  await page.route(
    'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
    async (route) => {
      //Complete API call and get response
      const response = await route.fetch();
      const responseBody = await response.json();
      //Update the response
      responseBody.articles[0].title = 'Modified title';
      responseBody.articles[0].description = 'Modified description';
      //Fulfull the response
      await route.fulfill({
        body: JSON.stringify(responseBody),
      });
    }
  );

  await expect(page.locator('app-article-list h1').first()).toContainText(
    'Modified title'
  );
  await expect(page.locator('app-article-list p').first()).toContainText(
    'Modified description'
  );
});

test('Create an article using API call and delete it', async ({
  page,
  request,
}) => {
  // Perform API Requests

  const response = await request.post(
    'https://conduit-api.bondaracademy.com/api/users/login',
    {
      data: {
        user: { email: 'kstest99@test.com', password: 'welcome123' },
      },
    }
  );

  const responseBody = await response.json();
  const accessToken = responseBody.user.token;

  //Creating article using API POST request
  const articleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles/',
    {
      //Request with authorization

      data: {
        article: {
          title: 'Title of article created using POST',
          description: 'Description of article created using POST',
          body: 'Body of article created using POST',
          tagList: ['tag1', 'tag2'],
        },
      },
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  //Status assertion
  expect(articleResponse.status()).toEqual(201);

  //Article deletion
  await page.getByText('Global Feed').click();
  await page.getByText('Title of article created using POST').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();

  await expect(page.locator('app-article-list h1').first()).not.toContainText(
    'Title of article created using POST'
  );
});
