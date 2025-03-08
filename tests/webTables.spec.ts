import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { SpecialtiesPage } from "../page-objects/specialtiesPage";
import { text } from "stream/consumers";
import { PageManager } from "../page-objects/PageManager";

test.describe("Owner focused test cases", () => {
  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)

    await page.goto("/");
    await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
    pm.navigateTo().ownersPage()
  });

  test("Test Case 1: Validate the pet name city of the owner", async ({
    page,
  }) => {
    const targetRow = page.getByRole("row", { name: "Jeff Black" });
    await expect(targetRow.locator("td").nth(2)).toHaveText("Monona");
    await expect(targetRow.locator("tr")).toHaveText("Lucky");
  });

  test("Test Case 2: Validate owners count of the Madison city", async ({
    page,
  }) => {
    await expect(page.getByRole("row", { name: "Madison" })).toHaveCount(4);
  });

  test("Test Case 3: Validate search by Last Name", async ({ page }) => {
    const lastNameField = page.locator("#lastName");
    const listOfOwners = ["Black", "Davis", "Es", "Playwright"];

    for (let ownerSurname of listOfOwners) {
      await lastNameField.click();
      await lastNameField.fill(ownerSurname);
      await page.getByRole("button", { name: "Find Owner" }).click();

      if (ownerSurname != "Playwright") {
        await expect(
          page.getByRole("row").nth(1).getByRole("cell").first()
        ).toContainText(ownerSurname);
      } else {
        await expect(page.locator("app-owner-list")).toContainText(
          'No owners with LastName starting with "Playwright"'
        );
      }
    }
  });

  test("Test Case 4: Validate phone number and pet name on the Owner Information page", async ({
    page,
  }) => {
    const owner = page.getByRole("row", { name: "6085552765" });
    const ownerPetName = await owner.locator("td").last().textContent();
    //select owner name
    await owner.locator("a").click();

    await expect(page.getByRole("row", { name: "Telephone" }).locator("td")).toHaveText("6085552765");

    await expect(page.getByRole("row", { name: "Birth Date" }).locator("dd").first()).toContainText(ownerPetName!);
  });

  test("Test Case 5: Validate pets of the Madison city", async ({ page }) => {
    const cityList = page.getByRole("row", { name: "Madison" });

    let emptyPetList: string[] = [];

    await page.waitForSelector("tbody");
    for (let list of await cityList.all()) {
      const cityRows = await list.locator("td").last().textContent();
      emptyPetList.push(cityRows!.trim());
    }

    expect(emptyPetList).toEqual(["Leo", "George", "Mulligan", "Freddy"]);
  });
});

test("Test Case 6: Validate specialty update", async ({ page }) => {
  const pm = new PageManager(page)

  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  pm.navigateTo().veterinariansPage()

  //checks table, unique row rafael, and checks for surgery
  const rafaelOwner = page.getByRole("row", { name: "Rafael Ortega" });
  await expect(rafaelOwner.getByRole("cell").nth(1)).toHaveText("Surgery");

  await pm.navigateTo().specialtiesPage()
  await pm.onSpecialtiesPage().specialitieRowToEdit('Surgery')
  await pm.onSpecialtiesPage().inputTextInSpecialtyFieldAndUpdate('dermatology')

  await expect(page.locator('[id="1"]')).toHaveValue("dermatology");

  await pm.navigateTo().veterinariansPage()
  await expect(rafaelOwner.locator("td").nth(1)).toHaveText("dermatology");

  //Repeat steps to revert change
  await pm.navigateTo().specialtiesPage()
  await pm.onSpecialtiesPage().specialitieRowToEdit('Dermatology')
  await pm.onSpecialtiesPage().inputTextInSpecialtyFieldAndUpdate('Surgery')
});

test("Test Case 7: Validate specialty lists", async ({ page }) => {
  const pm = new PageManager(page)

  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await pm.navigateTo().specialtiesPage()

  pm.onSpecialtiesPage().addASpecialtieRowAndSave('oncology')

  const allRows = page.locator("tbody tr");
  const specialtiesList: string[] = [];

  await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");
  
  for (let row of await allRows.all()) {
    const inputName = await row.locator("input").inputValue();
    specialtiesList.push(inputName);
  }

  await pm.navigateTo().veterinariansPage()

  await page.getByRole("row", { name: "Sharon Jenkins" }).getByRole("button", { name: "Edit Vet" }).click();
  await page.locator(".dropdown-display").click();

  //put into an array for matching
  const dropDownData = page.locator(".dropdown-content label");

  await expect(dropDownData).toHaveText(specialtiesList);

  await page.getByRole("checkbox", { name: "oncology" }).check();
  await page.locator(".dropdown-display").click();
  await page.getByRole("button", { name: "Save Vet" }).click();

  await expect(page.getByRole("row", { name: "Sharon Jenkins" }).getByRole("cell").nth(1)).toHaveText("oncology");

  await pm.navigateTo().specialtiesPage()

  await page.getByRole("row", { name: "oncology" }).getByRole("button", { name: "Delete" }).click();

  await pm.navigateTo().veterinariansPage()

  await expect(page.getByRole("row", { name: "Sharon Jenkins" }).getByRole("cell").nth(1)).toBeEmpty();
});
