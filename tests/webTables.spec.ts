import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { SpecialtiesPage } from "../page-objects/specialtiesPage";
import { text } from "stream/consumers";
import { PageManager } from "../page-objects/pageManager";

test.describe("Owner focused test cases", () => {
  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().runBeforeAllTestsToLoadClinicAndVerifyHomePage()
    await pm.navigateTo().ownersPage()
  });

  test("Test Case 1: Validate the pet name city of the owner", async ({page}) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().validateOwnersCityAndPets('Jeff Black', 'Monona', 'Lucky')
  });

  test("Test Case 2: Validate owners count of the Madison city", async ({page}) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().validateNumberOfSameCities(4, 'Madison')
  });

  test("Test Case 3: Validate search by Last Name", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onOwnersPage().listOfOwnerSurnameToAppearWhenSearched(['Black', 'Davis', 'Es', 'Playwright'])

  });

  test("Test Case 4: Validate phone number and pet name on the Owner Information page", async ({page}) => {
    const pm = new PageManager(page)

    await pm.onOwnersPage().clickOwnerBasedOffNumberAndToVerifySameOwnerInfoPetNameAndNumber('6085552765')
  });

  test("Test Case 5: Validate pets of the Madison city", async ({ page }) => {

    const pm = new PageManager(page)
    await pm.onOwnersPage().verifyCityContainsFollowingPets('Madison', ['Leo', 'George', 'Mulligan', 'Freddy'])

  });
});

test("Test Case 6: Validate specialty update", async ({ page }) => {
  const pm = new PageManager(page)

  await pm.navigateTo().runBeforeAllTestsToLoadClinicAndVerifyHomePage()
  await pm.navigateTo().veterinariansPage()

  //checks table, unique row rafael, and checks for surgery
  await pm.onVeterinariansPage().validateVeterinarianToHaveSpecialty('Rafael Ortega', 'surgery')

  await pm.navigateTo().specialtiesPage()
  await pm.onSpecialtiesPage().clickEditButtonForSpecialty('surgery')
  await pm.onSpecialtiesPage().inputTextInSpecialtyFieldAndUpdate('dermatology')

  await pm.onSpecialtiesPage().validateChosenRowHasSpeciality(1, 'dermatology')

  await pm.navigateTo().veterinariansPage()
  await pm.onVeterinariansPage().validateVeterinarianToHaveSpecialty('Rafael Ortega', 'dermatology')

  //Repeat steps to revert change
  await pm.navigateTo().specialtiesPage()
  await pm.onSpecialtiesPage().clickEditButtonForSpecialty('dermatology')
  await pm.onSpecialtiesPage().inputTextInSpecialtyFieldAndUpdate('surgery')
});

test("Test Case 7: Validate specialty lists", async ({ page }) => {
  const pm = new PageManager(page)

  await pm.navigateTo().runBeforeAllTestsToLoadClinicAndVerifyHomePage()
  
  await pm.navigateTo().specialtiesPage()

  await pm.onSpecialtiesPage().addASpecialtieRowAndSave('oncology')

  await pm.onSpecialtiesPage().compareSpecialityRowDataToVetenerianSpecialtyDataForVetenarian('Sharon Jenkins')

  await pm.onSpecialtiesPage().checkASpecialtyForVetenarianAndSave('oncology')

  await pm.onVeterinariansPage().validateVeterinarianToHaveSpecialty('Sharon Jenkins', 'oncology')

  await pm.navigateTo().specialtiesPage()

  await pm.onSpecialtiesPage().deleteASpecialityByName('oncology')

  await pm.navigateTo().veterinariansPage()

  await pm.onVeterinariansPage().validateVetenerianToHaveNoSpeciality('Sharon Jenkins')
});
