import { instacartAPI } from './instacart'
import { walmartAPI } from './walmart'
import {
  GrocerySearchParams,
  GrocerySearchResult,
  GroceryItem,
  PriceComparison,
  ShoppingList,
  ShoppingListItem,
  GroceryStore
} from './types'

export * from './types'

interface Ingredient {
  _key: string
  name: string
  amount: number
  unit: string
  notes?: string
  optional?: boolean
}

class GroceryService {
  private apis = {
    instacart: instacartAPI,
    walmart: walmartAPI
  }

  async searchAllStores(params: GrocerySearchParams): Promise<GrocerySearchResult> {
    const searches = await Promise.allSettled([
      this.apis.instacart.searchItems(params),
      this.apis.walmart.searchItems(params)
    ])

    const allItems: GroceryItem[] = []
    let totalResults = 0
    let totalSearchTime = 0

    searches.forEach((result) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value.items)
        totalResults += result.value.totalResults
        totalSearchTime += result.value.searchTime
      }
    })

    // Remove duplicates and sort by price
    const uniqueItems = this.removeDuplicates(allItems)
    const sortedItems = this.sortItems(uniqueItems, params.sort || 'price')

    return {
      items: sortedItems,
      totalResults,
      searchTime: totalSearchTime / searches.length,
      suggestions: this.generateSuggestions(params.query)
    }
  }

  async searchByStore(store: string, params: GrocerySearchParams): Promise<GrocerySearchResult> {
    const api = this.apis[store as keyof typeof this.apis]
    if (!api) {
      throw new Error(`Unsupported store: ${store}`)
    }

    return api.searchItems(params)
  }

  async compareIngredientPrices(ingredientName: string, location?: string): Promise<PriceComparison> {
    const searchParams: GrocerySearchParams = {
      query: ingredientName,
      location,
      sort: 'price'
    }

    const results = await this.searchAllStores(searchParams)

    if (results.items.length === 0) {
      throw new Error(`No items found for ingredient: ${ingredientName}`)
    }

    const prices = results.items.map(item => item.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

    const bestPrice = results.items.find(item => item.price === minPrice)!
    const savings = maxPrice - minPrice

    return {
      ingredient: ingredientName,
      items: results.items,
      bestPrice,
      averagePrice,
      priceRange: { min: minPrice, max: maxPrice },
      savings
    }
  }

  async createShoppingListFromIngredients(
    ingredients: Ingredient[],
    location?: string
  ): Promise<ShoppingList> {
    const shoppingListItems: ShoppingListItem[] = []

    for (const ingredient of ingredients) {
      try {
        const comparison = await this.compareIngredientPrices(ingredient.name, location)

        const shoppingItem: ShoppingListItem = {
          id: ingredient._key,
          ingredient: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes,
          completed: false,
          groceryItem: comparison.bestPrice,
          alternatives: comparison.items.slice(1, 4) // Top 3 alternatives
        }

        shoppingListItems.push(shoppingItem)
      } catch (error) {
        console.error(`Error finding grocery items for ${ingredient.name}:`, error)

        // Add ingredient without grocery item data
        const shoppingItem: ShoppingListItem = {
          id: ingredient._key,
          ingredient: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes,
          completed: false
        }

        shoppingListItems.push(shoppingItem)
      }
    }

    const totalPrice = shoppingListItems.reduce((total, item) => {
      return total + (item.groceryItem?.price || 0)
    }, 0)

    return {
      id: `shopping_list_${Date.now()}`,
      name: 'Recipe Shopping List',
      items: shoppingListItems,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPrice
    }
  }

  async getAvailableStores(location: string): Promise<GroceryStore[]> {
    const stores: GroceryStore[] = []

    try {
      const instacartStores = await this.apis.instacart.getStores(location)
      stores.push(...instacartStores)
    } catch (error) {
      console.error('Error fetching Instacart stores:', error)
    }

    // Add Walmart as it's generally available
    stores.push({
      id: 'walmart',
      name: 'Walmart',
      logo: '/api/placeholder/50/50',
      type: 'warehouse',
      deliveryAvailable: true,
      pickupAvailable: true,
      minimumOrder: 35,
      deliveryFee: 9.95,
      estimatedDeliveryTime: '1-3 days'
    })

    return stores
  }

  private removeDuplicates(items: GroceryItem[]): GroceryItem[] {
    const seen = new Map<string, GroceryItem>()

    items.forEach(item => {
      const key = `${item.name.toLowerCase()}_${item.brand?.toLowerCase()}_${item.size}`

      if (!seen.has(key) || item.price < seen.get(key)!.price) {
        seen.set(key, item)
      }
    })

    return Array.from(seen.values())
  }

  private sortItems(items: GroceryItem[], sort: string): GroceryItem[] {
    switch (sort) {
      case 'price':
        return items.sort((a, b) => a.price - b.price)
      case 'rating':
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'availability':
        return items.sort((a, b) => {
          const availabilityOrder = { 'in_stock': 0, 'limited': 1, 'out_of_stock': 2 }
          return availabilityOrder[a.availability] - availabilityOrder[b.availability]
        })
      default:
        return items
    }
  }

  private generateSuggestions(query: string): string[] {
    const suggestions = [
      `organic ${query}`,
      `fresh ${query}`,
      `${query} substitute`,
      `${query} alternative`
    ]

    return suggestions.slice(0, 3)
  }
}

export const groceryService = new GroceryService()
export default GroceryService