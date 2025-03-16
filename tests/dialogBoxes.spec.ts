import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().openHomePage()
});

test("Test Case: Add and delete pet type", async ({ page }) => {
  const pm = new PageManager(page)

  await pm.navigateTo().petTypesPage()
  await pm.onPetTypePage().selectPetTypeButton('Add')

  await pm.onPetTypePage().validateCurrentPetTypePageHeaderToHave('New Pet Type')
  await pm.onPetTypePage().validatePetTypeAddHasNameAndVisibleInput()

  await pm.onPetTypePage().addPetTypeToList('pig')
  await pm.onPetTypePage().selectPetTypeButton('save')

  await pm.onPetTypePage().validateIfPetTypeLastRowHasValue('pig', true)

  await pm.onPetTypePage().acceptPromptAfterDeleteButton()

  await pm.onPetTypePage().deleteLastRowInPetTypeTable()
  await pm.onPetTypePage().validateIfPetTypeLastRowHasValue('pig', false)
});
