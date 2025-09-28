// Core Types for Umami Culinary Platform

export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  cuisines: string[]
  dietaryRestrictions: DietaryRestriction[]
  skillLevel: SkillLevel
  cookingTime: CookingTime
  favoriteIngredients: string[]
  allergies: string[]
  dislikedIngredients: string[]
  createdAt?: Date
  updatedAt?: Date
}

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'low-sodium'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type CookingTime = 'quick' | 'medium' | 'long'

export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  prepTime: number // minutes
  cookTime: number // minutes
  servings: number
  difficulty: SkillLevel
  cuisine: string
  dietaryTags: DietaryRestriction[]
  nutrition: NutritionInfo
  images: RecipeImage[]
  video?: string
  rating: number
  reviewCount: number
  author: RecipeAuthor
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
  notes?: string
  optional?: boolean
}

export interface Instruction {
  id: string
  step: number
  description: string
  duration?: number // minutes
  temperature?: number
  image?: string
  video?: string
  tips?: string[]
}

export interface NutritionInfo {
  calories: number
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber: number // grams
  sugar: number // grams
  sodium: number // mg
}

export interface RecipeImage {
  url: string
  alt: string
  width: number
  height: number
  isMain?: boolean
}

export interface RecipeAuthor {
  id: string
  name: string
  avatar?: string
  verified?: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: RecipeImage
  author: RecipeAuthor
  tags: string[]
  category: BlogCategory
  publishedAt: Date
  updatedAt: Date
  readTime: number // minutes
}

export type BlogCategory =
  | 'techniques'
  | 'ingredients'
  | 'equipment'
  | 'nutrition'
  | 'seasonal'
  | 'culture'

export interface ShoppingList {
  id: string
  userId: string
  name: string
  items: ShoppingItem[]
  createdAt: Date
  updatedAt: Date
}

export interface ShoppingItem {
  id: string
  ingredient: Ingredient
  checked: boolean
  recipeId?: string
  estimatedPrice?: number
}

export interface Review {
  id: string
  userId: string
  recipeId: string
  rating: number // 1-5
  comment?: string
  images?: RecipeImage[]
  helpful: number
  createdAt: Date
}

export interface CookingSession {
  id: string
  userId: string
  recipeId: string
  currentStep: number
  startedAt: Date
  completedAt?: Date
  notes?: string
  modifications?: string[]
}

// UI Component Props
export interface RecipeCardProps {
  recipe: Recipe
  onSave?: (recipe: Recipe) => void
  onShare?: (recipe: Recipe) => void
  className?: string
}

export interface IngredientListProps {
  ingredients: Ingredient[]
  servings: number
  onAddToShoppingList?: (ingredients: Ingredient[]) => void
}

export interface InstructionStepProps {
  instruction: Instruction
  isActive?: boolean
  onComplete?: () => void
  onPrevious?: () => void
  onNext?: () => void
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  cuisine?: string[]
  dietary?: DietaryRestriction[]
  difficulty?: SkillLevel[]
  maxPrepTime?: number
  maxCookTime?: number
  ingredients?: string[]
  rating?: number
}

export interface SearchResult {
  recipes: Recipe[]
  blogPosts: BlogPost[]
  totalCount: number
}

// State Management Types
export interface AppState {
  user: User | null
  isAuthenticated: boolean
  preferences: UserPreferences | null
  shoppingLists: ShoppingList[]
  currentCookingSession: CookingSession | null
}

export interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  loading: boolean
  error: string | null
}