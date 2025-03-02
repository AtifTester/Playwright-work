import { test, expect } from "@playwright/test";
import { text } from "stream/consumers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByText("Owners").click();
  await page.getByRole("link", { name: "Search" }).click();
});

// I'm not sure I did the glyph the right way
test("Test Case 1: Select the desired date in the calendar", async ({
  page,
}) => {
  await page.getByRole("row", { name: "6085553198" }).locator("a").click();
  await page.getByRole("button", { name: "Add new pet" }).click();

  const inputPetName = page.locator("input#name");

  await inputPetName.click();
  await inputPetName.pressSequentially("Tom");
  //now it asserts the glyph is now a tick, if the input isn't populated this assertion fails so i assume its meant to be this way?
  await expect(page.locator(".glyphicon-ok").first()).toHaveClass(
    "glyphicon form-control-feedback glyphicon-ok"
  );

  //Select Calender button
  await page.locator("mat-datepicker-toggle").click();
  // Used month one day ahead because calender starts at 0
  const dateToMatch = new Date("May, 02, 2014");
  const expectedDay = dateToMatch.getDate().toString();
  const expectedMonth = (dateToMatch.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const expectedYear = dateToMatch.getFullYear().toString();

  const expectedDate = `${expectedMonth} ${expectedYear}`;
  //Specifically used for selecting the month on calender

  //Checks for calender Year
  let calenderYearAndMonth = await page
    .locator("mat-calendar-header button .mdc-button__label")
    .textContent();

  //Loop runs until it finds the correct year and month
  while (!calenderYearAndMonth!.includes(expectedDate)) {
    //click previous arrow
    await page.locator("mat-calendar-header").locator("button").nth(1).click();

    calenderYearAndMonth = await page
      .locator("mat-calendar-header button .mdc-button__label")
      .textContent();
  }

  await page
    .locator(".mat-calendar-content")
    .getByText(expectedDay, { exact: true })
    .click();

  await expect(page.locator('[name="birthDate"]')).toHaveValue("2014/05/02");

  await page.locator("select").selectOption("dog");
  await page.getByRole("button", { name: "Save Pet" }).click();

  const targetTable = page.getByRole("row", { name: "Birth Date" }).last();
  const findPetInfo = targetTable.locator("dd");
  await expect(findPetInfo.first()).toHaveText("Tom");
  await expect(findPetInfo.nth(1)).toHaveText("2014-05-02");
  await expect(findPetInfo.last()).toHaveText("dog");

  await targetTable.getByRole("button", { name: "Delete Pet" }).click();
  await expect(findPetInfo.first()).not.toHaveText("Tom");
});

test("Test Case 2: Select the dates of visits and validate dates order", async ({
  page,
}) => {
  await page.getByRole("row", { name: "6085552654" }).locator("a").click();
  //This gets table data from name Samantha
  const userRow = page.getByRole("row", { name: "Samantha" }).nth(1);
  await userRow.getByRole("button", { name: "Add Visit" }).click();
  await expect(page.getByRole("heading")).toHaveText("New Visit");

  const newVisitRow = page.getByRole("row", { name: "cat" });
  await expect(newVisitRow.getByRole("cell").first()).toHaveText("Samantha");
  await expect(newVisitRow.getByRole("cell").last()).toHaveText("Jean Coleman");
  //Picks current date and asserts its in the date input
  await page.locator("mat-datepicker-toggle button").click();

  const date = new Date();
  const currentDay = date.getDate().toString();
  const currentMonth = (date.getMonth() + 1).toString();
  const currentYear = date.getFullYear().toString();
  await page.getByText(currentDay, { exact: true }).click();
  //Decided to use variables because the test would fail the next day if i used normal string
  await expect(page.locator('[name="date"]')).toHaveValue(
    `${currentYear}/${currentMonth.padStart(2, "0")}/${currentDay.padStart(
      2,
      "0"
    )}`
  );

  const descriptionInput = page.locator('[name="description"]');
  await descriptionInput.click();
  await descriptionInput.fill("dermatologists visit");
  await page.getByRole("button", { name: "Add Visit" }).click();

  await expect(
    userRow.getByRole("row").nth(1).getByRole("cell").first()
  ).toHaveText(
    `${currentYear}-${currentMonth.padStart(2, "0")}-${currentDay.padStart(
      2,
      "0"
    )}`
  );
  await userRow.getByRole("button", { name: "Add Visit" }).click();
  //Create new date instance which focuses is set to past date
  const newDate = new Date();
  newDate.setDate(newDate.getDate() - 45);
  const previousDay = newDate.getDate().toString();
  const previousMonth = (newDate.getMonth() + 1).toString().padStart(2, "0");
  const previousYear = newDate.getFullYear().toString();

  const expectedDate = `${previousMonth} ${previousYear}`;

  await page.locator("mat-datepicker-toggle button").click();
  let calenderMonthandYear = await page
    .locator(
      'mat-calendar-header button .mdc-button__label'
    )
    .textContent();

  while (!calenderMonthandYear!.includes(expectedDate)) {
    await page.locator("mat-calendar-header").locator("button").nth(1).click();
    calenderMonthandYear = await page
      .locator(
        'mat-calendar-header button .mdc-button__label'
      )
      .textContent();
  }

  await page.locator("mat-calendar").getByText(previousDay).click();
  await descriptionInput.click();
  await descriptionInput.fill("Massage Therapy");
  await page.getByRole("button", { name: "Add Visit" }).click();

  const dermatologyGetDate = await userRow
    .getByRole("row")
    .nth(1)
    .getByRole("cell")
    .first()
    .textContent();

  const massageGetDate = await userRow
    .getByRole("row")
    .nth(2)
    .getByRole("cell")
    .first()
    .textContent();

  const dermatologyDate = Date.parse(dermatologyGetDate!);
  const massageDate = Date.parse(massageGetDate!);
  //This checks that derm date is more current than massage Date
  expect(dermatologyDate > massageDate).toBeTruthy();
  const deleteRow = userRow
    .getByRole("row")
    .getByRole("button", { name: "Delete Visit" });
  await deleteRow.first().click();
  await deleteRow.first().click();

  const verifyDeletedCell = userRow
    .getByRole("row")
    .nth(1)
    .getByRole("cell")
    .nth(1);
  await expect(verifyDeletedCell).not.toHaveText("dermatologists visit");
  await expect(verifyDeletedCell).not.toHaveText("massage therapy");
});
