import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/PageManager";

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page)
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  
  await pm.navigateTo().ownersPage()
});

test("Test Case 1: Validate selected pet types from the list", async ({
  page,
}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwner('George Franklin')

  //store variable of type field
  const typeField = page.locator("#type1");
  //store variable of dropdown
  const dropDownField = page.locator("#type");

  await pm.onOwnerInformationPage().selectEditPetNameToEdit('Leo')

  // This checks owner and name inside type
  await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
  await expect(typeField).toHaveValue("cat");

  //list of options
  const listOfOptions = ["cat", "dog", "lizard", "snake", "bird", "hamster"];

  for (const currentOption of listOfOptions) {
    dropDownField.selectOption(currentOption);
    await expect(typeField).toHaveValue(currentOption);
  }
});

test("Test Case 2: Validate the pet type update", async ({ page }) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwner('Eduardo Rodriquez')
  await pm.onOwnerInformationPage().selectEditPetNameToEdit('Rosy')

  const typeField = page.locator("#type1");

  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(typeField).toHaveValue("dog");

  await pm.onPetDetailsPage().selectPetTypeAndVerify('bird')
  await page.getByRole("button", { name: "Update Pet" }).click();

  await expect(
    page.locator("app-pet-list", { hasText: "Rosy" }).locator("dd").nth(2)).toHaveText("bird");

  await pm.onOwnerInformationPage().selectEditPetNameToEdit('Rosy')

  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(typeField).toHaveValue("bird");

  await pm.onPetDetailsPage().selectPetTypeAndVerify('dog')
  await page.getByRole("button", { name: "Update Pet" }).click();
});
