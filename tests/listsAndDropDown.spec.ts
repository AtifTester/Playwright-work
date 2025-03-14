import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().runBeforeAllTestsToLoadClinicAndVerifyHomePage()
  await pm.navigateTo().ownersPage()
});

test("Test Case 1: Validate selected pet types from the list", async ({page}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('George Franklin')

  await pm.onOwnerInformationPage().clickEditPetButtonForPet('Leo')

  // This checks owner and name inside type
  await pm.onPetDetailsPage().validateOwnerNameAndFollowingPetInEditPetPage('George Franklin', 'cat')

  //list of options
  await pm.onPetDetailsPage().checkThroughListOfPetsInTypeList()

});

test("Test Case 2: Validate the pet type update", async ({ page }) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('Eduardo Rodriquez')
  await pm.onOwnerInformationPage().clickEditPetButtonForPet('Rosy')

  await pm.onPetDetailsPage().validatePetNameAndPetTypeInEditPetPage('Rosy', 'dog')
  
  await pm.onPetDetailsPage().selectPetTypeAndVerify('bird')
  await pm.onPetDetailsPage().petDetailsPageButtonSelector('Update Pet')
  //not sure how to make this a reusable method
  await expect(page.locator("app-pet-list", { hasText: "Rosy" }).locator("dd").nth(2)).toHaveText("bird");

  await pm.onOwnerInformationPage().clickEditPetButtonForPet('Rosy')
  await pm.onPetDetailsPage().validatePetNameAndPetTypeInEditPetPage('Rosy', 'bird')

  await pm.onPetDetailsPage().selectPetTypeAndVerify('dog')
  await pm.onPetDetailsPage().petDetailsPageButtonSelector('Update Pet')
});
