export interface GroceryItem {
  id: string
  name: string
  brand?: string
  size: string
  price: number
  currency: string
  availability: 'in_stock' | 'out_of_stock' | 'limited'
  store: GroceryStore
  imageUrl?: string
  rating?: number
  reviewCount?: number
  unit: string
  unitPrice?: number // price per unit (e.g., per lb, per oz)
}

export interface GroceryStore {
  id: string
  name: string
  logo?: string
  type: 'grocery' | 'warehouse' | 'organic' | 'convenience'
  deliveryAvailable: boolean
  pickupAvailable: boolean
  minimumOrder?: number
  deliveryFee?: number
  estimatedDeliveryTime?: string
}

export interface GrocerySearchParams {
  query: string
  location?: string
  maxPrice?: number
  stores?: string[]
  organic?: boolean
  sort?: 'price' | 'rating' | 'availability'
}

export interface GrocerySearchResult {
  items: GroceryItem[]
  totalResults: number
  searchTime: number
  suggestions?: string[]
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingListItem[]
  createdAt: Date
  updatedAt: Date
  totalPrice: number
  store?: GroceryStore
}

export interface ShoppingListItem {
  id: string
  ingredient: string
  amount: number
  unit: string
  notes?: string
  completed: boolean
  groceryItem?: GroceryItem
  alternatives?: GroceryItem[]
}

export interface PriceComparison {
  ingredient: string
  items: GroceryItem[]
  bestPrice: GroceryItem
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
  savings?: number
}