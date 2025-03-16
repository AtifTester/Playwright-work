import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { validateHeaderName } from 'http';


test.beforeEach( async({page}) => {
  const pm = new PageManager(page)

  await pm.navigateTo().openHomePage()
  await pm.navigateTo().petTypesPage()
})

test('Test Case 1: Update pet types', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onPetTypePage().selectPetTypeEditButton('cat')
  await pm.onEditPetTypePage().setPetInputName('rabbit')
  await pm.onEditPetTypePage().selectButtonNamed('update')
  await pm.onPetTypePage().validateCorrectPetTypeNameInSelectedRow('rabbit', 1)

  await pm.onPetTypePage().selectPetTypeEditButton('rabbit')
  await pm.onEditPetTypePage().setPetInputName('cat')
  await pm.onEditPetTypePage().selectButtonNamed('update')
  await pm.onPetTypePage().validateCorrectPetTypeNameInSelectedRow('cat', 1)
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
  const pm = new PageManager(page)

  await pm.onPetTypePage().selectPetTypeEditButton('dog')

  await pm.onEditPetTypePage().setPetInputName('moose')
  await pm.onEditPetTypePage().validatePetTypePageInputValue('moose')
  await pm.onEditPetTypePage().selectButtonNamed('cancel')
 
  await pm.onPetTypePage().validateCorrectPetTypeNameInSelectedRow('dog', 2)
  });

  test('Test Case 3: Pet type name is required validation', async ({page}) => { 
    const pm = new PageManager(page) 

    await pm.onPetTypePage().selectPetTypeEditButton('lizard')
    await pm.onEditPetTypePage().setPetInputName('')

    await pm.onEditPetTypePage().validatePetTypePageNameResponseWhenInputBlank('')
    await pm.onEditPetTypePage().selectButtonNamed('update')
    await pm.onPetTypePage().validateCurrentPetTypePageHeaderToHave('Edit Pet Type')

    await pm.onEditPetTypePage().selectButtonNamed('cancel')
    await pm.onPetTypePage().validateCurrentPetTypePageHeaderToHave('Pet Types')
  });