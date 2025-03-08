import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';


test.beforeEach( async({page}) => {
  const pm = new PageManager(page)

  await page.goto('/')
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await pm.navigateTo().petTypesPage()
  expect(page.getByRole('heading')).toHaveText('Pet Types')
})

test('Test Case 1: Update pet types', async ({page}) => {
  const pm = new PageManager(page)

  const selectUpdateButton = page.getByRole('button', {name: "update"})

  //click first edit button and checks we're on edit page
  await pm.onPetTypePage().selectPetTypeEditButton('cat')

  //This should select the textbox and fill it with rabbit then update
  await pm.onPetTypePage().setPetInputName('rabbit')
  await selectUpdateButton.click()

  //retrieve value of first row and verify
  await expect(page.getByRole('heading')).toHaveText('Pet Types')
  await expect(page.getByRole('row').nth(1).locator('input')).toHaveValue('rabbit')

  await pm.onPetTypePage().selectPetTypeEditButton('rabbit')
  await pm.onPetTypePage().setPetInputName('cat')
  await selectUpdateButton.click()

  await expect(page.getByRole('heading')).toHaveText('Pet Types')
  await expect(page.getByRole('row').nth(1).locator('input')).toHaveValue('cat')
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
  const pm = new PageManager(page)

  //select 2nd row
  await pm.onPetTypePage().selectPetTypeEditButton('dog')

  //enter moose but cancel cange
  await pm.onPetTypePage().setPetInputName('moose')
  await expect(page.locator('#name')).toHaveValue('moose')
  await page.getByRole('button', {name: "cancel"}).click()
 
  //ensure dog is still dog
  await expect(page.getByRole('heading')).toHaveText('Pet Types')
  await expect(page.getByRole('row').nth(2).locator('input')).toHaveValue('dog')
  });

  test('Test Case 3: Pet type name is required validation', async ({page}) => { 
    const pm = new PageManager(page) 

    //select 2nd row
    await pm.onPetTypePage().selectPetTypeEditButton('lizard')
    //check to see validation occurs
    await pm.onPetTypePage().setPetInputName('')
    await expect(page.locator('.help-block')).toHaveText('Name is required')

    await page.getByRole('button', {name: "update"}).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')

    await page.getByRole('button', {name: "cancel"}).click()
    await expect(page.getByRole('heading')).toHaveText('Pet Types')
  });