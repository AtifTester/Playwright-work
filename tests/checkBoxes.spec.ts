import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach( async({page}) => {
  const pm = new PageManager(page)

  await pm.navigateTo().openHomePage()
  await pm.navigateTo().veterinariansPage()
})

test('Test Case 1: Validate selected specialties', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onVeterinariansPage().clickEditVetButtonForVeterinarian('Helen Leary')
  await pm.onEditVeterinariansPage().validateVeterinarianSpecialty('radiology')

  await pm.onEditVeterinariansPage().clickVeterinarianSpecialitiesDropDownAndValidateCheckBoxStatus()

  //select and unselect boxes
  await pm.onEditVeterinariansPage().unCheckBoxVeterinarianSpecialitiesDropDown('radiology')
  await pm.onEditVeterinariansPage().checkBoxVeterinarianSpecialitiesDropDown('surgery')

  await pm.onEditVeterinariansPage().validateVeterinarianSpecialty('surgery')

  await pm.onEditVeterinariansPage().checkBoxVeterinarianSpecialitiesDropDown('dentistry')
 
  await pm.onEditVeterinariansPage().validateVeterinarianSpecialty('surgery, dentistry')
});

test('Test Case 2: Select all specialties', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onVeterinariansPage().clickEditVetButtonForVeterinarian('Rafael Ortega')
  await pm.onEditVeterinariansPage().validateVeterinarianSpecialty('surgery')

  await pm.onEditVeterinariansPage().selectDropDownAndcheckAllBoxes()
  await pm.onEditVeterinariansPage().validateVeterinarianSpecialty('surgery, radiology, dentistry')
});

test('Test Case 3: Unselect all specialties', async ({page}) => {
  const pm = new PageManager(page)
  
  await pm.onVeterinariansPage().clickEditVetButtonForVeterinarian('Linda Douglas')
  
  await pm.onEditVeterinariansPage().validateVeterinarianSpecialty('dentistry, surgery')

  await pm.onEditVeterinariansPage().selectDropDownAndUncheckAllBoxesAndValidateEmpty()
});