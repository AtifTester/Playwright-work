import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach( async({page}) => {
  const pm = new PageManager(page)

  await pm.navigateTo().runBeforeAllTestsToLoadClinicAndVerifyHomePage()
  await pm.navigateTo().veterinariansPage()
})

test('Test Case 1: Validate selected specialties', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onVeterinariansPage().clickEditVetButtonForVeterinarian('Helen Leary')
  await pm.onVeterinariansPage().validateEditVeterinarianToHaveSpecialty('radiology')
  await pm.onVeterinariansPage().clickVeterinarianSpecialitiesDropDownAndValidateCheckBoxStatus()

  //select and unselect boxes
  await pm.onVeterinariansPage().unCheckBoxVeterinarianSpecialitiesDropDown('radiology')
  await pm.onVeterinariansPage().checkBoxVeterinarianSpecialitiesDropDown('surgery')

  await pm.onVeterinariansPage().validateEditVeterinarianToHaveSpecialty('surgery')

  await pm.onVeterinariansPage().checkBoxVeterinarianSpecialitiesDropDown('dentistry')
 
  await pm.onVeterinariansPage().validateEditVeterinarianToHaveSpecialty('surgery, dentistry')
});

test('Test Case 2: Select all specialties', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onVeterinariansPage().clickEditVetButtonForVeterinarian('Rafael Ortega')
  await pm.onVeterinariansPage().validateEditVeterinarianToHaveSpecialty('surgery')

  await pm.onVeterinariansPage().selectDropDownAndcheckAllBoxes()
  await pm.onVeterinariansPage().validateEditVeterinarianToHaveSpecialty('surgery, radiology, dentistry')
});

test('Test Case 3: Unselect all specialties', async ({page}) => {
  const pm = new PageManager(page)
  
  await pm.onVeterinariansPage().clickEditVetButtonForVeterinarian('Linda Douglas')

  await pm.onVeterinariansPage().validateEditVeterinarianToHaveSpecialty('dentistry, surgery')

  await pm.onVeterinariansPage().selectDropDownAndUncheckAllBoxesAndValidateEmpty()
});