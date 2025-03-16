import {Page, expect} from "@playwright/test"

export class VeterinariansPage{
readonly page: Page

constructor(page: Page){
    this.page = page
}

async clickEditVetButtonForVeterinarian(veterinatianName: string){
    await this.page.getByRole('row', {name: veterinatianName}).getByRole('button', {name: "Edit"}).click()
}

async validateVeterinarianToHaveSpecialty(veterinarianName: string, specialtyName: string)
{
    const rafaelOwner = this.page.getByRole("row", { name: veterinarianName});
    await expect(rafaelOwner.getByRole("cell").nth(1)).toHaveText(specialtyName);
}

async validateVetenerianToHaveNoSpeciality(veterinarianName: string)
{
    await expect(this.page.getByRole("row", { name: veterinarianName}).getByRole("cell").nth(1)).toBeEmpty();
}

}