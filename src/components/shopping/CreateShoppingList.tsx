'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, ShoppingCart } from 'lucide-react'

interface CreateShoppingListProps {
  onCreateList: (name: string) => Promise<void>
  creating: boolean
}

const suggestedNames = [
  'Weekly Groceries',
  'Dinner Party Shopping',
  'Meal Prep Ingredients',
  'Breakfast Essentials',
  'Healthy Snacks',
  'Baking Supplies',
  'Quick Meals',
  'Holiday Cooking'
]

export default function CreateShoppingList({
  onCreateList,
  creating
}: CreateShoppingListProps) {
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      await onCreateList(name.trim())
      setName('')
    }
  }

  const handleSuggestedName = (suggestedName: string) => {
    setName(suggestedName)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="listName">List Name</Label>
        <Input
          id="listName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter list name..."
          disabled={creating}
          autoFocus
        />
      </div>

      {/* Suggested Names */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Quick suggestions:
        </Label>
        <div className="flex flex-wrap gap-2">
          {suggestedNames.map((suggestedName) => (
            <button
              key={suggestedName}
              type="button"
              onClick={() => handleSuggestedName(suggestedName)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              disabled={creating}
            >
              {suggestedName}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {name && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-5 w-5 text-umami-sage" />
            <div>
              <p className="font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-600">0 items • Created just now</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={!name.trim() || creating}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{creating ? 'Creating...' : 'Create List'}</span>
        </Button>
      </div>
    </form>
  )
}