'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ShoppingCartIcon,
  ScaleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  TruckIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { groceryService, PriceComparison, ShoppingList, GroceryStore } from '@/lib/grocery'

interface Ingredient {
  _key: string
  name: string
  amount: number
  unit: string
  notes?: string
  optional?: boolean
}

interface RecipeIngredientsProps {
  ingredients: Ingredient[]
  servings: number
}

export default function RecipeIngredients({
  ingredients,
  servings: originalServings
}: RecipeIngredientsProps) {
  const [currentServings, setCurrentServings] = useState(originalServings)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [showPriceComparison, setShowPriceComparison] = useState(false)
  const [priceComparisons, setPriceComparisons] = useState<Map<string, PriceComparison>>(new Map())
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [availableStores, setAvailableStores] = useState<GroceryStore[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [userLocation, setUserLocation] = useState<string>('')
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)
  const [generatingList, setGeneratingList] = useState(false)

  const scalingFactor = currentServings / originalServings

  const handleServingChange = (increment: boolean) => {
    if (increment) {
      setCurrentServings(prev => prev + 1)
    } else if (currentServings > 1) {
      setCurrentServings(prev => prev - 1)
    }
  }

  const toggleIngredient = (key: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(key)) {
      newChecked.delete(key)
    } else {
      newChecked.add(key)
    }
    setCheckedIngredients(newChecked)
  }

  useEffect(() => {
    // Try to get user's location for better store results
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation(`${latitude},${longitude}`)
        },
        () => {
          // Fallback to a default location (San Francisco)
          setUserLocation('37.7749,-122.4194')
        }
      )
    } else {
      setUserLocation('37.7749,-122.4194')
    }
  }, [])

  useEffect(() => {
    if (userLocation) {
      loadAvailableStores()
    }
  }, [userLocation])

  const loadAvailableStores = async () => {
    try {
      const stores = await groceryService.getAvailableStores(userLocation)
      setAvailableStores(stores)
      if (stores.length > 0) {
        setSelectedStore(stores[0].id)
      }
    } catch (error) {
      console.error('Error loading stores:', error)
    }
  }

  const loadPriceComparisons = async () => {
    setLoadingPrices(true)
    const comparisons = new Map<string, PriceComparison>()

    // Load price comparisons for each ingredient
    const promises = ingredients.slice(0, 5).map(async (ingredient) => {
      try {
        const comparison = await groceryService.compareIngredientPrices(
          ingredient.name,
          userLocation
        )
        comparisons.set(ingredient._key, comparison)
      } catch (error) {
        console.error(`Error getting prices for ${ingredient.name}:`, error)
      }
    })

    await Promise.all(promises)
    setPriceComparisons(comparisons)
    setLoadingPrices(false)
  }

  const createShoppingList = async () => {
    setGeneratingList(true)
    try {
      const scaledIngredients = ingredients.map(ingredient => ({
        ...ingredient,
        amount: ingredient.amount * scalingFactor
      }))

      const list = await groceryService.createShoppingListFromIngredients(
        scaledIngredients,
        userLocation
      )

      setShoppingList(list)
    } catch (error) {
      console.error('Error creating shopping list:', error)
    } finally {
      setGeneratingList(false)
    }
  }

  const addToShoppingList = () => {
    setShowPriceComparison(true)
    if (priceComparisons.size === 0) {
      loadPriceComparisons()
    }
  }

  const formatAmount = (amount: number, unit: string) => {
    const scaledAmount = amount * scalingFactor

    // Handle fractional amounts nicely
    if (scaledAmount < 1) {
      // Convert to fraction for small amounts
      if (scaledAmount === 0.5) return '½'
      if (scaledAmount === 0.25) return '¼'
      if (scaledAmount === 0.75) return '¾'
      if (scaledAmount === 0.33) return '⅓'
      if (scaledAmount === 0.67) return '⅔'
      return scaledAmount.toFixed(2)
    }

    // For larger amounts, show decimals only if needed
    return scaledAmount % 1 === 0
      ? scaledAmount.toString()
      : scaledAmount.toFixed(1)
  }

  const getCompletionPercentage = () => {
    if (ingredients.length === 0) return 0
    return Math.round((checkedIngredients.size / ingredients.length) * 100)
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ScaleIcon className="h-5 w-5" />
            Ingredients
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {getCompletionPercentage()}% ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Serving Size Adjuster */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Servings</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleServingChange(false)}
                disabled={currentServings <= 1}
                className="h-8 w-8 p-0"
              >
                <MinusCircleIcon className="h-4 w-4" />
              </Button>
              <span className="font-semibold min-w-[2rem] text-center">
                {currentServings}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleServingChange(true)}
                className="h-8 w-8 p-0"
              >
                <PlusCircleIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {currentServings !== originalServings && (
            <p className="text-xs text-gray-500">
              Scaled from {originalServings} servings
            </p>
          )}
        </div>

        {/* Ingredients List */}
        <div className="space-y-3">
          {ingredients.map((ingredient) => {
            const isChecked = checkedIngredients.has(ingredient._key)

            return (
              <div
                key={ingredient._key}
                className={`flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors ${
                  isChecked ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <Checkbox
                  id={ingredient._key}
                  checked={isChecked}
                  onCheckedChange={() => toggleIngredient(ingredient._key)}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={ingredient._key}
                    className={`block cursor-pointer ${
                      isChecked ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {formatAmount(ingredient.amount, ingredient.unit)} {ingredient.unit}
                      </span>
                      {ingredient.optional && (
                        <Badge variant="outline" className="text-xs ml-2">
                          Optional
                        </Badge>
                      )}
                    </div>
                    <span className={`text-sm ${isChecked ? 'text-gray-400' : 'text-gray-700'}`}>
                      {ingredient.name}
                    </span>
                    {ingredient.notes && (
                      <p className={`text-xs mt-1 ${isChecked ? 'text-gray-400' : 'text-gray-500'}`}>
                        {ingredient.notes}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            )
          })}
        </div>

        {/* Price Comparison Preview */}
        {priceComparisons.size > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 text-sm mb-2">💰 Best Prices Found</h4>
            <div className="space-y-2">
              {Array.from(priceComparisons.entries()).slice(0, 3).map(([key, comparison]) => {
                const ingredient = ingredients.find(i => i._key === key)
                if (!ingredient) return null

                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-green-800">{ingredient.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">${comparison.bestPrice.price.toFixed(2)}</span>
                      <span className="text-green-600">{comparison.bestPrice.store.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Add to Shopping List */}
        <Button onClick={addToShoppingList} className="w-full" size="lg">
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Compare Prices & Shop
        </Button>

        {/* Ingredient Categories */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Quick Categories</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
              Pantry Items
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
              Fresh Produce
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
              Proteins
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
              Dairy
            </Badge>
          </div>
        </div>

        {/* Shopping Tips */}
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 text-sm mb-1">Shopping Tip</h4>
          <p className="text-xs text-blue-700">
            Check your pantry first! You might already have some of these ingredients.
          </p>
        </div>
      </CardContent>

      {/* Price Comparison Dialog */}
      <Dialog open={showPriceComparison} onOpenChange={setShowPriceComparison}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5" />
              Price Comparison & Shopping
            </DialogTitle>
            <DialogDescription>
              Compare prices across stores and create your shopping list
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Store Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Shopping near you</span>
              </div>
              <div className="flex gap-2">
                {availableStores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selectedStore === store.id
                        ? 'bg-umami-sage text-white border-umami-sage'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-umami-sage'
                    }`}
                  >
                    {store.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Comparisons */}
            {loadingPrices ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Loading price comparisons...</h3>
                {ingredients.slice(0, 5).map((ingredient) => (
                  <div key={ingredient._key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded p-3">
                          <Skeleton className="h-16 w-full mb-2" />
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : priceComparisons.size > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Price Comparisons</h3>
                {Array.from(priceComparisons.entries()).map(([key, comparison]) => {
                  const ingredient = ingredients.find(i => i._key === key)
                  if (!ingredient) return null

                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{ingredient.name}</h4>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Need: {formatAmount(ingredient.amount, ingredient.unit)} {ingredient.unit}
                          </div>
                          {comparison.savings && comparison.savings > 0 && (
                            <div className="text-xs text-green-600">
                              Save up to ${comparison.savings.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {comparison.items.slice(0, 3).map((item, index) => (
                          <div
                            key={item.id}
                            className={`border rounded p-3 relative ${
                              index === 0
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            {index === 0 && (
                              <Badge className="absolute -top-2 -right-2 bg-green-500">
                                Best Price
                              </Badge>
                            )}

                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-16 object-cover rounded mb-2"
                              />
                            )}

                            <div className="space-y-1">
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-gray-600">{item.brand}</div>
                              <div className="text-xs text-gray-500">{item.size}</div>

                              <div className="flex items-center justify-between">
                                <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                                <div className="text-xs text-gray-500">
                                  {item.unitPrice && (
                                    <div>${item.unitPrice.toFixed(2)}/{item.unit}</div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <BuildingStorefrontIcon className="h-3 w-3" />
                                <span className="text-xs font-medium">{item.store.name}</span>
                                {item.store.deliveryAvailable && (
                                  <TruckIcon className="h-3 w-3 text-green-500" />
                                )}
                              </div>

                              <div className={`text-xs ${
                                item.availability === 'in_stock'
                                  ? 'text-green-600'
                                  : item.availability === 'limited'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                {item.availability === 'in_stock'
                                  ? '✓ In Stock'
                                  : item.availability === 'limited'
                                  ? '⚠ Limited Stock'
                                  : '✗ Out of Stock'
                                }
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CurrencyDollarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Click &quot;Load Price Comparisons&quot; to see prices from different stores</p>
                <Button
                  onClick={loadPriceComparisons}
                  className="mt-4"
                  disabled={loadingPrices}
                >
                  Load Price Comparisons
                </Button>
              </div>
            )}

            {/* Shopping List Generation */}
            {priceComparisons.size > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Create Shopping List</h3>
                  {shoppingList && (
                    <Badge variant="outline">
                      Total: ${shoppingList.totalPrice.toFixed(2)}
                    </Badge>
                  )}
                </div>

                {shoppingList ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingCartIcon className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Shopping list created with {shoppingList.items.length} items
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {shoppingList.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span>{item.ingredient}</span>
                          <span>
                            {item.groceryItem
                              ? `$${item.groceryItem.price.toFixed(2)} at ${item.groceryItem.store.name}`
                              : 'Price not available'
                            }
                          </span>
                        </div>
                      ))}
                      {shoppingList.items.length > 3 && (
                        <div className="text-xs text-gray-600">
                          +{shoppingList.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        View Full List
                      </Button>
                      <Button size="sm" variant="outline">
                        Export List
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={createShoppingList}
                    disabled={generatingList}
                    className="w-full"
                  >
                    {generatingList ? 'Creating List...' : 'Create Smart Shopping List'}
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPriceComparison(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}