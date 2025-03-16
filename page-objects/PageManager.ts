import {Page} from '@playwright/test'
import {NavigationPage} from "./navigationPage"
import {OwnersInformationPage} from "./ownerInformationPage"
import {OwnersPage} from './ownersPage'
import {PetDetailsPage} from "./petDetailsPage";
import {PetTypePage} from './petTypesPage';
import {SpecialtiesPage} from "./specialtiesPage";
import {VeterinariansPage} from "./veterinariansPage";
import { EditVeterinariansPage } from './editVetenarianPage';
import { EditPetTypePage } from './editPetType';
import { EditSpecialtiesPage } from './editSpeciality';

export class PageManager
{
    private readonly page: Page
    private readonly navigationPage : NavigationPage
    private readonly ownersInformationPage : OwnersInformationPage
    private readonly ownersPage : OwnersPage
    private readonly petDetailsPage : PetDetailsPage
    private readonly petTypePage : PetTypePage
    private readonly editPetTypePage : EditPetTypePage
    private readonly specialtiesPage : SpecialtiesPage
    private readonly editSpecialtiesPage : EditSpecialtiesPage
    private readonly veterinariansPage : VeterinariansPage
    private readonly editveterinariansPage : EditVeterinariansPage
    

    constructor(page: Page)
    {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.ownersInformationPage = new OwnersInformationPage(this.page)
        this.ownersPage = new OwnersPage(this.page)
        this.petDetailsPage = new PetDetailsPage(this.page)
        this.petTypePage = new PetTypePage(this.page)
        this.editPetTypePage = new EditPetTypePage(page)
        this.specialtiesPage = new SpecialtiesPage(this.page)
        this.editSpecialtiesPage = new EditSpecialtiesPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)
        this.editveterinariansPage = new EditVeterinariansPage(this.page)
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

    onEditPetTypePage()
    {
        return this.editPetTypePage
    }

    onPetDetailsPage()
    {
        return this.petDetailsPage
    }

    onVeterinariansPage()
    {
        return this.veterinariansPage
    }

    onEditVeterinariansPage()
    {
        return this.editveterinariansPage
    }

    onSpecialtiesPage()
    {
        return this.specialtiesPage
    }

    onEditSpecialityPage()
    {
        return this.editSpecialtiesPage
    }
}