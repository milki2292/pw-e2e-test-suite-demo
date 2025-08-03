import { expect, Page } from '@playwright/test';

export class MoviesDetails {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async searchByTitle(title: string) {
    await this.page.getByRole('textbox').fill(`${title}`);
    await this.page
      .locator('rt-text', { hasText: `${title}` })
      .first()
      .click();
  }

  // searchByfilters method description:
  /**
   *
   * @param filter1 - Choose 1st filter you want to use
   * @param options1 - String with values you want to select separated with " " - names of options with 1st Uppercase letter
   * @param filter2 - Choose 2nd filter you want to use
   * @param options2 - String with values you want to select separated with " " - exact names of options
   * @param filterFresh - boolean - pass true if you want to select CERTIFIED FRESH filter
   */

  async searchByfilters(
    filter1: string,
    options1: string,
    filter2: string,
    options2: string,
    filterFresh: boolean
  ) {
    await this.page
      .locator('[class="label label--small upper"]', { hasText: `${filter1}` })
      .click();
    //Creating list of options to be selected
    const listOfOptions1 = options1.split(' ');

    //Selecting options
    for (let option1 of listOfOptions1) {
      await this.page.locator(`select-label :text-is("${option1}")`).click();
      await expect(
        this.page
          .locator('select-label', { hasText: `${option1}` })
          .getByRole('checkbox')
      ).toBeTruthy();
    }

    //Applying filter
    await this.page.getByRole('button', { name: 'Apply' }).click();

    await this.page
      .locator('[class="label label--small upper"]', { hasText: `${filter2}` })
      .click();

    const listOfOptions2 = options2.split(' ');

    for (let option2 of listOfOptions2) {
      await this.page.locator(`select-label :text-is("${option2}")`).click();
      await expect(
        this.page
          .locator('select-label', { hasText: `${option2}` })
          .getByRole('checkbox')
      ).toBeTruthy();
    }

    await this.page.getByRole('button', { name: 'Apply' }).click();

    if (filterFresh) {
      await this.page
        .locator(
          '.discovery-filters filter-chip [class="label label--small upper"]',
          { hasText: 'Certified Fresh' }
        )
        .click();
    }
  }
}
