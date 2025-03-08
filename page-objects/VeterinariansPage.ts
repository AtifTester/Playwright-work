import {Page, expect} from "@playwright/test"

export class VeterinariansPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async selectAVeterinarianToEdit(VeterinarianEditButton: string){
    await this.page.getByRole('row', {name: VeterinarianEditButton}).getByRole('button', {name: "Edit"}).click()
}

async checkAllBoxes()
{
      const allBoxes = this.page.getByRole('checkbox')
      
      for(const box of await allBoxes.all()){
        await box.check()
        expect(await box.isChecked()).toBeTruthy()  
      }
}

async unCheckAllBoxes()
{
    const allBoxes = this.page.getByRole('checkbox')
  
    for(const box of await allBoxes.all()){
      await box.uncheck()
      expect(await box.isChecked()).toBeFalsy()  
    }
}

}