import {Page, expect} from "@playwright/test"

export class EditPetTypePage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async setPetInputName(petNameToInput: string)
{
    const petTypeNameInputField = this.page.locator('#name')
    await petTypeNameInputField.click()
    await petTypeNameInputField.clear()
    await petTypeNameInputField.fill(petNameToInput)
}

async selectButtonNamed(buttonTypeToSelect: string)
{
    await this.page.getByRole('button', {name: buttonTypeToSelect}).click()
}

async validatePetTypePageInputValue(textToValidateInEditPetTypePage: string)
{
    if(textToValidateInEditPetTypePage == '')
        await expect(this.page.locator('.help-block')).toHaveText('Name is required')
    else
        await expect(this.page.locator('#name')).toHaveValue(textToValidateInEditPetTypePage)
}

async validatePetTypePageNameResponseWhenInputBlank(enterBlanktextToValidateResponse: string)
{
    await expect(this.page.locator('.help-block')).toHaveText('Name is required')
}

}