import { analytics } from './firebase/config'
import { logEvent, Analytics } from 'firebase/analytics'

// Track page views
export const trackPageView = async (page: string, title?: string) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'page_view', {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: page
      })
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}

// Track recipe interactions
export const trackRecipeEvent = async (action: string, recipeId: string, recipeTitle?: string) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'recipe_interaction', {
        action,
        recipe_id: recipeId,
        recipe_title: recipeTitle,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Recipe analytics tracking failed:', error)
  }
}

// Track cooking session events
export const trackCookingSession = async (action: 'start' | 'complete' | 'abandon', recipeId: string, sessionData?: any) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'cooking_session', {
        action,
        recipe_id: recipeId,
        session_duration: sessionData?.duration,
        steps_completed: sessionData?.stepsCompleted,
        difficulty: sessionData?.difficulty,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Cooking session analytics tracking failed:', error)
  }
}

// Track search events
export const trackSearch = async (query: string, filters?: any, resultCount?: number) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'search', {
        search_term: query,
        filters: JSON.stringify(filters || {}),
        result_count: resultCount,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Search analytics tracking failed:', error)
  }
}

// Track shopping list events
export const trackShoppingList = async (action: 'create' | 'add_item' | 'remove_item' | 'complete', data?: any) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'shopping_list', {
        action,
        item_count: data?.itemCount,
        recipe_id: data?.recipeId,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Shopping list analytics tracking failed:', error)
  }
}

// Track user engagement
export const trackEngagement = async (feature: string, value?: number, metadata?: any) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'user_engagement', {
        engagement_time_msec: value,
        feature,
        metadata: JSON.stringify(metadata || {}),
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Engagement analytics tracking failed:', error)
  }
}

// Track conversion events
export const trackConversion = async (type: 'recipe_save' | 'recipe_rate' | 'signup' | 'subscription', value?: number) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'conversion', {
        conversion_type: type,
        value,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Conversion analytics tracking failed:', error)
  }
}

// Track performance metrics
export const trackPerformance = async (metric: string, value: number, metadata?: any) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'performance_metric', {
        metric_name: metric,
        metric_value: value,
        metadata: JSON.stringify(metadata || {}),
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('Performance analytics tracking failed:', error)
  }
}

// Track errors
export const trackError = async (error: Error, context?: string, metadata?: any) => {
  if (typeof window === 'undefined') return

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'exception', {
        description: error.message,
        fatal: false,
        context,
        metadata: JSON.stringify(metadata || {}),
        timestamp: Date.now()
      })
    }
  } catch (analyticsError) {
    console.warn('Error analytics tracking failed:', analyticsError)
  }
}

// Custom hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView,
    trackRecipeEvent,
    trackCookingSession,
    trackSearch,
    trackShoppingList,
    trackEngagement,
    trackConversion,
    trackPerformance,
    trackError,
  }
}