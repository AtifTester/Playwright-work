import { test, expect } from "@playwright/test";
import { text } from "stream/consumers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".title")).toHaveText("Welcome to Petclinic");
  await page.getByText("Owners").click();
  await page.getByRole("link", { name: "Search" }).click();
});


test("Test Case 1: Select the desired date in the calendar", async ({
  page,
}) => {
  await page.getByRole("row", { name: "Harold Davis" }).locator("a").click();
  await page.getByRole("button", { name: "Add new pet" }).click();

  const inputPetName = page.locator("input#name");

  await inputPetName.click();
  await inputPetName.pressSequentially("Tom");
  //The glyph now uses a better locator
  await expect(page.locator("form span").first()).toHaveClass(/glyphicon-ok/);

  //Select Calender button
  await page.getByLabel('Open calendar').click()

  const calender = page.locator('mat-calendar')
  await page.getByLabel('Choose month and year').click()
  await page.getByLabel('Previous 24 years').click()
  await calender.getByText('2014').click()
  await calender.getByText('May').click()
  await calender.getByText('2', {exact: true}).click()

  await expect(page.locator('[name="birthDate"]')).toHaveValue("2014/05/02");

  await page.locator("select").selectOption("dog");
  await page.getByRole("button", { name: "Save Pet" }).click();

  const targetTable = page.getByRole("cell", { name: "Tom" })
  const petInfoDetail = targetTable.locator("dd");
  await expect(petInfoDetail.first()).toHaveText("Tom");
  await expect(petInfoDetail.nth(1)).toHaveText("2014-05-02");
  await expect(petInfoDetail.last()).toHaveText("dog");

  await targetTable.getByRole("button", { name: "Delete Pet" }).click();
  await expect(targetTable).not.toBeVisible()
});

test("Test Case 2: Select the dates of visits and validate dates order", async ({
  page,
}) => {
  await page.getByRole("row", { name: "Jean Coleman" }).locator("a").click();
  //This gets table data from name Samantha. I specified index so it's easier to use to find Date later
  const petName = page.getByRole("row", { name: "Samantha" }).nth(1);
  await petName.getByRole("button", { name: "Add Visit" }).click();
  await expect(page.getByRole("heading")).toHaveText("New Visit");

  const newVisitRow = page.getByRole("row", { name: "cat" });
  await expect(newVisitRow.getByRole("cell").first()).toHaveText("Samantha");
  await expect(newVisitRow.getByRole("cell").last()).toHaveText("Jean Coleman");
  
  await page.getByLabel('Open calendar').click()
  //Picks current date and asserts its in the date input
  const date = new Date();
  const currentDay = date.getDate().toLocaleString()
  const currentMonth = (date.getMonth() + 1).toLocaleString()
  const currentYear = date.getFullYear().toString();
  await page.getByText(currentDay, { exact: true }).click();

  await expect(page.locator('[name="date"]')).toHaveValue(
    `${currentYear}/${currentMonth.padStart(2,"0")}/${currentDay.padStart(2,"0")}`);

  const descriptionInput = page.locator('[name="description"]')
  await descriptionInput.fill("dermatologists visit");
  await page.getByRole("button", { name: "Add Visit" }).click();

  const petNameDate = petName.getByRole("row").nth(1).getByRole("cell").first()
  await expect(petNameDate).toHaveText(`${currentYear}-${currentMonth.padStart(2, "0")}-${currentDay.padStart(2,"0")}`);

  await petName.getByRole("button", { name: "Add Visit" }).click();
  
  //Create new date instance which focuses is set to past date
  date.setDate(date.getDate() - 45);
  const previousDay = date.getDate().toString();
  const previousMonth = (date.getMonth() + 1).toLocaleString()
  const previousYear = date.getFullYear().toString();

  const expectedDate = `${previousMonth} ${previousYear}`;

  await page.getByLabel("Open calendar").click();
  let calenderMonthandYear = await page.getByLabel("Choose month and year").textContent();

  while (!calenderMonthandYear!.includes(expectedDate)) {
    await page.locator("mat-calendar-header").locator("button").nth(1).click();
    calenderMonthandYear = await page.getByLabel("Choose month and year").textContent();
  }

  await page.locator("mat-calendar").getByText(previousDay).click();
  await descriptionInput.fill("Massage Therapy");
  await page.getByRole("button", { name: "Add Visit" }).click();

  const dermatologyGetDate = await petNameDate.textContent();

  const massageGetDate = await petName.getByRole("row").nth(2).getByRole("cell").first().textContent();

  const dermatologyDate = Date.parse(dermatologyGetDate!);
  const massageDate = Date.parse(massageGetDate!);
  //This checks that derm date is more current than massage Date
  expect(dermatologyDate > massageDate).toBeTruthy();

  const deleteVisitButton = petName.getByRole("row").getByRole("button", { name: "Delete Visit" });

  await deleteVisitButton.first().click();
  await deleteVisitButton.first().click();

  const verifyDeletedCell = petName.getByRole("row").nth(1).getByRole("cell").nth(1);
  await expect(verifyDeletedCell).not.toHaveText("dermatologists visit");
  await expect(verifyDeletedCell).not.toHaveText("Massage Therapy");
});
