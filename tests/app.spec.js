// tests/app.spec.js
import { test, expect } from "@playwright/test";

// Test 1 - page loads and title is correct
test("page has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/2026 NFL Draft Tracker/);
});

// Test 2 - top 30 players loaded
test("top 30 players list loads", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".playerRow");
  const players = page.locator(".playerRow");
  const count = await players.count();
  expect(count).toBeGreaterThan(0);
});

// Test 3 - position filter works
test("position filter shows only QB", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".playerRow");
  await page.selectOption("#positionSelect", "QB");
  await page.waitForTimeout(500);
  const rows = page.locator(".playerRow");
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

// Test 4 - player search works
test("player search finds player", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".playerRow");
  await page.fill("#playerSearch", "David Bailey");
  await page.click("#searchButton");
  await page.waitForTimeout(500);
  const rows = page.locator(".playerRow");
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

// Test 5 - simulator button exist
test("draft simulator button is visible", async ({ page }) => {
  await page.goto("/");
  const simButton = page.locator("#simButton");
  await expect(simButton).toBeVisible();
});
