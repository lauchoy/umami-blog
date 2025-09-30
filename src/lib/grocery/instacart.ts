import { GroceryItem, GroceryStore, GrocerySearchParams, GrocerySearchResult } from './types'

const INSTACART_API_BASE = 'https://api.instacart.com/v2'

interface InstacartItem {
  id: string
  name: string
  brand: string
  price: number
  size: string
  availability: boolean
  store_id: string
  image_url: string
  unit: string
}

interface InstacartStore {
  id: string
  name: string
  logo: string
  delivery_available: boolean
  pickup_available: boolean
  delivery_fee: number
  minimum_order: number
}

class InstacartAPI {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.INSTACART_API_KEY || ''
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.apiKey) {
      // Mock data for development
      return this.getMockData(endpoint, params)
    }

    const url = new URL(`${INSTACART_API_BASE}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Instacart API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Instacart API request failed:', error)
      // Fallback to mock data
      return this.getMockData(endpoint, params)
    }
  }

  private getMockData(endpoint: string, params: Record<string, any>): any {
    // Mock data for development and testing
    if (endpoint === '/search') {
      return {
        items: [
          {
            id: 'inst_1',
            name: params.q || 'Organic Chicken Breast',
            brand: 'Whole Foods',
            price: 8.99,
            size: '1 lb',
            availability: true,
            store_id: 'wf_001',
            image_url: '/api/placeholder/150/150',
            unit: 'lb'
          },
          {
            id: 'inst_2',
            name: params.q || 'Free Range Chicken Breast',
            brand: 'Safeway',
            price: 6.99,
            size: '1 lb',
            availability: true,
            store_id: 'sf_001',
            image_url: '/api/placeholder/150/150',
            unit: 'lb'
          }
        ],
        stores: [
          {
            id: 'wf_001',
            name: 'Whole Foods Market',
            logo: '/api/placeholder/50/50',
            delivery_available: true,
            pickup_available: true,
            delivery_fee: 3.99,
            minimum_order: 35
          },
          {
            id: 'sf_001',
            name: 'Safeway',
            logo: '/api/placeholder/50/50',
            delivery_available: true,
            pickup_available: true,
            delivery_fee: 2.99,
            minimum_order: 25
          }
        ]
      }
    }
    return {}
  }

  async searchItems(params: GrocerySearchParams): Promise<GrocerySearchResult> {
    const searchParams = {
      q: params.query,
      location: params.location,
      max_price: params.maxPrice,
      stores: params.stores?.join(','),
      organic: params.organic,
      sort: params.sort
    }

    const startTime = Date.now()
    const data = await this.makeRequest('/search', searchParams)
    const searchTime = Date.now() - startTime

    const stores = new Map<string, GroceryStore>()
    data.stores?.forEach((store: InstacartStore) => {
      stores.set(store.id, {
        id: store.id,
        name: store.name,
        logo: store.logo,
        type: 'grocery',
        deliveryAvailable: store.delivery_available,
        pickupAvailable: store.pickup_available,
        minimumOrder: store.minimum_order,
        deliveryFee: store.delivery_fee,
        estimatedDeliveryTime: '1-2 hours'
      })
    })

    const items: GroceryItem[] = data.items?.map((item: InstacartItem) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      size: item.size,
      price: item.price,
      currency: 'USD',
      availability: item.availability ? 'in_stock' : 'out_of_stock',
      store: stores.get(item.store_id) || {
        id: item.store_id,
        name: 'Unknown Store',
        type: 'grocery',
        deliveryAvailable: true,
        pickupAvailable: true
      },
      imageUrl: item.image_url,
      unit: item.unit,
      unitPrice: item.price // Assuming price is per unit
    })) || []

    return {
      items,
      totalResults: items.length,
      searchTime,
      suggestions: []
    }
  }

  async getStores(location: string): Promise<GroceryStore[]> {
    const data = await this.makeRequest('/stores', { location })

    return data.stores?.map((store: InstacartStore) => ({
      id: store.id,
      name: store.name,
      logo: store.logo,
      type: 'grocery' as const,
      deliveryAvailable: store.delivery_available,
      pickupAvailable: store.pickup_available,
      minimumOrder: store.minimum_order,
      deliveryFee: store.delivery_fee,
      estimatedDeliveryTime: '1-2 hours'
    })) || []
  }
}

export const instacartAPI = new InstacartAPI()
export default InstacartAPI