import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...')

  // Add any cleanup operations here:
  // - Database cleanup
  // - File cleanup
  // - Service cleanup

  console.log('✅ Global teardown completed')
}

export default globalTeardown