import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
  const pm = new PageManager(page)

  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await pm.navigateTo().veterinariansPage()
})

test('Test Case 1: Validate selected specialties', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onVeterinariansPage().selectAVeterinarianToEdit('Helen Leary')
  await expect(page.locator('.selected-specialties')).toHaveText('radiology')
  
  await page.locator('.dropdown-display').click()

  //Validate checkboxes
  expect(await page.getByRole('checkbox', {name: 'radiology'}).isChecked()).toBeTruthy()
  expect(await page.getByRole('checkbox', {name: 'surgery'}).isChecked()).toBeFalsy()
  expect(await page.getByRole('checkbox', {name: 'dentistry'}).isChecked()).toBeFalsy()

  //select and unselect boxes
  await page.getByRole('checkbox', {name: 'radiology'}).uncheck()
  await page.getByRole('checkbox', {name: 'Surgery'}).check()
  await expect(page.locator('.selected-specialties')).toHaveText('Surgery')

  await page.getByRole('checkbox', {name: 'dentistry'}).check()
 
  await expect(page.locator('.selected-specialties')).toHaveText(['Surgery, dentistry'])
});

test('Test Case 2: Select all specialties', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onVeterinariansPage().selectAVeterinarianToEdit('Rafael Ortega')
  await expect(page.locator('.selected-specialties')).toHaveText('Surgery')

  await page.locator('.dropdown-display').click()

  await pm.onVeterinariansPage().checkAllBoxes()

  await expect(page.locator('.selected-specialties')).toHaveText(['Surgery, radiology, dentistry'])
});

test('Test Case 3: Unselect all specialties', async ({page}) => {
  const pm = new PageManager(page)
  
  await pm.onVeterinariansPage().selectAVeterinarianToEdit('Linda Douglas')

  await expect(page.locator('.selected-specialties')).toHaveText('dentistry, Surgery')
  await page.locator('.dropdown-display').click()

  await pm.onVeterinariansPage().unCheckAllBoxes()

  await expect(page.locator('.selected-specialties')).toBeEmpty()
});