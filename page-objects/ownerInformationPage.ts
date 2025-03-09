import {Page, expect} from "@playwright/test"

export class OwnersInformationPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectEditPetNameToEditAndVerifyName(petName: string){
    await this.page.locator("app-pet-list", { hasText: petName }).getByRole("button", { name: "Edit Pet" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("Pet");

    await expect(this.page.locator("#name")).toHaveValue(petName);

}

}

