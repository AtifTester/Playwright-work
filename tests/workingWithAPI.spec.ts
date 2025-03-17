import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import ownersAPI from '../testData/ownersAPI.json'
import ownerInfoAPI from '../testData/ownerInfoAPI.json'


test.beforeEach(async({page}) => {
  const pm = new PageManager(page)

    await page.route('*/**/api/owners', async route => {
    await route.fulfill({body: JSON.stringify(ownersAPI)
    });
  })

  await page.route('*/**/api/owners/777', async route => {
    await route.fulfill({body: JSON.stringify(ownerInfoAPI)
    });
  })

  await pm.navigateTo().openHomePage()
  await pm.navigateTo().ownersPage()
})

test('Test Case 1: mocking API request', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().validateNumberOfRowsInOwnerPage(2)
  await pm.onOwnersPage().selectOwnerBasedOffName('Bell Crane')
  await pm.onOwnerInformationPage().validateOwnerInformationIsCorrect('Bell Crane','110 W. Liberty St.','Madison','6085551023')
  await pm.onOwnerInformationPage().validateNumberOfPets(2)
  await pm.onOwnerInformationPage().validateNumberOfVisitsForPet('Leo', 10)
})