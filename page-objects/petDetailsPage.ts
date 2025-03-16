import {Page, expect} from "@playwright/test"

export class PetDetailsPage{
readonly page: Page

constructor(page: Page){
    this.page = page
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

async selectPetTypeAndVerifyVisibleInTypeField(petType: string){
    const typeField = this.page.locator("#type1");
    const dropDownField = this.page.locator("#type");

    await dropDownField.selectOption(petType);
    await expect(typeField).toHaveValue(petType);
    await expect(dropDownField).toHaveValue(petType);

    await expect(this.page.locator("#name")).toHaveValue("Rosy");
}

async selectAButtonNamed(buttonToSelect: string)
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

async validateListOfPetTypesCanBeSelectedAndAppearInTypeField()
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

}