import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClockIcon, UsersIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity/config'
import { searchRecipesQuery } from '@/lib/sanity/queries'
import { groq } from 'next-sanity'

interface Recipe {
  _id: string
  title: string
  slug: { current: string }
  description: string
  mainImage: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cuisine: string
  dietaryTags: string[]
  rating: number
  reviewCount: number
  author: {
    _id: string
    name: string
    image: string
    verified: boolean
  }
  publishedAt: string
}

interface RecipeGridProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getFilteredRecipes(searchParams: RecipeGridProps['searchParams']): Promise<Recipe[]> {
  const {
    q: search,
    cuisine,
    difficulty,
    dietary,
    minTime,
    maxTime,
    minServings,
    maxServings,
  } = searchParams

  // Build dynamic query based on filters
  const queryConditions: string[] = ['_type == "recipe"']

  // Search term
  if (search && typeof search === 'string') {
    return sanityClient.fetch(searchRecipesQuery, { searchTerm: search })
  }

  // Cuisine filter
  if (cuisine && typeof cuisine === 'string') {
    const cuisines = cuisine.split(',').map(c => `"${c}"`).join(', ')
    queryConditions.push(`cuisine in [${cuisines}]`)
  }

  // Difficulty filter
  if (difficulty && typeof difficulty === 'string') {
    const difficulties = difficulty.split(',').map(d => `"${d}"`).join(', ')
    queryConditions.push(`difficulty in [${difficulties}]`)
  }

  // Dietary tags filter
  if (dietary && typeof dietary === 'string') {
    const dietaryTags = dietary.split(',')
    const dietaryConditions = dietaryTags.map(tag => `"${tag}" in dietaryTags`).join(' || ')
    queryConditions.push(`(${dietaryConditions})`)
  }

  // Time range filter
  if (minTime || maxTime) {
    const min = minTime ? parseInt(minTime as string) : 0
    const max = maxTime ? parseInt(maxTime as string) : 999
    queryConditions.push(`(prepTime + cookTime) >= ${min} && (prepTime + cookTime) <= ${max}`)
  }

  // Servings filter
  if (minServings || maxServings) {
    const min = minServings ? parseInt(minServings as string) : 1
    const max = maxServings ? parseInt(maxServings as string) : 20
    queryConditions.push(`servings >= ${min} && servings <= ${max}`)
  }

  const whereClause = queryConditions.join(' && ')

  const filteredQuery = groq`
    *[${whereClause}] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      "mainImage": mainImage.asset->url,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cuisine,
      dietaryTags,
      rating,
      reviewCount,
      "author": author->{
        _id,
        name,
        "image": image.asset->url,
        verified
      },
      publishedAt
    }
  `

  return sanityClient.fetch(filteredQuery)
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <Image
          src={recipe.mainImage}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="capitalize">
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Rating and Author */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">{recipe.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({recipe.reviewCount})</span>
          </div>
          {recipe.author.verified && (
            <Badge variant="outline" className="text-xs">
              Verified Chef
            </Badge>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Time and Servings */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.dietaryTags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            {recipe.cuisine}
          </Badge>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={recipe.author.image || '/default-avatar.png'}
              alt={recipe.author.name}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
          <span className="text-sm text-gray-600">{recipe.author.name}</span>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full">
          <Link href={`/recipes/${recipe.slug.current}`}>
            View Recipe
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-12">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No recipes found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or search terms to find more recipes.
        </p>
        <Button asChild variant="outline">
          <Link href="/recipes">
            Clear all filters
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default async function RecipeGrid({ searchParams }: RecipeGridProps) {
  const recipes = await getFilteredRecipes(searchParams)

  if (recipes.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* Load More Button (for future pagination) */}
      {recipes.length >= 12 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Recipes
          </Button>
        </div>
      )}
    </div>
  )
}