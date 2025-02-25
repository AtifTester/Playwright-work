import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Test Case: Add and delete pet type", async ({ page }) => {
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByText("Pet Types").click();
  expect(page.getByRole("heading", { name: "Pet Types" }));

  await page.getByRole("button", { name: "Add" }).click();

  const inputNameField = page.locator("input#name");

  expect(page.getByRole("heading", { name: "New Pet Type" }));
  await expect(page.locator("app-pettype-add label")).toHaveText("Name");
  await expect(inputNameField).toBeVisible();

  await inputNameField.fill("pig");
  await page.getByRole("button", { name: "save" }).click();

  await expect(page.getByRole("table").locator("tr input").last()).toHaveValue(
    "pig"
  );

  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Delete the pet type?");
    dialog.accept();
  });

  await page.getByRole("button", { name: "Delete" }).last().click();
  await expect(
    page.getByRole("table").locator("tr input").last()
  ).not.toHaveValue("pig");
});
