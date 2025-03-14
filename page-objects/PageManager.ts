import {Page} from '@playwright/test'
import {NavigationPage} from "./navigationPage"
import {OwnersInformationPage} from "./ownerInformationPage"
import {OwnersPage} from './ownersPage'
import {PetDetailsPage} from "./petDetailsPage";
import {PetTypePage} from './petTypesPage';
import {SpecialtiesPage} from "./specialtiesPage";
import {VeterinariansPage} from "./veterinariansPage";

export class PageManager
{
    private readonly page: Page
    private readonly navigationPage : NavigationPage
    private readonly ownersInformationPage : OwnersInformationPage
    private readonly ownersPage : OwnersPage
    private readonly petDetailsPage : PetDetailsPage
    private readonly petTypePage : PetTypePage
    private readonly specialtiesPage : SpecialtiesPage
    private readonly veterinariansPage : VeterinariansPage
    

    constructor(page: Page)
    {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.ownersInformationPage = new OwnersInformationPage(this.page)
        this.ownersPage = new OwnersPage(this.page)
        this.petDetailsPage = new PetDetailsPage(this.page)
        this.petTypePage = new PetTypePage(this.page)
        this.specialtiesPage = new SpecialtiesPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)
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