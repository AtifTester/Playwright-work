import {Page, expect} from "@playwright/test"

export class OwnersPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectOwner(ownerName: string){
    await this.page.getByRole('row', {name: ownerName}).locator('a').click();
    await expect(this.page.locator(".ownerFullName")).toHaveText(ownerName);
}

}