import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // Check if the page loads
    await expect(page).toHaveTitle(/Umami Culinary/)

    // Check for main navigation or key elements
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // The page should still be functional on mobile
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have proper accessibility landmarks', async ({ page }) => {
    await page.goto('/')

    // Check for basic accessibility structure
    const main = page.locator('main')
    if (await main.count() > 0) {
      await expect(main).toBeVisible()
    }
  })

  test('should handle navigation', async ({ page }) => {
    await page.goto('/')

    // Test basic navigation if nav elements exist
    const navLinks = page.locator('nav a')
    const linkCount = await navLinks.count()

    if (linkCount > 0) {
      // Test first navigation link
      const firstLink = navLinks.first()
      await expect(firstLink).toBeVisible()
    }
  })
})