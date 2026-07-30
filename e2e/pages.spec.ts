import { expect, expectNoPageIssues, test } from "./fixtures";

test.describe("pages", () => {
  test("home page renders expected content", async ({ page, pageIssues }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Hi" })).toBeVisible();
    await expect(
      page.getByText("My name is John and I am a Frontend Developer."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Send me an E-Mail!" }),
    ).toHaveAttribute("href", "mailto:contact@rackles.io");

    expectNoPageIssues(pageIssues);
  });

  test("imprint page renders expected content", async ({ page, pageIssues }) => {
    await page.goto("/imprint/");

    await expect(page.getByRole("heading", { name: "Impressum" })).toBeVisible();
    await expect(page.getByText("Johannes Rackles")).toBeVisible();

    expectNoPageIssues(pageIssues);
  });
});
