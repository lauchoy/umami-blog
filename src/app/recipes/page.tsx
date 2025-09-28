import { Suspense } from 'react'
import { Metadata } from 'next'
import RecipeDiscovery from '@/components/recipes/RecipeDiscovery'
import RecipeFilters from '@/components/recipes/RecipeFilters'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import RecipeSearch from '@/components/recipes/RecipeSearch'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Discover Recipes - Umami Culinary',
  description: 'Discover personalized recipes tailored to your taste preferences, dietary needs, and cooking skill level.',
}

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function RecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Recipe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore thousands of recipes personalized to your taste preferences, dietary needs, and skill level
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <RecipeSearch />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <RecipeFilters />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personalized Discovery Section */}
            <Suspense fallback={<Skeleton className="h-48 w-full mb-8" />}>
              <RecipeDiscovery />
            </Suspense>

            {/* Recipe Grid */}
            <Suspense fallback={<RecipeGridSkeleton />}>
              <RecipeGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}