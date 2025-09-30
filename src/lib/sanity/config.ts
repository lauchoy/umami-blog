import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}

// Validate configuration at runtime (not during build)
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn('Missing NEXT_PUBLIC_SANITY_PROJECT_ID - Sanity features may not work correctly')
}

export const sanityClient = createClient(sanityConfig)

// Client for server-side operations that require authentication
export const sanityWriteClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: sanityConfig.token,
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

export default sanityClient