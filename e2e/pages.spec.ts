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

    // Regression check: the Hackernews clone demo is offline, so it should
    // be listed as plain text, not a dead link.
    await expect(page.getByText("Hackernews clone built with qwik")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /hackernews clone/i }),
    ).toHaveCount(0);

    expectNoPageIssues(pageIssues);
  });

  test("imprint page renders expected content", async ({ page, pageIssues }) => {
    await page.goto("/imprint/");

    await expect(page.getByRole("heading", { name: "Impressum" })).toBeVisible();
    await expect(page.getByText("Johannes Rackles")).toBeVisible();

    expectNoPageIssues(pageIssues);
  });

  test("CV PDF is downloadable and a valid PDF", async ({ request }) => {
    const response = await request.get("/CV_Johannes-Rackles.pdf");
    expect(response.ok()).toBeTruthy();

    const body = await response.body();
    expect(body.length).toBeGreaterThan(0);
    expect(body.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  test("404 page for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
