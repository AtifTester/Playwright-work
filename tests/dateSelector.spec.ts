import { test, expect } from "@playwright/test";
import { text } from "stream/consumers";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().runBeforeAllTestsToLoadClinicAndVerifyHomePage()
  await pm.navigateTo().ownersPage()
});


test("Test Case 1: Select the desired date in the calendar", async ({page}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('Harold Davis')
  await pm.onOwnersPage().ownerPageButtonSelector('Add new pet')

  await pm.onOwnerInformationPage().addNameToInputAndValidateTextIconChange('Tom')
  await pm.onOwnerInformationPage().pickASpecificDateAndValidateDoBField('2014', 'May', '2', '2014/05/02')
  await pm.onOwnerInformationPage().selectAPetTypeAndSave('dog')

  await pm.onOwnersPage().validatePetHasNewInfoInOwnerPage('Tom')

  await pm.onOwnersPage().deleteAPetFromOwnerPageAndVerifyItNoLongerExists('Tom')
});

test("Test Case 2: Select the dates of visits and validate dates order", async ({
  page,
}) => {
  const pm = new PageManager(page)

  await pm.onOwnersPage().selectOwnerBasedOffName('Jean Coleman')

  await pm.onOwnerInformationPage().clickAddNewVisitorButtonForPet('Samantha')

  await pm.onPetDetailsPage().validatePetNewVisitPetNameAndOwner('Samantha', 'Jean Coleman')
  
  await pm.onPetDetailsPage().selectDateFromCalenderDaysAgo(0)
  await pm.onPetDetailsPage().validateCurrentDatePopulatedInPetDetailsDoBField()

  await pm.onPetDetailsPage().addDescriptionForNewVisitPetDetail('dermatologists visit')
  await pm.onPetDetailsPage().petDetailsPageButtonSelector('Add Visit')

  await pm.onPetDetailsPage().verifyCurrentDateNewVisitForPetName('Samantha')

  await pm.onOwnerInformationPage().clickAddNewVisitorButtonForPet('Samantha')
  
  await pm.onPetDetailsPage().selectDateFromCalenderDaysAgo(45)
  await pm.onPetDetailsPage().addDescriptionForNewVisitPetDetail('Massage Therapy')
  await pm.onPetDetailsPage().petDetailsPageButtonSelector('Add Visit')

  await pm.onPetDetailsPage().validateMostRecentDateIsTopOfVisitListToBeTrueForPet('Samantha')

  await pm.onPetDetailsPage().deleteLatestVisitorForPet('Samantha')
  await pm.onPetDetailsPage().deleteLatestVisitorForPet('Samantha')

  await pm.onPetDetailsPage().validateNewVisitNoLongerExistsForPetNameWithDescription('Samantha', 'dermatologists visit')
  await pm.onPetDetailsPage().validateNewVisitNoLongerExistsForPetNameWithDescription('Samantha', 'Massage Therapy')
});
