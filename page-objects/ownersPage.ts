import {Page, expect} from "@playwright/test"
import { PageManager } from "./pageManager";

export class OwnersPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectOwnerBasedOffName(ownerName: string){
    await this.page.getByRole('row', {name: ownerName}).locator('a').click();
    await expect(this.page.locator(".ownerFullName")).toHaveText(ownerName);
}

async ownerPageButtonSelector(buttonToSelect: string)
{
   await this.page.getByRole("button", { name: buttonToSelect}).click();
}

async validateOwnersCityAndPets(ownerName: string, city: string, pet: string)
{
    const targetRow = this.page.getByRole("row", { name: ownerName});
    await expect(targetRow.locator("td").nth(2)).toHaveText(city);
    await expect(targetRow.locator("tr")).toHaveText(pet);
}

async validateNumberOfSameCities(cityAmount: number, cityName: string)
{
    await expect(this.page.getByRole("row", { name: cityName})).toHaveCount(cityAmount);
}

async listOfOwnerSurnameToAppearWhenSearched(listOfOwnerNameToPassIn: string[])
{
    const lastNameField = this.page.locator("#lastName");

    for (let ownerSurname of listOfOwnerNameToPassIn) {
      await lastNameField.click();
      await lastNameField.fill(ownerSurname);
      await this.page.getByRole("button", { name: "Find Owner" }).click();

      if (ownerSurname != "Playwright")
      {
        await expect(this.page.getByRole("row").nth(1).getByRole("cell").first()).toContainText(ownerSurname);
      } 
      else 
      {
        await expect(this.page.locator("app-owner-list")).toContainText('No owners with LastName starting with "Playwright"');
      }
    }
}

async clickOwnerBasedOffNumberAndToVerifySameOwnerInfoPetNameAndNumber(ownerTelephoneNumber: string)
{
    const pm = new PageManager(this.page)

    const owner = this.page.getByRole("row", { name: ownerTelephoneNumber });
    const ownerPetName = await owner.locator("td").last().textContent();

    await owner.locator("a").click();

    //I wasn't sure how to move this to ownerInfoPage so kept it here
    await expect(this.page.getByRole("row", { name: "Telephone" }).locator("td")).toHaveText(ownerTelephoneNumber);
    await expect(this.page.getByRole("row", { name: "Birth Date" }).locator("dd").first()).toContainText(ownerPetName!);
}

async verifyCityContainsFollowingPets(city: string, petsToVerify: string[])
{
    const cityList = this.page.getByRole("row", { name: city});

    let emptyPetList: string[] = [];

    await this.page.waitForSelector("tbody");
    for (let list of await cityList.all()) {
      const cityRows = await list.locator("td").last().textContent();
      emptyPetList.push(cityRows!.trim());
    }

    expect(emptyPetList).toEqual(petsToVerify);
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


}