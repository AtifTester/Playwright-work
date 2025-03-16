import { test, expect } from "@playwright/test";
import { text } from "stream/consumers";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().openHomePage()
  await pm.navigateTo().ownersPage()
});


test("Test Case 1: Select the desired date in the calendar", async ({page}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('Harold Davis')
  await pm.onOwnerInformationPage().selectAButtonNamed('Add new pet')

  await pm.onPetDetailsPage().addNameToInputAndValidateTextIconChange('Tom')
  await pm.onPetDetailsPage().pickASpecificDateAndValidateDoBField('2014', 'May', '2', '2014/05/02')
  await pm.onPetDetailsPage().selectAPetTypeAndSave('dog')

  await pm.onOwnerInformationPage().validatePetHasNewInfoInOwnerPage('Tom')

  await pm.onOwnerInformationPage().deleteAPetFromOwnerPageAndVerifyItNoLongerExists('Tom')
});

test("Test Case 2: Select the dates of visits and validate dates order", async ({page}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('Jean Coleman')

  await pm.onOwnerInformationPage().clickAddNewVisitButtonForPet('Samantha')

  await pm.onPetDetailsPage().validatePetNewVisitPetNameAndOwner('Samantha', 'Jean Coleman')
  
  await pm.onPetDetailsPage().selectDateFromCalenderDaysAgo(0)
  await pm.onPetDetailsPage().validateCurrentDatePopulatedInPetDetailsDoBField()

  await pm.onPetDetailsPage().addDescriptionForNewVisitPetDetail('dermatologists visit')
  await pm.onPetDetailsPage().selectAButtonNamed('Add Visit')

  await pm.onOwnerInformationPage().verifyCurrentDateNewVisitForPetName('Samantha')

  await pm.onOwnerInformationPage().clickAddNewVisitButtonForPet('Samantha')
  
  await pm.onPetDetailsPage().selectDateFromCalenderDaysAgo(45)
  await pm.onPetDetailsPage().addDescriptionForNewVisitPetDetail('Massage Therapy')
  await pm.onPetDetailsPage().selectAButtonNamed('Add Visit')

  await pm.onOwnerInformationPage().validateMostRecentDateIsTopOfVisitListToBeTrueForPet('Samantha')

  await pm.onOwnerInformationPage().deleteLatestVisitorForPet('Samantha')
  await pm.onOwnerInformationPage().deleteLatestVisitorForPet('Samantha')

  await pm.onOwnerInformationPage().validateNewVisitNoLongerExistsForPetNameWithDescription('Samantha', 'dermatologists visit')
  await pm.onOwnerInformationPage().validateNewVisitNoLongerExistsForPetNameWithDescription('Samantha', 'Massage Therapy')
});
