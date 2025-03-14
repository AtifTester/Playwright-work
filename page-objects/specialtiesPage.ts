import {Page, expect} from "@playwright/test"
import { PageManager } from "./pageManager";

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

async clickEditButtonForSpecialty(specialtie: string)
{
    await this.page.getByRole("row", { name: specialtie }).getByRole("button", { name: "Edit" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("Edit Specialty");
}

async validateChosenRowHasSpeciality(specialtyRow: number, specialtie: string)
{
    await expect(this.page.locator(`[id="${specialtyRow}"]`)).toHaveValue(specialtie);
}

async addASpecialtieRowAndSave(specialityToAdd: string)
{
    await this.page.getByRole("button", { name: "Add" }).click();
    const specialtyInputField = this.page.locator("#name");
    await specialtyInputField.click();
    await specialtyInputField.fill(specialityToAdd);
    await this.page.getByRole("button", { name: "Save" }).click();
}

async deleteASpecialityByName(specialityName: string)
{
    await this.page.getByRole("row", { name: specialityName}).getByRole("button", { name: "Delete" }).click();
}

async compareSpecialityRowDataToVetenerianSpecialtyData(vetenarianName: string)
{
    const pm = new PageManager(this.page)

    const allRows = this.page.locator("tbody tr");
    const specialtiesList: string[] = [];

    await this.page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");

    for (let row of await allRows.all()) 
    {
        const inputName = await row.locator("input").inputValue();
        specialtiesList.push(inputName);
    }

    await pm.navigateTo().veterinariansPage()

    await this.page.getByRole("row", { name: vetenarianName}).getByRole("button", { name: "Edit Vet" }).click();
    await this.page.locator(".dropdown-display").click();

   //put into an array for matching
    const dropDownData = this.page.locator(".dropdown-content label");

    await expect(dropDownData).toHaveText(specialtiesList);
}

async checkASpecialtyForVetenarianAndSave(specialityToCheck: string)
{
    await this.page.getByRole("checkbox", { name: specialityToCheck}).check();
    await this.page.locator(".dropdown-display").click();
    await this.page.getByRole("button", { name: "Save Vet" }).click();
}

}

