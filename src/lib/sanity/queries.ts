import { groq } from 'next-sanity'

// Recipe Queries
export const recipesQuery = groq`
  *[_type == "recipe"] | order(publishedAt desc) {
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

export const recipeBySlugQuery = groq`
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    "mainImage": mainImage.asset->url,
    "images": images[].asset->url,
    video,
    prepTime,
    cookTime,
    servings,
    difficulty,
    cuisine,
    dietaryTags,
    ingredients[] {
      _key,
      name,
      amount,
      unit,
      notes,
      optional
    },
    instructions[] {
      _key,
      step,
      description,
      duration,
      temperature,
      "image": image.asset->url,
      "video": video.asset->url,
      tips[]
    },
    nutrition {
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium
    },
    rating,
    reviewCount,
    "author": author->{
      _id,
      name,
      "image": image.asset->url,
      verified
    },
    "related": *[_type == "recipe" && cuisine == ^.cuisine && _id != ^._id][0...3] {
      _id,
      title,
      slug,
      "mainImage": mainImage.asset->url,
      prepTime,
      cookTime,
      difficulty,
      rating
    },
    publishedAt,
    _updatedAt
  }
`

export const recipesByCuisineQuery = groq`
  *[_type == "recipe" && cuisine == $cuisine] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    "mainImage": mainImage.asset->url,
    prepTime,
    cookTime,
    servings,
    difficulty,
    rating,
    reviewCount,
    publishedAt
  }
`

export const recipesByDietaryTagQuery = groq`
  *[_type == "recipe" && $tag in dietaryTags] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    "mainImage": mainImage.asset->url,
    prepTime,
    cookTime,
    servings,
    difficulty,
    rating,
    reviewCount,
    publishedAt
  }
`

export const searchRecipesQuery = groq`
  *[_type == "recipe" && (
    title match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    ingredients[].name match $searchTerm + "*"
  )] | order(publishedAt desc) {
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
  }
`

// Blog Post Queries
export const blogPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    "author": author->{
      _id,
      name,
      "image": image.asset->url
    },
    tags,
    category,
    publishedAt,
    readTime
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    "coverImage": coverImage.asset->url,
    "author": author->{
      _id,
      name,
      "image": image.asset->url,
      bio
    },
    tags,
    category,
    "related": *[_type == "post" && category == ^.category && _id != ^._id][0...3] {
      _id,
      title,
      slug,
      excerpt,
      "coverImage": coverImage.asset->url,
      publishedAt,
      readTime
    },
    publishedAt,
    readTime,
    _updatedAt
  }
`

export const blogPostsByCategoryQuery = groq`
  *[_type == "post" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    "author": author->{
      _id,
      name,
      "image": image.asset->url
    },
    tags,
    publishedAt,
    readTime
  }
`

// Author Queries
export const authorsQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    "image": image.asset->url,
    bio,
    verified,
    socialLinks
  }
`

export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    "image": image.asset->url,
    bio,
    verified,
    socialLinks,
    "recipes": *[_type == "recipe" && author._ref == ^._id] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "mainImage": mainImage.asset->url,
      prepTime,
      cookTime,
      difficulty,
      rating,
      publishedAt
    },
    "posts": *[_type == "post" && author._ref == ^._id] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "coverImage": coverImage.asset->url,
      publishedAt,
      readTime
    }
  }
`

// Home Page Queries
export const homePageQuery = groq`
  {
    "featuredRecipes": *[_type == "recipe" && featured == true] | order(publishedAt desc)[0...6] {
      _id,
      title,
      slug,
      description,
      "mainImage": mainImage.asset->url,
      prepTime,
      cookTime,
      difficulty,
      cuisine,
      rating,
      reviewCount
    },
    "trendingRecipes": *[_type == "recipe"] | order(reviewCount desc, rating desc)[0...8] {
      _id,
      title,
      slug,
      "mainImage": mainImage.asset->url,
      prepTime,
      cookTime,
      difficulty,
      rating,
      reviewCount
    },
    "latestPosts": *[_type == "post"] | order(publishedAt desc)[0...4] {
      _id,
      title,
      slug,
      excerpt,
      "coverImage": coverImage.asset->url,
      "author": author->{
        name,
        "image": image.asset->url
      },
      publishedAt,
      readTime
    },
    "cuisines": *[_type == "recipe"] | {
      "cuisine": cuisine,
      "count": count(*[_type == "recipe" && cuisine == ^.cuisine])
    } | order(count desc) | group(cuisine)[].{
      "name": key,
      "count": count
    }[0...8]
  }
`

// Statistics and Aggregation Queries
export const recipeStatsQuery = groq`
  {
    "totalRecipes": count(*[_type == "recipe"]),
    "totalPosts": count(*[_type == "post"]),
    "cuisineStats": *[_type == "recipe"] | {
      "cuisine": cuisine
    } | group(cuisine)[].{
      "name": key,
      "count": count
    } | order(count desc),
    "difficultyStats": *[_type == "recipe"] | {
      "difficulty": difficulty
    } | group(difficulty)[].{
      "level": key,
      "count": count
    }
  }
`