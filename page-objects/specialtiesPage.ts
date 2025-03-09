import {Page, expect} from "@playwright/test"

export class SpecialtiesPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async inputTextInSpecialtyFieldAndUpdate(textToInput: string){
    const specialtyInputField = this.page.locator("#name");

    await specialtyInputField.click();
    await specialtyInputField.clear();
    await specialtyInputField.fill(textToInput);
    await this.page.getByRole("button", { name: "Update" }).click();
}

async specialitieRowToEdit(specialtie)
{
    await this.page.getByRole("row", { name: specialtie }).getByRole("button", { name: "Edit" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("Edit Specialty");
}

async addASpecialtieRowAndSave(specialityToAdd: string)
{
    await this.page.getByRole("button", { name: "Add" }).click();
    const specialtyInputField = this.page.locator("#name");
     await specialtyInputField.click();
    await specialtyInputField.fill(specialityToAdd);
    await this.page.getByRole("button", { name: "Save" }).click();
}

}

