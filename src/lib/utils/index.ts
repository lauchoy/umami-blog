import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}m`
}

export function formatServings(servings: number): string {
  return servings === 1 ? '1 serving' : `${servings} servings`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateNutritionPerServing(
  nutrition: any,
  originalServings: number,
  currentServings: number
) {
  const ratio = currentServings / originalServings
  return {
    calories: Math.round(nutrition.calories * ratio),
    protein: Math.round(nutrition.protein * ratio * 10) / 10,
    carbs: Math.round(nutrition.carbs * ratio * 10) / 10,
    fat: Math.round(nutrition.fat * ratio * 10) / 10,
    fiber: Math.round(nutrition.fiber * ratio * 10) / 10,
    sugar: Math.round(nutrition.sugar * ratio * 10) / 10,
    sodium: Math.round(nutrition.sodium * ratio),
  }
}

export function scaleIngredients(ingredients: any[], originalServings: number, newServings: number) {
  const ratio = newServings / originalServings
  return ingredients.map(ingredient => ({
    ...ingredient,
    amount: Math.round(ingredient.amount * ratio * 100) / 100,
  }))
}

export function formatIngredientAmount(amount: number, unit: string): string {
  // Handle fractional amounts for common cooking measurements
  if (unit === 'cup' || unit === 'cups') {
    if (amount === 0.25) return '¼'
    if (amount === 0.33) return '⅓'
    if (amount === 0.5) return '½'
    if (amount === 0.67) return '⅔'
    if (amount === 0.75) return '¾'
  }

  if (amount === Math.floor(amount)) {
    return amount.toString()
  }

  return amount.toFixed(2).replace(/\.?0+$/, '')
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  if (content.length <= maxLength) return content

  const truncated = content.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }

  return truncated + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}