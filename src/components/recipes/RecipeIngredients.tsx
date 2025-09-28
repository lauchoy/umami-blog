'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCartIcon,
  ScaleIcon,
  PlusCircleIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline'

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

  const addToShoppingList = () => {
    // TODO: Implement add to shopping list functionality
    console.log('Adding ingredients to shopping list:', ingredients)
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

        {/* Add to Shopping List */}
        <Button onClick={addToShoppingList} className="w-full" size="lg">
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Add to Shopping List
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
    </Card>
  )
}