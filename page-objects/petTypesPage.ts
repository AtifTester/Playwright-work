import {Page, expect} from "@playwright/test"

export class PetTypePage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectPetTypeEditButton(petTypeEditButton: string){
    await this.page.getByRole('row', {name: petTypeEditButton}).getByRole('button', {name: "Edit"}).click()
    await expect(this.page.getByRole('heading')).toHaveText('Edit Pet Type')
}

async setPetInputName(petNameToInput: string)
{
    const petTypeNameInputField = this.page.locator('#name')
    await petTypeNameInputField.click()
    await petTypeNameInputField.clear()
    await petTypeNameInputField.fill(petNameToInput)
}

}