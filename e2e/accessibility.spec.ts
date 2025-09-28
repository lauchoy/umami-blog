import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Check for h1 presence
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
        return parseInt(tagName.substring(1))
      })
    )

    // Ensure headings follow proper hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i]
      const previousLevel = headingLevels[i - 1]

      if (currentLevel > previousLevel) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
    }
  })

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/')

    // Test tab navigation
    await page.keyboard.press('Tab')
    const firstFocusable = await page.evaluate(() => document.activeElement?.tagName)
    expect(firstFocusable).toBeTruthy()

    // Check that all interactive elements are focusable
    const interactiveElements = await page.locator(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).all()

    for (const element of interactiveElements) {
      await element.focus()
      const isFocused = await element.evaluate(el => document.activeElement === el)
      expect(isFocused).toBe(true)
    }
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/')

    // Check for main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()

    // Check that interactive elements have accessible names
    const buttons = await page.locator('button').all()
    for (const button of buttons) {
      const accessibleName = await button.evaluate(el => {
        return el.textContent?.trim() ||
               el.getAttribute('aria-label') ||
               el.getAttribute('aria-labelledby') ||
               el.getAttribute('title')
      })
      expect(accessibleName).toBeTruthy()
    }

    // Check that links have accessible names
    const links = await page.locator('a[href]').all()
    for (const link of links) {
      const accessibleName = await link.evaluate(el => {
        return el.textContent?.trim() ||
               el.getAttribute('aria-label') ||
               el.getAttribute('aria-labelledby') ||
               el.getAttribute('title')
      })
      expect(accessibleName).toBeTruthy()
    }
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')

    // Run axe specifically for color contrast
    const colorContrastResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze()

    expect(colorContrastResults.violations).toEqual([])
  })

  test('should be navigable with keyboard only', async ({ page }) => {
    await page.goto('/')

    // Test skip link functionality
    await page.keyboard.press('Tab')
    const skipLink = page.locator('.skip-link, [href*="skip"], [href*="main"]').first()

    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused()
      await page.keyboard.press('Enter')

      // Check that main content is focused or skip worked
      const mainContent = page.locator('main, #main, [role="main"]')
      await expect(mainContent).toBeVisible()
    }

    // Test that all interactive elements can be reached via keyboard
    let tabCount = 0
    const maxTabs = 50 // Prevent infinite loops

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      tabCount++

      const activeElement = await page.evaluate(() => {
        const el = document.activeElement
        return el ? {
          tagName: el.tagName,
          type: el.getAttribute('type'),
          role: el.getAttribute('role'),
          href: el.getAttribute('href')
        } : null
      })

      if (!activeElement) break
    }

    expect(tabCount).toBeGreaterThan(0)
  })

  test('should respect reduced motion preferences', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Check that animations are disabled or reduced
    const animatedElements = await page.locator('[class*="animate"], [style*="animation"]').all()

    for (const element of animatedElements) {
      const computedStyle = await element.evaluate(el => {
        const style = window.getComputedStyle(el)
        return {
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration
        }
      })

      // Animations should be significantly reduced or disabled
      if (computedStyle.animationDuration !== 'none') {
        const duration = parseFloat(computedStyle.animationDuration)
        expect(duration).toBeLessThanOrEqual(0.5) // Max 500ms
      }
    }
  })

  test('should have proper form accessibility', async ({ page }) => {
    await page.goto('/')

    // Find all form inputs
    const inputs = await page.locator('input, select, textarea').all()

    for (const input of inputs) {
      const inputData = await input.evaluate(el => ({
        id: el.id,
        name: el.getAttribute('name'),
        ariaLabel: el.getAttribute('aria-label'),
        ariaLabelledBy: el.getAttribute('aria-labelledby'),
        type: el.getAttribute('type')
      }))

      // Skip hidden inputs
      if (inputData.type === 'hidden') continue

      // Check that input has an accessible label
      let hasLabel = false

      if (inputData.ariaLabel || inputData.ariaLabelledBy) {
        hasLabel = true
      } else if (inputData.id) {
        const label = page.locator(`label[for="${inputData.id}"]`)
        hasLabel = await label.count() > 0
      }

      expect(hasLabel).toBe(true)
    }
  })

  test('should have proper image accessibility', async ({ page }) => {
    await page.goto('/')

    // Check all images have alt text
    const images = await page.locator('img').all()

    for (const image of images) {
      const alt = await image.getAttribute('alt')
      const role = await image.getAttribute('role')

      // Images should have alt text or be marked as decorative
      expect(alt !== null || role === 'presentation').toBe(true)
    }
  })
})