import { test, expect } from "@playwright/test";
import { text } from "stream/consumers";

test.describe("Owner focused test cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
    await page.getByText("Owners").click();
    await page.getByRole("link", { name: "Search" }).click();
  });

  test("Test Case 1: Validate the pet name city of the owner", async ({
    page,
  }) => {
    const targetRow = page.getByRole("row", { name: "Jeff Black" });
    await expect(targetRow.locator("td").nth(2)).toHaveText("Monona");
    await expect(targetRow.locator("tr")).toHaveText("Lucky");
  });

  //note struggled alot with this one. I tried looping but didn't work and ended up doing it this way
  test("Test Case 2: Validate owners count of the Madison city", async ({
    page,
  }) => {
    await page.waitForTimeout(500);
    const allRows = await page
      .getByRole("row", { name: "Madison" })
      .locator("a")
      .allTextContents();

    expect(allRows.length).toBe(4);
  });

  test("Test Case 3: Validate search by Last Name", async ({ page }) => {
    const lastNameField = page.locator("#lastName");
    const findOwnerButton = page.getByRole("button", { name: "Find Owner" });

    await lastNameField.click();
    await lastNameField.fill("Black");
    await findOwnerButton.click();

    await expect(page.getByRole("row", { name: "6085555387" })).toHaveText(
      /Black.*/
    );

    await lastNameField.click();
    await lastNameField.fill("Davis");
    await findOwnerButton.click();
    await expect(page.locator("tbody")).toHaveText(/Davis.*/);

    await lastNameField.click();
    await lastNameField.fill("Es");
    await findOwnerButton.click();
    await expect(page.locator("tbody")).toHaveText(/Es.*/);

    await lastNameField.click();
    await lastNameField.fill("Playwright");
    await findOwnerButton.click();
    await expect(page.locator("app-owner-list")).toContainText(
      'No owners with LastName starting with "Playwright"'
    );
  });

  test("Test Case 4: Validate phone number and pet name on the Owner Information page", async ({
    page,
  }) => {
    const owner = page.getByRole("row", { name: "6085552765" });
    const ownerPet = await owner.locator("td").last().textContent();
    //select owner name
    await owner.locator("a").click();

    await expect(
      page.getByRole("row", { name: "Telephone" }).locator("td")
    ).toHaveText("6085552765");

    const ownerPetInfoName = await page
      .getByRole("row", { name: "Birth Date" })
      .locator("dd")
      .first()
      .textContent();
    expect(ownerPetInfoName).toEqual(ownerPet?.trim());
  });

  //This test has a red line under a variable, is this an issue i can fix? The test works though
  test("Test Case 5: Validate pets of the Madison city", async ({ page }) => {
    const cityList = page.getByRole("row", { name: "Madison" });

    let emptyPetList: string[] = [];
    //seems there needs to be a bit of a delay for this code to work
    await page.waitForTimeout(500);

    for (let list of await cityList.all()) {
      const cityRows = await list.locator("td").last().textContent();
      emptyPetList.push(cityRows.trim());
    }

    expect(emptyPetList).toEqual(["Leo", "George", "Mulligan", "Freddy"]);
  });
});

test("Test Case 6: Validate specialty update", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  //checks table, unique row rafael, and checks for surgery
  const rafaelOwner = page.getByRole("row", { name: "Rafael Ortega" });
  await expect(rafaelOwner.locator("td").nth(1)).toHaveText("Surgery");

  await page.getByRole("link", { name: "Specialties" }).click();
  await expect(page.getByRole("heading")).toHaveText("Specialties");
  //selects the row with surgery
  await page
    .getByRole("row", { name: "Surgery" })
    .getByRole("button", { name: "Edit" })
    .click();
  await expect(page.getByRole("heading")).toHaveText("Edit Specialty");

  const inputName = page.locator("#name");

  await inputName.click();
  await inputName.clear();
  await inputName.fill("dermatology");

  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.locator('[id="1"]')).toHaveValue(
    "dermatology"
  );

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();
  await expect(rafaelOwner.locator("td").nth(1)).toHaveText("dermatology");

  //Repeat steps to revert change
  await page.getByRole("link", { name: "Specialties" }).click();
  await expect(page.getByRole("heading")).toHaveText("Specialties");

  await page
    .getByRole("row", { name: "Dermatology" })
    .getByRole("button", { name: "Edit" })
    .click();
  await expect(page.getByRole("heading")).toHaveText("Edit Specialty");

  await inputName.click();
  await inputName.clear();
  await inputName.fill("Surgery");
  await page.getByRole("button", { name: "Update" }).click();
});

test("Test Case 7: Validate specialty lists", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByRole("link", { name: "Specialties" }).click();
  await expect(page.getByRole("heading")).toHaveText("Specialties");

  await page.getByRole("button", { name: "Add" }).click();
  const input = page.locator("#name");
  await input.click();
  await input.fill("oncology");
  await page.getByRole("button", { name: "Save" }).click();

  const allRows = page.locator("tbody tr");

  const specialtiesList: string[] = [];
  //to give loop enough time to fill array
  await page.waitForTimeout(500);
  for (let row of await allRows.all()) {
    const temp = await row.locator("input").inputValue();
    specialtiesList.push(temp);
  }

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await page
    .getByRole("row", { name: "Sharon Jenkins" })
    .getByRole("button", { name: "Edit Vet" })
    .click();
  await page.locator(".dropdown-display").click();

  const dropDownData = await page
    .locator(".dropdown-content label")
    .allTextContents();
  expect(specialtiesList).toEqual(dropDownData);

  await page
    .locator(".dropdown-content")
    .getByRole("checkbox", { name: "oncology" })
    .check();
  await page.locator(".dropdown-display").click();
  await page.getByRole("button", { name: "Save Vet" }).click();

  await expect(
    page.getByRole("row", { name: "Sharon Jenkins" }).locator("td").nth(1)
  ).toHaveText("oncology");

  await page.getByRole("link", { name: "Specialties" }).click();
  
  await page
    .getByRole("row", { name: "oncology" })
    .getByRole("button", { name: "Delete" })
    .click();

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await expect(
    page.getByRole("row", { name: "Sharon Jenkins" }).locator("td").nth(1)
  ).toBeEmpty();
});
