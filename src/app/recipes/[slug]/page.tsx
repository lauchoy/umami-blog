import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import RecipeHeader from '@/components/recipes/RecipeHeader'
import RecipeIngredients from '@/components/recipes/RecipeIngredients'
import RecipeInstructions from '@/components/recipes/RecipeInstructions'
import RecipeNutrition from '@/components/recipes/RecipeNutrition'
import RecipeReviews from '@/components/recipes/RecipeReviews'
import RecipeRelated from '@/components/recipes/RecipeRelated'
import CookingModeToggle from '@/components/recipes/CookingModeToggle'
import { Skeleton } from '@/components/ui/skeleton'
import { sanityClient } from '@/lib/sanity/config'
import { recipeBySlugQuery } from '@/lib/sanity/queries'

interface Recipe {
  _id: string
  title: string
  slug: { current: string }
  description: string
  mainImage: string
  images: string[]
  video?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cuisine: string
  dietaryTags: string[]
  ingredients: Array<{
    _key: string
    name: string
    amount: number
    unit: string
    notes?: string
    optional?: boolean
  }>
  instructions: Array<{
    _key: string
    step: number
    description: string
    duration?: number
    temperature?: number
    image?: string
    video?: string
    tips?: string[]
  }>
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
  }
  rating: number
  reviewCount: number
  author: {
    _id: string
    name: string
    image: string
    verified: boolean
  }
  related: Array<{
    _id: string
    title: string
    slug: { current: string }
    mainImage: string
    prepTime: number
    cookTime: number
    difficulty: string
    rating: number
  }>
  publishedAt: string
  _updatedAt: string
}

async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const recipe = await sanityClient.fetch(recipeBySlugQuery, { slug })
    return recipe
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    return {
      title: 'Recipe Not Found - Umami Culinary',
    }
  }

  return {
    title: `${recipe.title} - Umami Culinary`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [
        {
          url: recipe.mainImage,
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recipe Header */}
        <Suspense fallback={<RecipeHeaderSkeleton />}>
          <RecipeHeader recipe={recipe} />
        </Suspense>

        {/* Cooking Mode Toggle */}
        <div className="mb-8">
          <CookingModeToggle recipe={recipe} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructions */}
            <Suspense fallback={<InstructionsSkeleton />}>
              <RecipeInstructions instructions={recipe.instructions} />
            </Suspense>

            {/* Reviews */}
            <Suspense fallback={<ReviewsSkeleton />}>
              <RecipeReviews recipeId={recipe._id} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ingredients */}
            <Suspense fallback={<IngredientsSkeleton />}>
              <RecipeIngredients
                ingredients={recipe.ingredients}
                servings={recipe.servings}
              />
            </Suspense>

            {/* Nutrition */}
            <Suspense fallback={<NutritionSkeleton />}>
              <RecipeNutrition nutrition={recipe.nutrition} />
            </Suspense>
          </div>
        </div>

        {/* Related Recipes */}
        {recipe.related && recipe.related.length > 0 && (
          <div className="mt-16">
            <Suspense fallback={<RelatedSkeleton />}>
              <RecipeRelated recipes={recipe.related} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading Skeletons
function RecipeHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-96 w-full mb-6" />
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-6 w-full mb-4" />
      <div className="flex gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

function InstructionsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-6">
          <Skeleton className="h-6 w-16 mb-3" />
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  )
}

function IngredientsSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <Skeleton className="h-6 w-24 mb-4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

function NutritionSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <Skeleton className="h-6 w-24 mb-4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  )
}

function RelatedSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}