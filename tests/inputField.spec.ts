import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Test Case 1: Update pet type', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Pet Type').click()

  //Checks page is on pet types
  const petTypeTitle = page.locator('app-pettype-list').getByText('Pet Types')
  await expect(petTypeTitle).toHaveText('Pet Types')

  //click first edit button and checks we're on edit page
  await page.getByRole('button', {name: "edit"}).nth(0).click()
  const editTitle = await page.getByText('Edit Pet Type')
  await expect(editTitle).toHaveText('Edit Pet Type')
  
  //This should select the textbox and fill it with rabbit then update
  const edittextField = page.locator('#name')
  await edittextField.click()
  await edittextField.clear()
  await edittextField.fill('rabbit')
  await page.getByRole('button', {name: "update"}).click()


  //retrieve value of first row and verify
  await expect(petTypeTitle).toHaveText('Pet Types')
  const firstPet = await page.locator('[id="0"]').inputValue()
  expect(firstPet).toEqual('rabbit')

  await page.getByRole('button', {name: "edit"}).first().click()
  await edittextField.click()
  await edittextField.clear()
  await edittextField.fill('cat')
  await page.getByRole('button', {name: "update"}).click()

  await expect(petTypeTitle).toHaveText('Pet Types')
  const secondPet = await page.locator('[id="0"]').inputValue()
  expect(secondPet).toEqual('cat')
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Pet Type').click()
  
  //Checks page is on pet types
  const petTypeTitle = page.locator('app-pettype-list').getByText('Pet Types')
  await expect(petTypeTitle).toHaveText('Pet Types')

  //select 2nd row
  await page.getByRole('button', {name: "Edit"}).nth(1).click()
  const editTitle = await page.getByText('Edit Pet Type')
  await expect(editTitle).toHaveText('Edit Pet Type')

  //enter moose but cancel cange
  const edittextField = page.locator('#name')
  await edittextField.click()
  await edittextField.clear()
  await edittextField.fill('moose')
  const mooseChecker = await edittextField.inputValue()
  expect(mooseChecker).toEqual('moose')
  page.getByRole('button', {name: "cancel"}).click()
 
  //ensure dog is still dog
  await expect(petTypeTitle).toHaveText('Pet Types')
  const firstPet = await page.locator('[id="1"]').inputValue()
  expect(firstPet).toEqual('dog')
  });

  test('Test Case 3: Pet type name is required validation', async ({page}) => {
    await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
    await page.getByText('Pet Type').click()
    
    //Checks page is on pet types
    const petTypeTitle = page.locator('app-pettype-list').getByText('Pet Types')
    await expect(petTypeTitle).toHaveText('Pet Types')
  
    //select 2nd row
    await page.getByRole('button', {name: "Edit"}).nth(2).click()
    const editTitle = await page.getByText('Edit Pet Type')
    await expect(editTitle).toHaveText('Edit Pet Type')

    //check to see validation occurs
    const edittextField = page.locator('#name')
    await edittextField.click()
    await edittextField.clear()
    const validation = page.locator('app-pettype-edit').getByText('Name is required')
    await expect(validation).toHaveText('Name is required')
    await page.getByRole('button', {name: "update"}).click()
    await expect(editTitle).toHaveText('Edit Pet Type')
    await page.getByRole('button', {name: "cancel"}).click()

    await expect(petTypeTitle).toHaveText('Pet Types')
  });