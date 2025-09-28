'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface AdvancedSearchFilters {
  query: string
  includeIngredients: string[]
  excludeIngredients: string[]
  cuisines: string[]
  difficulties: string[]
  dietaryTags: string[]
  timeRange: [number, number]
  servings: [number, number]
  rating: number
  sortBy: string
  equipment: string[]
  techniques: string[]
}

const defaultFilters: AdvancedSearchFilters = {
  query: '',
  includeIngredients: [],
  excludeIngredients: [],
  cuisines: [],
  difficulties: [],
  dietaryTags: [],
  timeRange: [0, 180],
  servings: [1, 12],
  rating: 0,
  sortBy: 'relevance',
  equipment: [],
  techniques: []
}

const cuisineOptions = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
  'Mediterranean', 'French', 'American', 'Korean', 'Vietnamese', 'Greek'
]


const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto',
  'Paleo', 'Low-carb', 'Low-sodium', 'Nut-free', 'Soy-free'
]

const equipmentOptions = [
  'Oven', 'Stovetop', 'Slow Cooker', 'Pressure Cooker', 'Air Fryer',
  'Grill', 'Food Processor', 'Blender', 'Stand Mixer', 'No Special Equipment'
]

const techniqueOptions = [
  'Baking', 'Roasting', 'Grilling', 'Sautéing', 'Steaming',
  'Braising', 'Frying', 'Poaching', 'Smoking', 'Fermenting'
]

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'time', label: 'Quickest First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
]

interface AdvancedSearchProps {
  children: React.ReactNode
}

