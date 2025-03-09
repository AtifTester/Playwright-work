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

async selectDateFromCalenderDaysAgo(datePicked: number)
{
    const date = new Date();
    date.setDate(date.getDate() - datePicked);
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


}