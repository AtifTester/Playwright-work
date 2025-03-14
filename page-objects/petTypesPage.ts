import {Page, expect} from "@playwright/test"

export class PetTypePage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async validateCurrentPetTypePageHeaderToHave(pageHeader: string)
{
    if (pageHeader == 'New Pet Type')
    {   
        await expect(this.page.locator("app-pettype-add").getByRole("heading")).toHaveText(pageHeader);
    }
    else
    {
        await expect(this.page.getByRole('heading')).toHaveText(pageHeader)
    }
}

async editPetTypePageButtonSelector(buttonTypeToSelect: string)
{
    await this.page.getByRole('button', {name: buttonTypeToSelect}).click()
}

async selectPetTypeButton(petTypePageButtonToSelect: string)
{
    await this.page.getByRole("button", { name: petTypePageButtonToSelect}).click();

    if (petTypePageButtonToSelect == 'save')
        await this.page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes')
}

async deleteLastRowInPetTypeTable()
{
    await this.page.getByRole("button", { name: "delete" }).last().click();
    await this.page.waitForResponse((responseStatus) => (responseStatus.status()) == (204))
}

async selectPetTypeEditButton(nameOfPetTypeToEdit: string)
{
    await this.page.getByRole('row', {name: nameOfPetTypeToEdit}).getByRole('button', {name: "Edit"}).click()
    await expect(this.page.getByRole('heading')).toHaveText('Edit Pet Type')
}

async setPetInputName(petNameToInput: string)
{
    const petTypeNameInputField = this.page.locator('#name')
    await petTypeNameInputField.click()
    await petTypeNameInputField.clear()
    await petTypeNameInputField.fill(petNameToInput)
}

async validateCorrectPetTypeNameInSelectedRow(validatePetTypeValue: string, tableRowToSelect: number)
{
    await this.validateCurrentPetTypePageHeaderToHave('Pet Types')
    await expect(this.page.getByRole('row').nth(tableRowToSelect).locator('input')).toHaveValue(validatePetTypeValue)
}

async validateEditPetTypePageInputValueOrWarningIfLeftBlank(textToValidateInEditPetTypePage: string)
{
    if(textToValidateInEditPetTypePage == '')
        await expect(this.page.locator('.help-block')).toHaveText('Name is required')
    else
        await expect(this.page.locator('#name')).toHaveValue(textToValidateInEditPetTypePage)
}

async validatePetTypeAddHasNameAndVisibleInput()
{
    await expect(this.page.locator("app-pettype-add label")).toHaveText("Name");
    await expect(this.page.locator("#name")).toBeVisible();
}

async addPetTypeToList(petNameToAdd: string)
{
    await this.page.locator('#name').fill(petNameToAdd)
}

async validateIfPetTypeLastRowHasValue(PetTypeValueToCheck: string, doesValueExist: boolean)
{
    const lastRowInTable = await this.page.getByRole("table").locator("tr input").last().inputValue()

    if((doesValueExist == true))
    {
        expect(lastRowInTable).toEqual(PetTypeValueToCheck)
    }
    else
    {
        expect(lastRowInTable).not.toEqual(PetTypeValueToCheck)
    }
}

async acceptPromptAfterDeleteButton()
{
    this.page.on("dialog", (dialog) => {
        expect(dialog.message()).toEqual("Delete the pet type?");
        dialog.accept();
      });
}

}