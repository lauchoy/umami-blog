import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use

  console.log('🧪 Starting global setup...')

  // Start a browser instance to verify the app is running
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Wait for the application to be ready
    await page.goto(baseURL + '/', { timeout: 30000 })
    await page.waitForLoadState('networkidle')

    console.log('✅ Application is ready for testing')
  } catch (error) {
    console.error('❌ Failed to connect to application:', error)
    throw error
  } finally {
    await browser.close()
  }

  // You could add more global setup here, such as:
  // - Database seeding
  // - Authentication setup
  // - Test data preparation
}

export default globalSetup