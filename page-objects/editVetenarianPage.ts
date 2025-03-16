import {Page, expect} from "@playwright/test"

export class EditVeterinariansPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async validateVeterinarianSpecialty(specialtyName: string)
{
    await expect(this.page.locator('.selected-specialties')).toHaveText(specialtyName)
}

async clickVeterinarianSpecialitiesDropDownAndValidateCheckBoxStatus()
{
    await this.page.locator('.dropdown-display').click()
    expect(await this.page.getByRole('checkbox', {name: 'radiology'}).isChecked()).toBeTruthy()
    expect(await this.page.getByRole('checkbox', {name: 'surgery'}).isChecked()).toBeFalsy()
    expect(await this.page.getByRole('checkbox', {name: 'dentistry'}).isChecked()).toBeFalsy()
}

async checkBoxVeterinarianSpecialitiesDropDown(specialtieToCheck: string)
{
   await this.page.getByRole('checkbox', {name: specialtieToCheck}).check()
}

async unCheckBoxVeterinarianSpecialitiesDropDown(specialtieToUnCheck: string)
{
  await this.page.getByRole('checkbox', {name: specialtieToUnCheck}).uncheck()
}

async selectDropDownAndcheckAllBoxes()
{
      const allBoxes = this.page.getByRole('checkbox')
      await this.page.locator('.dropdown-display').click()
      for(const box of await allBoxes.all()){
        await box.check()
        expect(await box.isChecked()).toBeTruthy()  
      }
}

async selectDropDownAndUncheckAllBoxesAndValidateEmpty()
{
    const allBoxes = this.page.getByRole('checkbox')
    await this.page.locator('.dropdown-display').click()
    for(const box of await allBoxes.all()){
      await box.uncheck()
      expect(await box.isChecked()).toBeFalsy()  
    }

    await expect(this.page.locator('.selected-specialties')).toBeEmpty()
}

async checkASpecialtyForVetenarianAndSave(specialityToCheck: string)
{
    await this.page.getByRole("checkbox", { name: specialityToCheck}).check();
    await this.page.locator(".dropdown-display").click();
    await this.page.getByRole("button", { name: "Save Vet" }).click();
}

}