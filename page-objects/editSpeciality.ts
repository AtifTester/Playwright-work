import {Page, expect} from "@playwright/test"
import { PageManager } from "./pageManager";

export class EditSpecialtiesPage{
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

}