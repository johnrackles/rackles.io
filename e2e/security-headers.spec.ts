import { expect, test } from "@playwright/test";

test.describe("security headers", () => {
  test("CSP is present and does not use unsafe directives", async ({ request }) => {
    const response = await request.get("/");
    const csp = response.headers()["content-security-policy"];
    expect(csp).toBeTruthy();

    const directives = Object.fromEntries(
      csp!.split(";").map((d) => {
        const [name, ...values] = d.trim().split(/\s+/);
        return [name, values];
      }),
    );

    // https://developer.mozilla.org/en-US/observatory -- "CSP implemented
    // unsafely": no 'unsafe-inline'/data: in script-src, no overly broad
    // sources such as https: in object-src/script-src, and object-src (or
    // default-src as its fallback) must be restricted.
    expect(directives["script-src"]).toBeDefined();
    expect(directives["script-src"]).not.toContain("'unsafe-inline'");
    expect(directives["script-src"]).not.toContain("data:");
    expect(directives["script-src"]).not.toContain("https:");

    expect(directives["object-src"]).toEqual(["'none'"]);

    // Every directive value must be well-formed -- e.g. a quoted keyword
    // like 'none' must have a matching closing quote. Catches the
    // `frame-ancestors 'none` (missing quote) bug found via Mozilla
    // Observatory / manual curl inspection.
    for (const [name, values] of Object.entries(directives)) {
      for (const value of values) {
        const quotes = value.match(/'/g)?.length ?? 0;
        expect(quotes % 2, `${name} has an unmatched quote in "${value}"`).toBe(0);
      }
    }
  });

  test("clickjacking and cross-origin protections are present", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("same-origin");
    expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");

    // This site has no cross-origin API surface, so it must never send a
    // permissive Access-Control-Allow-Origin header.
    expect(headers["access-control-allow-origin"]).toBeUndefined();
  });
});
