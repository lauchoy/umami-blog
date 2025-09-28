'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface FilterOptions {
  cuisines: { name: string; count: number }[]
  difficulties: { name: string; count: number }[]
  dietaryTags: { name: string; count: number }[]
  timeRanges: { name: string; min: number; max: number }[]
}

const defaultFilters: FilterOptions = {
  cuisines: [
    { name: 'Italian', count: 245 },
    { name: 'Mexican', count: 189 },
    { name: 'Chinese', count: 167 },
    { name: 'American', count: 134 },
    { name: 'French', count: 98 },
    { name: 'Japanese', count: 87 },
    { name: 'Mediterranean', count: 76 },
    { name: 'Indian', count: 65 },
  ],
  difficulties: [
    { name: 'Beginner', count: 324 },
    { name: 'Intermediate', count: 267 },
    { name: 'Advanced', count: 89 },
  ],
  dietaryTags: [
    { name: 'Vegetarian', count: 234 },
    { name: 'Gluten-free', count: 189 },
    { name: 'Vegan', count: 156 },
    { name: 'Keto', count: 123 },
    { name: 'Dairy-free', count: 98 },
    { name: 'Low-carb', count: 87 },
    { name: 'Paleo', count: 65 },
  ],
  timeRanges: [
    { name: 'Quick (< 30 min)', min: 0, max: 30 },
    { name: 'Medium (30-60 min)', min: 30, max: 60 },
    { name: 'Long (> 60 min)', min: 60, max: 999 },
  ],
}

export default function RecipeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    searchParams.get('cuisine')?.split(',').filter(Boolean) || []
  )
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    searchParams.get('difficulty')?.split(',').filter(Boolean) || []
  )
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>(
    searchParams.get('dietary')?.split(',').filter(Boolean) || []
  )
  const [timeRange, setTimeRange] = useState<[number, number]>([
    parseInt(searchParams.get('minTime') || '0'),
    parseInt(searchParams.get('maxTime') || '180')
  ])
  const [servings, setServings] = useState<[number, number]>([
    parseInt(searchParams.get('minServings') || '1'),
    parseInt(searchParams.get('maxServings') || '12')
  ])

  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update cuisine filter
    if (selectedCuisines.length > 0) {
      params.set('cuisine', selectedCuisines.join(','))
    } else {
      params.delete('cuisine')
    }

    // Update difficulty filter
    if (selectedDifficulties.length > 0) {
      params.set('difficulty', selectedDifficulties.join(','))
    } else {
      params.delete('difficulty')
    }

    // Update dietary tags filter
    if (selectedDietaryTags.length > 0) {
      params.set('dietary', selectedDietaryTags.join(','))
    } else {
      params.delete('dietary')
    }

    // Update time range
    if (timeRange[0] > 0 || timeRange[1] < 180) {
      params.set('minTime', timeRange[0].toString())
      params.set('maxTime', timeRange[1].toString())
    } else {
      params.delete('minTime')
      params.delete('maxTime')
    }

    // Update servings range
    if (servings[0] > 1 || servings[1] < 12) {
      params.set('minServings', servings[0].toString())
      params.set('maxServings', servings[1].toString())
    } else {
      params.delete('minServings')
      params.delete('maxServings')
    }

    router.push(`/recipes?${params.toString()}`)
  }, [selectedCuisines, selectedDifficulties, selectedDietaryTags, timeRange, servings, router, searchParams])

  const clearAllFilters = () => {
    setSelectedCuisines([])
    setSelectedDifficulties([])
    setSelectedDietaryTags([])
    setTimeRange([0, 180])
    setServings([1, 12])
    router.push('/recipes')
  }

  const hasActiveFilters = selectedCuisines.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedDietaryTags.length > 0 ||
    timeRange[0] > 0 ||
    timeRange[1] < 180 ||
    servings[0] > 1 ||
    servings[1] < 12

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCuisines.map(cuisine => (
            <Badge key={cuisine} variant="secondary" className="cursor-pointer">
              {cuisine}
              <XMarkIcon
                className="h-3 w-3 ml-1"
                onClick={() => setSelectedCuisines(prev => prev.filter(c => c !== cuisine))}
              />
            </Badge>
          ))}
          {selectedDifficulties.map(difficulty => (
            <Badge key={difficulty} variant="secondary" className="cursor-pointer">
              {difficulty}
              <XMarkIcon
                className="h-3 w-3 ml-1"
                onClick={() => setSelectedDifficulties(prev => prev.filter(d => d !== difficulty))}
              />
            </Badge>
          ))}
          {selectedDietaryTags.map(tag => (
            <Badge key={tag} variant="secondary" className="cursor-pointer">
              {tag}
              <XMarkIcon
                className="h-3 w-3 ml-1"
                onClick={() => setSelectedDietaryTags(prev => prev.filter(t => t !== tag))}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Cuisine Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Cuisine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {defaultFilters.cuisines.map(({ name, count }) => (
            <div key={name} className="flex items-center space-x-2">
              <Checkbox
                id={`cuisine-${name}`}
                checked={selectedCuisines.includes(name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCuisines(prev => [...prev, name])
                  } else {
                    setSelectedCuisines(prev => prev.filter(c => c !== name))
                  }
                }}
              />
              <Label
                htmlFor={`cuisine-${name}`}
                className="flex-1 text-sm font-normal cursor-pointer"
              >
                {name}
              </Label>
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {defaultFilters.difficulties.map(({ name, count }) => (
            <div key={name} className="flex items-center space-x-2">
              <Checkbox
                id={`difficulty-${name}`}
                checked={selectedDifficulties.includes(name.toLowerCase())}
                onCheckedChange={(checked) => {
                  const value = name.toLowerCase()
                  if (checked) {
                    setSelectedDifficulties(prev => [...prev, value])
                  } else {
                    setSelectedDifficulties(prev => prev.filter(d => d !== value))
                  }
                }}
              />
              <Label
                htmlFor={`difficulty-${name}`}
                className="flex-1 text-sm font-normal cursor-pointer"
              >
                {name}
              </Label>
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dietary Tags Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Dietary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {defaultFilters.dietaryTags.map(({ name, count }) => (
            <div key={name} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${name}`}
                checked={selectedDietaryTags.includes(name.toLowerCase())}
                onCheckedChange={(checked) => {
                  const value = name.toLowerCase()
                  if (checked) {
                    setSelectedDietaryTags(prev => [...prev, value])
                  } else {
                    setSelectedDietaryTags(prev => prev.filter(t => t !== value))
                  }
                }}
              />
              <Label
                htmlFor={`dietary-${name}`}
                className="flex-1 text-sm font-normal cursor-pointer"
              >
                {name}
              </Label>
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cooking Time Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Cooking Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={timeRange}
              onValueChange={setTimeRange}
              max={180}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{timeRange[0]} min</span>
            <span>{timeRange[1]}+ min</span>
          </div>
        </CardContent>
      </Card>

      {/* Servings Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Servings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={servings}
              onValueChange={setServings}
              max={12}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{servings[0]} serving{servings[0] > 1 ? 's' : ''}</span>
            <span>{servings[1]}+ servings</span>
          </div>
        </CardContent>
      </Card>

      {/* Apply Filters Button */}
      <Button onClick={updateURL} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}