import {Page, expect} from "@playwright/test"
import { PageManager } from "./pageManager";

export class OwnersInformationPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectAButtonNamed(buttonToSelect: string)
{
   await this.page.getByRole("button", { name: buttonToSelect}).click();
}

async validatePetTypeForPet(petName: string, petType: string)
{
    await expect(this.page.locator("app-pet-list", { hasText: petName}).locator("dd").nth(2)).toHaveText(petType);
}

async clickEditPetButtonForPet(petName: string){
    await this.page.locator("app-pet-list", { hasText: petName }).getByRole("button", { name: "Edit Pet" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("Pet");
}

async clickAddNewVisitButtonForPet(petName: string){
    const samanthaPetDetails = this.page.locator('app-pet-list', {hasText: petName})
    await samanthaPetDetails.getByRole("button", { name: "Add Visit" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("New Visit");
}

async validatePetHasNewInfoInOwnerPage(petNameToValidate: string)
{
    const petPageSection = this.page.getByRole("cell", { name: petNameToValidate})
    const petInfoDetail = petPageSection.locator("dd");
    await expect(petInfoDetail.first()).toHaveText("Tom");
    await expect(petInfoDetail.nth(1)).toHaveText("2014-05-02");
    await expect(petInfoDetail.last()).toHaveText("dog");
}

async deleteAPetFromOwnerPageAndVerifyItNoLongerExists(petName: string)
{
    const petPageSection = this.page.getByRole("cell", { name: petName})
    await petPageSection.getByRole("button", { name: "Delete Pet" }).click();

    await expect(petPageSection).not.toBeVisible()
}

async verifyCurrentDateNewVisitForPetName(petName: string)
{
    const date = new Date();
    const currentDay = date.getDate().toString()
    const currentMonth = date.toLocaleString('En-US', {month : '2-digit'})
    const currentYear = date.getFullYear().toString();

    const samanthaPetDetails = this.page.locator('app-pet-list', {hasText: petName})
    const petNameDate = samanthaPetDetails.getByRole("row").nth(2).getByRole("cell").first()

    await expect(petNameDate).toHaveText(`${currentYear}-${currentMonth}-${currentDay.padStart(2,"0")}`);
}

async validateMostRecentDateIsTopOfVisitListToBeTrueForPet(petName: string)
{
    const samanthaPetDetails = this.page.locator('app-pet-list', {hasText: petName})
    const petNameDate = samanthaPetDetails.getByRole("row").nth(2).getByRole("cell").first()
    const dermatologyGetDate = await petNameDate.textContent();
    const massageGetDate = await samanthaPetDetails.getByRole("row").nth(3).getByRole("cell").first().textContent();

    const dermatologyDate = Date.parse(dermatologyGetDate!);
    const massageDate = Date.parse(massageGetDate!);
    //This checks that derm date is more current than massage Date
    expect(dermatologyDate > massageDate).toBeTruthy();
}

async deleteLatestVisitorForPet(petName: string)
{
    const samanthaPetDetails = this.page.locator('app-pet-list', {hasText: petName})
    const deleteVisitButton = samanthaPetDetails.getByRole("row").getByRole("button", { name: "Delete Visit" });
    await deleteVisitButton.first().click();
}

async validateNewVisitNoLongerExistsForPetNameWithDescription(petName: string, visitDescription: string)
{
    const samanthaPetDetails = this.page.locator('app-pet-list', {hasText: petName})
    await expect(samanthaPetDetails.locator('app-visit-list')).not.toContainText(visitDescription);
}

}

