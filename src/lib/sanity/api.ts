import { sanityClient } from './config'
import {
  recipesQuery,
  recipeBySlugQuery,
  recipesByCuisineQuery,
  recipesByDietaryTagQuery,
  searchRecipesQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  blogPostsByCategoryQuery,
  authorsQuery,
  authorBySlugQuery,
  homePageQuery,
  recipeStatsQuery,
} from './queries'
import { Recipe, BlogPost, SearchFilters, SearchResult } from '@/types'

// Recipe API functions
export async function getRecipes(): Promise<Recipe[]> {
  try {
    return await sanityClient.fetch(recipesQuery)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    throw new Error('Failed to fetch recipes')
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    return await sanityClient.fetch(recipeBySlugQuery, { slug })
  } catch (error) {
    console.error('Error fetching recipe by slug:', error)
    throw new Error('Failed to fetch recipe')
  }
}

export async function getRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
  try {
    return await sanityClient.fetch(recipesByCuisineQuery, { cuisine })
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error)
    throw new Error('Failed to fetch recipes by cuisine')
  }
}

export async function getRecipesByDietaryTag(tag: string): Promise<Recipe[]> {
  try {
    return await sanityClient.fetch(recipesByDietaryTagQuery, { tag })
  } catch (error) {
    console.error('Error fetching recipes by dietary tag:', error)
    throw new Error('Failed to fetch recipes by dietary tag')
  }
}

export async function searchRecipes(filters: SearchFilters): Promise<SearchResult> {
  try {
    let query = '*[_type == "recipe"'
    const params: any = {}

    // Add search conditions
    const conditions: string[] = []

    if (filters.query) {
      conditions.push(`(
        title match $searchTerm + "*" ||
        description match $searchTerm + "*" ||
        ingredients[].name match $searchTerm + "*"
      )`)
      params.searchTerm = filters.query
    }

    if (filters.cuisine && filters.cuisine.length > 0) {
      conditions.push(`cuisine in $cuisines`)
      params.cuisines = filters.cuisine
    }

    if (filters.dietary && filters.dietary.length > 0) {
      conditions.push(`count(dietaryTags[@ in $dietaryTags]) > 0`)
      params.dietaryTags = filters.dietary
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      conditions.push(`difficulty in $difficulties`)
      params.difficulties = filters.difficulty
    }

    if (filters.maxPrepTime) {
      conditions.push(`prepTime <= $maxPrepTime`)
      params.maxPrepTime = filters.maxPrepTime
    }

    if (filters.maxCookTime) {
      conditions.push(`cookTime <= $maxCookTime`)
      params.maxCookTime = filters.maxCookTime
    }

    if (filters.rating) {
      conditions.push(`rating >= $minRating`)
      params.minRating = filters.rating
    }

    if (conditions.length > 0) {
      query += ' && ' + conditions.join(' && ')
    }

    query += `] | order(publishedAt desc) {
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
      publishedAt
    }`

    const recipes = await sanityClient.fetch(query, params)

    // For now, we'll only search recipes. Blog posts can be added later.
    return {
      recipes,
      blogPosts: [],
      totalCount: recipes.length,
    }
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw new Error('Failed to search recipes')
  }
}

// Blog Post API functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await sanityClient.fetch(blogPostsQuery)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error('Failed to fetch blog posts')
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await sanityClient.fetch(blogPostBySlugQuery, { slug })
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    throw new Error('Failed to fetch blog post')
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    return await sanityClient.fetch(blogPostsByCategoryQuery, { category })
  } catch (error) {
    console.error('Error fetching blog posts by category:', error)
    throw new Error('Failed to fetch blog posts by category')
  }
}

// Author API functions
export async function getAuthors() {
  try {
    return await sanityClient.fetch(authorsQuery)
  } catch (error) {
    console.error('Error fetching authors:', error)
    throw new Error('Failed to fetch authors')
  }
}

export async function getAuthorBySlug(slug: string) {
  try {
    return await sanityClient.fetch(authorBySlugQuery, { slug })
  } catch (error) {
    console.error('Error fetching author by slug:', error)
    throw new Error('Failed to fetch author')
  }
}

// Home page data
export async function getHomePageData() {
  try {
    return await sanityClient.fetch(homePageQuery)
  } catch (error) {
    console.error('Error fetching home page data:', error)
    throw new Error('Failed to fetch home page data')
  }
}

// Statistics
export async function getRecipeStats() {
  try {
    return await sanityClient.fetch(recipeStatsQuery)
  } catch (error) {
    console.error('Error fetching recipe stats:', error)
    throw new Error('Failed to fetch recipe stats')
  }
}

// Utility functions
export async function getRecipeSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch(
      `*[_type == "recipe" && defined(slug.current)][].slug.current`
    )
    return slugs || []
  } catch (error) {
    console.error('Error fetching recipe slugs:', error)
    return []
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current)][].slug.current`
    )
    return slugs || []
  } catch (error) {
    console.error('Error fetching blog post slugs:', error)
    return []
  }
}

export async function getAuthorSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch(
      `*[_type == "author" && defined(slug.current)][].slug.current`
    )
    return slugs || []
  } catch (error) {
    console.error('Error fetching author slugs:', error)
    return []
  }
}