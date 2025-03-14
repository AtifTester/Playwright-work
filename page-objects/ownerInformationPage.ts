import {Page, expect} from "@playwright/test"
import { PageManager } from "./pageManager";

export class OwnersInformationPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async clickEditPetButtonForPet(petName: string){
    await this.page.locator("app-pet-list", { hasText: petName }).getByRole("button", { name: "Edit Pet" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("Pet");
}

async clickAddNewVisitorButtonForPet(petName: string){
    const samanthaPetDetails = this.page.locator('app-pet-list', {hasText: petName})
    await samanthaPetDetails.getByRole("button", { name: "Add Visit" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("New Visit");
}

async addNameToInputAndValidateTextIconChange(petNameToAdd: string)
{
    const inputPetName = this.page.locator("input#name");
    await inputPetName.click();
    await inputPetName.pressSequentially("Tom");
  
    await expect(this.page.locator("form span").first()).toHaveClass(/glyphicon-ok/);
}

async pickASpecificDateAndValidateDoBField(year: string, month: string, day: string, dateInDoBField: string)
{
    await this.page.getByLabel('Open calendar').click()
    await this.page.getByLabel('Choose month and year').click()
    await this.page.getByLabel('Previous 24 years').click()
    await this.page.getByText(year).click()
    await this.page.getByText(month).click()
    await this.page.getByText(day, {exact: true}).click()
  
    await expect(this.page.locator('[name="birthDate"]')).toHaveValue(dateInDoBField);
}

async selectAPetTypeAndSave(animalToSwitch: string)
{
    await this.page.locator("select").selectOption(animalToSwitch);
    await this.page.getByRole("button", { name: "Save Pet" }).click();
}

}