export default function AdvancedSearch({ children }: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState<AdvancedSearchFilters>(() => ({
    query: searchParams.get('q') || '',
    includeIngredients: searchParams.get('include')?.split(',').filter(Boolean) || [],
    excludeIngredients: searchParams.get('exclude')?.split(',').filter(Boolean) || [],
    cuisines: searchParams.get('cuisine')?.split(',').filter(Boolean) || [],
    difficulties: searchParams.get('difficulty')?.split(',').filter(Boolean) || [],
    dietaryTags: searchParams.get('dietary')?.split(',').filter(Boolean) || [],
    timeRange: [
      parseInt(searchParams.get('minTime') || '0'),
      parseInt(searchParams.get('maxTime') || '180')
    ],
    servings: [
      parseInt(searchParams.get('minServings') || '1'),
      parseInt(searchParams.get('maxServings') || '12')
    ],
    rating: parseInt(searchParams.get('minRating') || '0'),
    sortBy: searchParams.get('sort') || 'relevance',
    equipment: searchParams.get('equipment')?.split(',').filter(Boolean) || [],
    techniques: searchParams.get('techniques')?.split(',').filter(Boolean) || []
  }))

  const [ingredientInput, setIngredientInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')

  const addIngredient = (ingredient: string, type: 'include' | 'exclude') => {
    if (!ingredient.trim()) return

    const key = type === 'include' ? 'includeIngredients' : 'excludeIngredients'
    setFilters(prev => ({
      ...prev,
      [key]: [...prev[key], ingredient.trim()]
    }))

    if (type === 'include') {
      setIngredientInput('')
    } else {
      setExcludeInput('')
    }
  }

  const removeIngredient = (ingredient: string, type: 'include' | 'exclude') => {
    const key = type === 'include' ? 'includeIngredients' : 'excludeIngredients'
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].filter(i => i !== ingredient)
    }))
  }

  const toggleArrayFilter = (value: string, key: keyof AdvancedSearchFilters) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]

      return { ...prev, [key]: newArray }
    })
  }

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()

    // Add query
    if (filters.query) params.set('q', filters.query)

    // Add ingredients
    if (filters.includeIngredients.length > 0) {
      params.set('include', filters.includeIngredients.join(','))
    }
    if (filters.excludeIngredients.length > 0) {
      params.set('exclude', filters.excludeIngredients.join(','))
    }

    // Add filters
    if (filters.cuisines.length > 0) params.set('cuisine', filters.cuisines.join(','))
    if (filters.difficulties.length > 0) params.set('difficulty', filters.difficulties.join(','))
    if (filters.dietaryTags.length > 0) params.set('dietary', filters.dietaryTags.join(','))
    if (filters.equipment.length > 0) params.set('equipment', filters.equipment.join(','))
    if (filters.techniques.length > 0) params.set('techniques', filters.techniques.join(','))

    // Add ranges
    if (filters.timeRange[0] > 0 || filters.timeRange[1] < 180) {
      params.set('minTime', filters.timeRange[0].toString())
      params.set('maxTime', filters.timeRange[1].toString())
    }
    if (filters.servings[0] > 1 || filters.servings[1] < 12) {
      params.set('minServings', filters.servings[0].toString())
      params.set('maxServings', filters.servings[1].toString())
    }
    if (filters.rating > 0) {
      params.set('minRating', filters.rating.toString())
    }

    // Add sort
    if (filters.sortBy !== 'relevance') {
      params.set('sort', filters.sortBy)
    }

    router.push(`/recipes?${params.toString()}`)
    setOpen(false)
  }, [filters, router])

  const clearFilters = () => {
    setFilters(defaultFilters)
    setIngredientInput('')
    setExcludeInput('')
  }

  const hasActiveFilters = filters.query ||
    filters.includeIngredients.length > 0 ||
    filters.excludeIngredients.length > 0 ||
    filters.cuisines.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.dietaryTags.length > 0 ||
    filters.equipment.length > 0 ||
    filters.techniques.length > 0 ||
    filters.timeRange[0] > 0 ||
    filters.timeRange[1] < 180 ||
    filters.servings[0] > 1 ||
    filters.servings[1] < 12 ||
    filters.rating > 0 ||
    filters.sortBy !== 'relevance'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
          <DialogDescription>
            Find exactly what you&apos;re looking for with detailed search filters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search recipes, dishes, or keywords..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Include Ingredients */}
            <div className="space-y-3">
              <Label>Must Include Ingredients</Label>
              <div className="flex gap-2">
                <Input
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add ingredient..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addIngredient(ingredientInput, 'include')
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addIngredient(ingredientInput, 'include')}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.includeIngredients.map(ingredient => (
                  <Badge key={ingredient} variant="default">
                    {ingredient}
                    <XMarkIcon
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeIngredient(ingredient, 'include')}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Exclude Ingredients */}
            <div className="space-y-3">
              <Label>Must NOT Include</Label>
              <div className="flex gap-2">
                <Input
                  value={excludeInput}
                  onChange={(e) => setExcludeInput(e.target.value)}
                  placeholder="Exclude ingredient..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addIngredient(excludeInput, 'exclude')
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addIngredient(excludeInput, 'exclude')}
                  size="sm"
                  variant="destructive"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.excludeIngredients.map(ingredient => (
                  <Badge key={ingredient} variant="destructive">
                    {ingredient}
                    <XMarkIcon
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeIngredient(ingredient, 'exclude')}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cuisines */}
            <div className="space-y-3">
              <Label>Cuisines</Label>
              <div className="grid grid-cols-2 gap-2">
                {cuisineOptions.map(cuisine => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={`adv-cuisine-${cuisine}`}
                      checked={filters.cuisines.includes(cuisine)}
                      onCheckedChange={() => toggleArrayFilter(cuisine, 'cuisines')}
                    />
                    <Label htmlFor={`adv-cuisine-${cuisine}`} className="text-sm">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-3">
              <Label>Dietary Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`adv-dietary-${tag}`}
                      checked={filters.dietaryTags.includes(tag)}
                      onCheckedChange={() => toggleArrayFilter(tag, 'dietaryTags')}
                    />
                    <Label htmlFor={`adv-dietary-${tag}`} className="text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment */}
            <div className="space-y-3">
              <Label>Required Equipment</Label>
              <div className="grid grid-cols-1 gap-2">
                {equipmentOptions.map(equipment => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={`adv-equipment-${equipment}`}
                      checked={filters.equipment.includes(equipment)}
                      onCheckedChange={() => toggleArrayFilter(equipment, 'equipment')}
                    />
                    <Label htmlFor={`adv-equipment-${equipment}`} className="text-sm">
                      {equipment}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Techniques */}
            <div className="space-y-3">
              <Label>Cooking Techniques</Label>
              <div className="grid grid-cols-2 gap-2">
                {techniqueOptions.map(technique => (
                  <div key={technique} className="flex items-center space-x-2">
                    <Checkbox
                      id={`adv-technique-${technique}`}
                      checked={filters.techniques.includes(technique)}
                      onCheckedChange={() => toggleArrayFilter(technique, 'techniques')}
                    />
                    <Label htmlFor={`adv-technique-${technique}`} className="text-sm">
                      {technique}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time Range */}
            <div className="space-y-3">
              <Label>Cooking Time (minutes)</Label>
              <div className="px-2">
                <Slider
                  value={filters.timeRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value as [number, number] }))}
                  max={180}
                  min={0}
                  step={5}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{filters.timeRange[0]} min</span>
                <span>{filters.timeRange[1]}+ min</span>
              </div>
            </div>

            {/* Servings */}
            <div className="space-y-3">
              <Label>Number of Servings</Label>
              <div className="px-2">
                <Slider
                  value={filters.servings}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, servings: value as [number, number] }))}
                  max={12}
                  min={1}
                  step={1}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{filters.servings[0]}</span>
                <span>{filters.servings[1]}+ servings</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <Label>Minimum Rating</Label>
              <Select
                value={filters.rating.toString()}
                onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="1">1+ stars</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="5">5 stars only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort Results By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSearch}>
              Search Recipes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}