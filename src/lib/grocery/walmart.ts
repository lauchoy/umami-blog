import { GroceryItem, GroceryStore, GrocerySearchParams, GrocerySearchResult } from './types'

const WALMART_API_BASE = 'https://api.walmart.com/v1'

interface WalmartItem {
  itemId: string
  name: string
  shortDescription: string
  longDescription: string
  salePrice: number
  msrp: number
  categoryPath: string
  brandName: string
  thumbnailImage: string
  largeImage: string
  stock: string
  size?: string
  upc?: string
}

interface WalmartResponse {
  items: WalmartItem[]
  totalResults: number
  start: number
  numItems: number
}

class WalmartAPI {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WALMART_API_KEY || ''
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.apiKey) {
      // Mock data for development
      return this.getMockData(endpoint, params)
    }

    const url = new URL(`${WALMART_API_BASE}${endpoint}`)
    url.searchParams.append('apiKey', this.apiKey)
    url.searchParams.append('format', 'json')

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Walmart API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Walmart API request failed:', error)
      // Fallback to mock data
      return this.getMockData(endpoint, params)
    }
  }

  private getMockData(endpoint: string, params: Record<string, any>): WalmartResponse {
    // Mock data for development and testing
    const query = params.query || 'chicken breast'

    return {
      items: [
        {
          itemId: 'wm_12345',
          name: `Great Value ${query}`,
          shortDescription: `Fresh ${query} - Value Pack`,
          longDescription: `High quality ${query} perfect for any meal`,
          salePrice: 4.99,
          msrp: 6.99,
          categoryPath: 'Food/Meat & Seafood/Chicken',
          brandName: 'Great Value',
          thumbnailImage: '/api/placeholder/150/150',
          largeImage: '/api/placeholder/300/300',
          stock: 'Available',
          size: '2.5 lb',
          upc: '123456789012'
        },
        {
          itemId: 'wm_12346',
          name: `Organic ${query}`,
          shortDescription: `Organic ${query} - Free Range`,
          longDescription: `Premium organic ${query} from free-range farms`,
          salePrice: 9.99,
          msrp: 11.99,
          categoryPath: 'Food/Meat & Seafood/Chicken',
          brandName: 'Marketside',
          thumbnailImage: '/api/placeholder/150/150',
          largeImage: '/api/placeholder/300/300',
          stock: 'Available',
          size: '1.5 lb',
          upc: '123456789013'
        }
      ],
      totalResults: 2,
      start: 1,
      numItems: 2
    }
  }

  async searchItems(params: GrocerySearchParams): Promise<GrocerySearchResult> {
    const searchParams = {
      query: params.query,
      categoryId: this.getCategoryId(params.query),
      start: 1,
      numItems: 25,
      sort: this.mapSortParam(params.sort)
    }

    const startTime = Date.now()
    const data = await this.makeRequest('/search', searchParams)
    const searchTime = Date.now() - startTime

    const walmartStore: GroceryStore = {
      id: 'walmart',
      name: 'Walmart',
      logo: '/api/placeholder/50/50',
      type: 'warehouse',
      deliveryAvailable: true,
      pickupAvailable: true,
      minimumOrder: 35,
      deliveryFee: 9.95,
      estimatedDeliveryTime: '1-3 days'
    }

    const items: GroceryItem[] = data.items?.map((item: WalmartItem) => ({
      id: item.itemId,
      name: item.name,
      brand: item.brandName,
      size: item.size || 'Standard',
      price: item.salePrice,
      currency: 'USD',
      availability: item.stock === 'Available' ? 'in_stock' : 'out_of_stock',
      store: walmartStore,
      imageUrl: item.thumbnailImage,
      rating: Math.random() * 2 + 3, // Mock rating 3-5
      reviewCount: Math.floor(Math.random() * 1000),
      unit: this.extractUnit(item.name, item.size),
      unitPrice: this.calculateUnitPrice(item.salePrice, item.size)
    })) || []

    return {
      items,
      totalResults: data.totalResults || 0,
      searchTime,
      suggestions: this.generateSuggestions(params.query)
    }
  }

  private getCategoryId(query: string): string {
    const categories: Record<string, string> = {
      'chicken': '976759',
      'beef': '976760',
      'pork': '976761',
      'fish': '976762',
      'vegetables': '976781',
      'fruits': '976782',
      'dairy': '976783',
      'bread': '976784'
    }

    const lowerQuery = query.toLowerCase()
    for (const [key, categoryId] of Object.entries(categories)) {
      if (lowerQuery.includes(key)) {
        return categoryId
      }
    }

    return '976759' // Default to meat category
  }

  private mapSortParam(sort?: string): string {
    switch (sort) {
      case 'price':
        return 'price_low'
      case 'rating':
        return 'best_match'
      default:
        return 'relevance'
    }
  }

  private extractUnit(name: string, size?: string): string {
    const text = `${name} ${size || ''}`.toLowerCase()

    if (text.includes('lb') || text.includes('pound')) return 'lb'
    if (text.includes('oz') || text.includes('ounce')) return 'oz'
    if (text.includes('gal') || text.includes('gallon')) return 'gal'
    if (text.includes('qt') || text.includes('quart')) return 'qt'
    if (text.includes('pt') || text.includes('pint')) return 'pt'
    if (text.includes('cup')) return 'cup'
    if (text.includes('kg') || text.includes('kilogram')) return 'kg'
    if (text.includes('g') || text.includes('gram')) return 'g'
    if (text.includes('ml') || text.includes('milliliter')) return 'ml'
    if (text.includes('l') || text.includes('liter')) return 'l'

    return 'each'
  }

  private calculateUnitPrice(price: number, size?: string): number {
    if (!size) return price

    const sizeNum = parseFloat(size)
    if (isNaN(sizeNum)) return price

    return price / sizeNum
  }

  private generateSuggestions(query: string): string[] {
    const baseSuggestions = [
      'organic',
      'fresh',
      'frozen',
      'boneless',
      'skinless',
      'free range',
      'grass fed'
    ]

    return baseSuggestions
      .map(suggestion => `${suggestion} ${query}`)
      .slice(0, 3)
  }
}

export const walmartAPI = new WalmartAPI()
export default WalmartAPI