import {Page, expect} from "@playwright/test"

export class NavigationPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async openHomePage()
{
    await this.page.goto("/");
    await expect(this.page.locator(".title")).toHaveText("Welcome to Petclinic");
}

async ownersPage(){
    await this.page.getByText("Owners").click();
    await this.page.getByRole("link", { name: "Search" }).click();
    await expect(this.page.getByRole("heading")).toHaveText("Owners");
}

async veterinariansPage(){
    await this.page.getByRole("button", { name: "Veterinarians" }).click();
    await this.page.getByText('All').click();
    await expect(this.page.getByRole('heading')).toHaveText('Veterinarians')
}

async ownersInformationPage(ownerName: string){
    await this.ownersPage()
    await this.page.getByRole("row", { name: ownerName }).locator('a').click()
}

async petTypesPage(){
    await this.page.getByText('Pet Types').click()
}

async specialtiesPage(){
    await this.page.getByRole("link", { name: "Specialties" }).click();
}

}