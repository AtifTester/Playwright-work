import {Page, expect} from "@playwright/test"

export class PetDetailsPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectPetTypeAndVerify(petType: string){
    const typeField = this.page.locator("#type1");
    const dropDownField = this.page.locator("#type");

    await dropDownField.selectOption(petType);
    await expect(typeField).toHaveValue(petType);
    await expect(dropDownField).toHaveValue(petType);

    await expect(this.page.locator("#name")).toHaveValue("Rosy");
}

async petDetailsPageButtonSelector(buttonToSelect: string)
{
    await this.page.getByRole("button", { name: buttonToSelect }).click();
}

async validatePetNameAndPetTypeInEditPetPage(petName: string, petType: string)
{
    await expect(this.page.locator("#name")).toHaveValue(petName);
    const typeField = this.page.locator("#type1");
    await expect(typeField).toHaveValue(petType);
}

async validateOwnerNameAndFollowingPetInEditPetPage(ownerName: string, petName: string)
{
    const typeField = this.page.locator("#type1");

    await expect(this.page.locator("#owner_name")).toHaveValue(ownerName);
    await expect(typeField).toHaveValue(petName);
}

async selectDateFromCalenderDaysAgo(daysAgoFromCurrentDay: number)
{
    const date = new Date();
    date.setDate(date.getDate() - daysAgoFromCurrentDay);
    const previousDay = date.getDate().toString();
    const previousMonth = date.toLocaleString('En-US', {month : '2-digit'})
    const previousYear = date.getFullYear().toString();
  
    const expectedDate = `${previousMonth} ${previousYear}`;
  
    await this.page.getByLabel("Open calendar").click();
    let calenderMonthandYear = await this.page.getByLabel("Choose month and year").textContent();
  
    while (!calenderMonthandYear!.includes(expectedDate)) {
        await this.page.getByLabel('Previous month').click();
        calenderMonthandYear = await this.page.getByLabel("Choose month and year").textContent();
        }
    
    await this.page.getByText(previousDay, { exact: true }).click();    
}

async validateCurrentDatePopulatedInPetDetailsDoBField()
{
    const date = new Date();
    const currentDay = date.getDate().toString()
    const currentMonth = date.toLocaleString('En-US', {month : '2-digit'})
    const currentYear = date.getFullYear().toString();

    await expect(this.page.locator('[name="date"]')).toHaveValue(`${currentYear}/${currentMonth}/${currentDay.padStart(2,"0")}`);
}

async addDescriptionForNewVisitPetDetail(description: string)
{
    const descriptionInput = this.page.locator('[name="description"]')
    await descriptionInput.fill(description);
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

async checkThroughListOfPetsInTypeList()
{
    const listOfOptions = ["cat", "dog", "lizard", "snake", "bird", "hamster"];
    const dropDownField = this.page.locator("#type");
    const typeField = this.page.locator("#type1");

    for (const currentOption of listOfOptions) {
    dropDownField.selectOption(currentOption);
    await expect(typeField).toHaveValue(currentOption);
  }
}

async validatePetNewVisitPetNameAndOwner(petname: string, ownerName: string)
{
    const newVisitRow = this.page.getByRole("row", { name: "cat" });
    await expect(newVisitRow.getByRole("cell").first()).toHaveText(petname);
    await expect(newVisitRow.getByRole("cell").last()).toHaveText(ownerName);
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