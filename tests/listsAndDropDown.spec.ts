import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByText("Owners").click();
  await page.getByText("Search").click();
  await expect(page.getByRole("heading")).toHaveText("Owners");
});

test("Test Case 1: Validate selected pet types from the list", async ({
  page,
}) => {
  await page.getByText("George Franklin").click();
  await expect(page.locator(".ownerFullName")).toHaveText("George Franklin");

  //store variable of type field
  const typeField = page.locator("#type1");
  //store variable of dropdown
  const dropDownSelectedField = page.locator("#type");

  await page
    .locator("app-pet-list", { hasText: "Leo" })
    .getByRole("button", { name: "Edit Pet" })
    .click();
  await expect(page.getByRole("heading")).toHaveText("Pet");

  // This checks owner and name inside type
  await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
  await expect(typeField).toHaveValue("cat");

  //list of options
  const listOfOptions = ["cat", "dog", "lizard", "snake", "bird", "hamster"];

  for (const currentOption of listOfOptions) {
    dropDownSelectedField.selectOption(currentOption);
    await expect(typeField).toHaveValue(currentOption);
  }
});

test("Test Case 2: Validate the pet type update", async ({ page }) => {
  await page.getByText("Eduardo Rodriquez").click();

  await page
    .locator("app-pet-list", { hasText: "Rosy" })
    .getByRole("button", { name: "Edit Pet" })
    .click();

  const typeField = page.locator("#type1");
  const dropDownSelectedField = page.locator("#type");

  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(typeField).toHaveValue("dog");

  await dropDownSelectedField.selectOption("bird");
  await expect(typeField).toHaveValue("bird");
  await expect(dropDownSelectedField).toHaveValue("bird");
  await page.getByRole("button", { name: "Update Pet" }).click();

  await expect(
    page.locator("app-pet-list", { hasText: "Rosy" }).locator("dd").nth(2)
  ).toHaveText("bird");

  await page
    .locator("app-pet-list", { hasText: "Rosy" })
    .getByRole("button", { name: "Edit Pet" })
    .click();

  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(typeField).toHaveValue("bird");

  await dropDownSelectedField.selectOption("dog");
  await expect(typeField).toHaveValue("dog");
  await expect(dropDownSelectedField).toHaveValue("dog");
  await page.getByRole("button", { name: "Update Pet" }).click();
});
