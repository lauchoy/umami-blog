'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ClockIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getUserPreferences } from '@/lib/firebase/firestore'
import { sanityClient } from '@/lib/sanity/config'
import { recipesQuery } from '@/lib/sanity/queries'

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

interface UserPreferences {
  cuisines: string[]
  dietaryRestrictions: string[]
  skillLevel: string
  cookingTime: string
  favoriteIngredients: string[]
}

export default function RecipeDiscovery() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recipe[]>([])
  const [trending, setTrending] = useState<Recipe[]>([])
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true)

        // Load user preferences if logged in
        let preferences: UserPreferences | null = null
        if (user) {
          preferences = await getUserPreferences(user.uid)
          setUserPreferences(preferences)
        }

        // Get all recipes
        const allRecipes = await sanityClient.fetch(recipesQuery)

        // Get personalized recommendations
        const personalizedRecipes = preferences
          ? getPersonalizedRecommendations(allRecipes, preferences)
          : getFallbackRecommendations(allRecipes)

        // Get trending recipes (highest rated with most reviews)
        const trendingRecipes = allRecipes
          .sort((a: Recipe, b: Recipe) => {
            const scoreA = a.rating * Math.log(a.reviewCount + 1)
            const scoreB = b.rating * Math.log(b.reviewCount + 1)
            return scoreB - scoreA
          })
          .slice(0, 4)

        setRecommendations(personalizedRecipes.slice(0, 6))
        setTrending(trendingRecipes)
      } catch (error) {
        console.error('Error loading recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [user])

  function getPersonalizedRecommendations(recipes: Recipe[], preferences: UserPreferences): Recipe[] {
    return recipes
      .map((recipe: Recipe) => {
        let score = 0

        // Cuisine preference match
        if (preferences.cuisines.includes(recipe.cuisine)) {
          score += 3
        }

        // Dietary restrictions match
        if (preferences.dietaryRestrictions.some(diet => recipe.dietaryTags.includes(diet))) {
          score += 2
        }

        // Skill level match
        if (recipe.difficulty === preferences.skillLevel) {
          score += 2
        }

        // Cooking time preference
        const totalTime = recipe.prepTime + recipe.cookTime
        if (preferences.cookingTime === 'quick' && totalTime <= 30) {
          score += 1
        } else if (preferences.cookingTime === 'medium' && totalTime <= 60) {
          score += 1
        } else if (preferences.cookingTime === 'long' && totalTime > 60) {
          score += 1
        }

        // Recipe quality (rating and review count)
        score += recipe.rating * 0.5
        score += Math.log(recipe.reviewCount + 1) * 0.2

        return { ...recipe, score }
      })
      .sort((a, b) => b.score - a.score)
  }

  function getFallbackRecommendations(recipes: Recipe[]): Recipe[] {
    return recipes
      .sort((a: Recipe, b: Recipe) => {
        // Sort by rating and recency
        const scoreA = a.rating + (new Date(a.publishedAt).getTime() / 1000000000000)
        const scoreB = b.rating + (new Date(b.publishedAt).getTime() / 1000000000000)
        return scoreB - scoreA
      })
  }

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 mb-8">
      {/* Personalized Recommendations */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <SparklesIcon className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            {user ? 'Recommended for You' : 'Popular Recipes'}
          </h2>
        </div>

        {user && userPreferences && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Based on your preferences:
              <span className="ml-2">
                {userPreferences.cuisines.slice(0, 2).map(cuisine => (
                  <Badge key={cuisine} variant="secondary" className="mr-1">
                    {cuisine}
                  </Badge>
                ))}
                {userPreferences.dietaryRestrictions.slice(0, 2).map(diet => (
                  <Badge key={diet} variant="outline" className="mr-1">
                    {diet}
                  </Badge>
                ))}
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Trending Recipes */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ChartBarIcon className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} compact />
          ))}
        </div>
      </section>
    </div>
  )
}

function RecipeCard({ recipe, compact = false }: { recipe: Recipe; compact?: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className={`aspect-video bg-gray-200 relative overflow-hidden ${compact ? 'aspect-square' : ''}`}>
        <img
          src={recipe.mainImage}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="capitalize">
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Rating and Author */}
        <div className="flex items-center justify-between mb-2">
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
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {recipe.title}
        </h3>
        {!compact && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

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
        {!compact && (
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
        )}

        {/* Action Button */}
        <Button asChild className="w-full" size={compact ? "sm" : "default"}>
          <Link href={`/recipes/${recipe.slug.current}`}>
            View Recipe
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}