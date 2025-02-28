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

  //Reworked this one to a one line assertion
  test("Test Case 2: Validate owners count of the Madison city", async ({
    page,
  }) => {
    await expect(
      page.getByRole("row", { name: "Madison" }).locator("a")
    ).toHaveCount(4);
  });

  test("Test Case 3: Validate search by Last Name", async ({ page }) => {
    const lastNameField = page.locator("#lastName");
    const findOwnerButton = page.getByRole("button", { name: "Find Owner" });

    const listOfOwners = ["Black", "Davis", "Es", "Playwright"];

    for (let List of listOfOwners) {
      await lastNameField.click();
      await lastNameField.fill(List);
      await findOwnerButton.click();

      if (List != "Playwright") {
        await expect(page.locator("tbody tr td").nth(0)).toContainText(List);
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

    await expect(
      page.getByRole("row", { name: "Telephone" }).locator("td")
    ).toHaveText("6085552765");

    const ownerPetInfoName = await page
      .getByRole("row", { name: "Birth Date" })
      .locator("dd")
      .first()
      .textContent();

    await expect(
      page.getByRole("row", { name: "Birth Date" }).locator("dd").first()
    ).toContainText(ownerPetName!);
  });

  //This test has a red line under a variable, is this an issue i can fix? The test works though
  test("Test Case 5: Validate pets of the Madison city", async ({ page }) => {
    const cityList = page.getByRole("row", { name: "Madison" });

    let emptyPetList: string[] = [];
    //seems there needs to be a bit of a delay for this code to work

    await page.waitForSelector("tbody");
    for (let list of await cityList.all()) {
      const cityRows = await list.locator("td").last().textContent();
      emptyPetList.push(cityRows!.trim());
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

  const specialtyInputField = page.locator("#name");

  await specialtyInputField.click();
  await specialtyInputField.clear();
  await specialtyInputField.fill("dermatology");

  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.locator('[id="1"]')).toHaveValue("dermatology");

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

  await specialtyInputField.click();
  await specialtyInputField.clear();
  await specialtyInputField.fill("Surgery");
  await page.getByRole("button", { name: "Update" }).click();
});

test("Test Case 7: Validate specialty lists", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByRole("link", { name: "Specialties" }).click();
  await expect(page.getByRole("heading")).toHaveText("Specialties");

  await page.getByRole("button", { name: "Add" }).click();
  const specialtyInputField = page.locator("#name");
  await specialtyInputField.click();
  await specialtyInputField.fill("oncology");
  await page.getByRole("button", { name: "Save" }).click();

  const allRows = page.locator("tbody tr");

  const specialtiesList: string[] = [];
  //to give loop enough time to fill array

  await page.waitForResponse(
    "https://petclinic-api.bondaracademy.com/petclinic/api/specialties"
  );

  for (let row of await allRows.all()) {
    const inputName = await row.locator("input").inputValue();
    specialtiesList.push(inputName);
  }

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await page
    .getByRole("row", { name: "Sharon Jenkins" })
    .getByRole("button", { name: "Edit Vet" })
    .click();
  await page.locator(".dropdown-display").click();

  //put into an array for matching
  const dropDownData = page.locator(".dropdown-content label");

  await expect(dropDownData).toHaveText(specialtiesList);

  await page.getByRole("checkbox", { name: "oncology" }).check();
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
