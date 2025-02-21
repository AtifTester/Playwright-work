import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Test Case 1: Update pet types', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Pet Types').click()

  //Checks page is on pet types
  expect(page.getByRole('heading')).toHaveText('Pet Types')

  //click first edit button and checks we're on edit page
  await page.getByRole('button', {name: "edit"}).nth(0).click()
  expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
  
  //This should select the textbox and fill it with rabbit then update
  const petTypeNameInputField = page.locator('#name')
  await petTypeNameInputField.click()
  await petTypeNameInputField.clear()
  await petTypeNameInputField.fill('rabbit')
  await page.getByRole('button', {name: "update"}).click()

  //retrieve value of first row and verify
  await expect(page.getByRole('heading')).toHaveText('Pet Types')
  expect(page.locator('[id="0"]')).toHaveValue('rabbit')

  await page.getByRole('button', {name: "edit"}).nth(0).click()
  await petTypeNameInputField.click()
  await petTypeNameInputField.clear()
  await petTypeNameInputField.fill('cat')
  await page.getByRole('button', {name: "update"}).click()

  expect(page.getByRole('heading')).toHaveText('Pet Types')
  await expect(page.locator('[id="0"]')).toHaveValue('cat')
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Pet Type').click()
  
  //Checks page is on pet types
  expect(page.getByRole('heading')).toHaveText('Pet Types')

  //select 2nd row
  await page.getByRole('button', {name: "Edit"}).nth(1).click()
  await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')

  //enter moose but cancel cange
  const petTypeNameInputField = page.locator('#name')
  await petTypeNameInputField.click()
  await petTypeNameInputField.clear()
  await petTypeNameInputField.fill('moose')
  expect(petTypeNameInputField).toHaveValue('moose')
  await page.getByRole('button', {name: "cancel"}).click()
 
  //ensure dog is still dog
  expect(page.getByRole('heading')).toHaveText('Pet Types')
  await expect(page.locator('[id="1"]')).toHaveValue('dog')
  });

  test('Test Case 3: Pet type name is required validation', async ({page}) => {
    await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
    await page.getByText('Pet Type').click()
    
    //Checks page is on pet types
    expect(page.getByRole('heading')).toHaveText('Pet Types')
  
    //select 2nd row
    await page.getByRole('button', {name: "Edit"}).nth(2).click()
    expect(page.getByRole('heading')).toHaveText('Edit Pet Type')

    //check to see validation occurs
    const petTypeNameInputField = page.locator('#name')
    await petTypeNameInputField.click()
    await petTypeNameInputField.clear()

    await expect(page.locator('.help-block')).toHaveText('Name is required')

    await page.getByRole('button', {name: "update"}).click()
    expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
    await page.getByRole('button', {name: "cancel"}).click()

    await expect(page.getByRole('heading')).toHaveText('Pet Types')
  });