import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().openHomePage()
  await pm.navigateTo().ownersPage()
});

test("Test Case 1: Validate selected pet types from the list", async ({page}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('George Franklin')

  await pm.onOwnerInformationPage().clickEditPetButtonForPet('Leo')

  // This checks owner and name inside type
  await pm.onPetDetailsPage().validateOwnerNameAndFollowingPetInEditPetPage('George Franklin', 'cat')

  //list of options
  await pm.onPetDetailsPage().validateListOfPetTypesCanBeSelectedAndAppearInTypeField()

});

test("Test Case 2: Validate the pet type update", async ({ page }) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('Eduardo Rodriquez')
  await pm.onOwnerInformationPage().clickEditPetButtonForPet('Rosy')

  await pm.onPetDetailsPage().validatePetNameAndPetTypeInEditPetPage('Rosy', 'dog')
  
  await pm.onPetDetailsPage().selectPetTypeAndVerifyVisibleInTypeField('bird')
  await pm.onPetDetailsPage().selectAButtonNamed('Update Pet')
  //not sure how to make this a reusable method
  await pm.onOwnerInformationPage().validatePetTypeForPet('Rosy', 'bird')
  await pm.onOwnerInformationPage().clickEditPetButtonForPet('Rosy')
  await pm.onPetDetailsPage().validatePetNameAndPetTypeInEditPetPage('Rosy', 'bird')

  await pm.onPetDetailsPage().selectPetTypeAndVerifyVisibleInTypeField('dog')
  await pm.onPetDetailsPage().selectAButtonNamed('Update Pet')
});
