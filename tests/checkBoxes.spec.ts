import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Test Case 1: Validate selected specialties', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Veterinarians').click()
  await page.getByText('all').click()
  expect(page.getByRole('heading', {name: 'Veterinarians'}))

  await page.getByRole('button', {name: "Edit Vet"}).nth(1).click()
  await expect(page.locator('.selected-specialties')).toHaveText('radiology')

  await page.locator('.dropdown-display').click()

  const dropDownDisplay = page.locator('.dropdown-content')

  //Validate checkboxes
  expect(await dropDownDisplay.getByRole('checkbox', {name: 'radiology'}).isChecked()).toBeTruthy()
  expect(await dropDownDisplay.getByRole('checkbox', {name: 'surgery'}).isChecked()).toBeFalsy()
  expect(await dropDownDisplay.getByRole('checkbox', {name: 'dentistry'}).isChecked()).toBeFalsy()

  //select and unselect boxes
  await dropDownDisplay.getByRole('checkbox', {name: 'radiology'}).uncheck()
  await dropDownDisplay.getByRole('checkbox', {name: 'surgery'}).check()
  await expect(page.locator('.selected-specialties')).toHaveText('surgery')

  await dropDownDisplay.getByRole('checkbox', {name: 'dentistry'}).check()
 
  await expect(page.locator('.selected-specialties')).toHaveText(['surgery, dentistry'])
});

test('Test Case 2: Select all specialties', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Veterinarians').click()
  await page.getByText('all').click()
  expect(page.getByRole('heading', {name: 'Veterinarians'}))

  await page.getByRole('button', {name: "Edit Vet"}).nth(3).click()
  await expect(page.locator('.selected-specialties')).toHaveText('surgery')

  await page.locator('.dropdown-display').click()

  const allBoxes = page.getByRole('checkbox')
  
  for(const box of await allBoxes.all()){
    await box.check()
    expect(await box.isChecked()).toBeTruthy()  
  }

  await expect(page.locator('.selected-specialties')).toHaveText(['surgery, radiology, dentistry'])
});

test('Test Case 3: Unselect all specialties', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Veterinarians').click()
  await page.getByText('all').click()
  expect(page.getByRole('heading', {name: 'Veterinarians'}))

  await page.getByRole('button', {name: "Edit Vet"}).nth(2).click()
  await expect(page.locator('.selected-specialties')).toHaveText('dentistry, surgery')

  await page.locator('.dropdown-display').click()

  const allBoxes = page.getByRole('checkbox')
  
  for(const box of await allBoxes.all()){
    await box.uncheck()
    expect(await box.isChecked()).toBeFalsy()  
  }

  await expect(page.locator('.selected-specialties')).toBeEmpty()
});