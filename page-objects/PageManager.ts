import {Page} from '@playwright/test'
import {NavigationPage} from "../page-objects/navigationPage"
import {OwnersInformationPage} from "../page-objects/ownerInformationPage"
import {OwnersPage} from '../page-objects/ownersPage'
import { PetDetailsPage } from "../page-objects/petDetailsPage";
import { PetTypePage } from '../page-objects/petTypesPage';
import { SpecialtiesPage } from "../page-objects/specialtiesPage";
import { VeterinariansPage } from "../page-objects/VeterinariansPage";





export class PageManager{
    private readonly page: Page
    private readonly navigationPage : NavigationPage
    private readonly ownersInformationPage : OwnersInformationPage
    private readonly ownersPage : OwnersPage
    private readonly petDetailsPage : PetDetailsPage
    private readonly petTypePage : PetTypePage
    private readonly specialtiesPage : SpecialtiesPage
    private readonly veterinariansPage : VeterinariansPage
    

    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(page)
        this.ownersInformationPage = new OwnersInformationPage(page)
        this.ownersPage = new OwnersPage(page)
        this.petDetailsPage = new PetDetailsPage(page)
        this.petTypePage = new PetTypePage(page)
        this.specialtiesPage = new SpecialtiesPage(page)
        this.veterinariansPage = new VeterinariansPage(page)
    }

    navigateTo()
    {
        return this.navigationPage
    }

    onOwnersPage()
    {
        return this.ownersPage
    }

    onOwnerInformationPage()
    {
        return this.ownersInformationPage
    }

    onPetTypePage()
    {
        return this.petTypePage
    }

    onPetDetailsPage()
    {
        return this.petDetailsPage
    }

    onVeterinariansPage()
    {
        return this.veterinariansPage
    }

    onSpecialtiesPage()
    {
        return this.specialtiesPage
    }
}