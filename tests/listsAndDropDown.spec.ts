import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Test Case 1: Validate selected pet types from the list", async ({
  page,
}) => {
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByText("Owners").click();
  await page.getByText("Search").click();
  await expect(page.getByRole("heading")).toHaveText("Owners");

  await page.getByText("George Franklin").click();
  await expect(page.locator(".ownerFullName")).toHaveText("George Franklin");

  await page
    .locator("app-pet-list", { hasText: "Leo" })
    .getByRole("button", { name: "Edit Pet" })
    .click();
  await expect(page.getByRole("heading")).toHaveText("Pet");

  // This checks owner and name inside type
  await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
  await expect(page.locator("#type1")).toHaveValue("cat");

  // store variable of dropdown
  const dropDownSelectedField = page
    .locator(".control-group")
    .getByRole("combobox", { name: "Type" });

  //list of options
  const listOfOptions = ["cat", "dog", "lizard", "snake", "bird", "hamster"];

  for (const currentOption of listOfOptions) {
    dropDownSelectedField.selectOption(currentOption);
    await expect(page.locator("#type1")).toHaveValue(currentOption);
    if (currentOption != "hamster")
      dropDownSelectedField.selectOption(currentOption);
  }
});

test("Test Case 2: Validate the pet type update", async ({ page }) => {
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByText("Owners").click();
  await page.getByText("Search").click();
  await expect(page.getByRole("heading")).toHaveText("Owners");

  await page.getByText("Eduardo Rodriquez").click();

  await page
    .locator("app-pet-list")
    .filter({ hasText: "Rosy" })
    .getByRole("button", { name: "Edit Pet" })
    .click();

  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(page.locator("#type1")).toHaveValue("dog");

  await page.locator("#type").selectOption("bird");
  await expect(page.locator("#type1")).toHaveValue("bird");
  await expect(page.locator("#type")).toHaveValue("bird");
  await page.getByRole("button", { name: "Update Pet" }).click();

  await expect(
    page.locator("app-pet-list").filter({ hasText: "Rosy" })
  ).toContainText("bird");

  await page
    .locator("app-pet-list")
    .filter({ hasText: "Rosy" })
    .getByRole("button", { name: "Edit Pet" })
    .click();

  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(page.locator("#type1")).toHaveValue("bird");

  await page.locator("#type").selectOption("dog");
  await expect(page.locator("#type1")).toHaveValue("dog");
  await expect(page.locator("#type")).toHaveValue("dog");
  await page.getByRole("button", { name: "Update Pet" }).click();
});
