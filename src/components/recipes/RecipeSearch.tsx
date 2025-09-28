'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchSuggestion {
  type: 'ingredient' | 'cuisine' | 'recipe'
  value: string
  count?: number
}

const popularSearches = [
  'chicken', 'pasta', 'vegetarian', 'quick meals', 'desserts',
  'healthy', 'keto', 'italian', 'mexican', 'mediterranean'
]

export default function RecipeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('umami-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Generate suggestions based on query
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      // Mock suggestions - in a real app, this would come from your API
      const mockSuggestions: SearchSuggestion[] = ([
        { type: 'recipe', value: 'Chicken Tikka Masala', count: 5 },
        { type: 'ingredient', value: 'chicken breast', count: 234 },
        { type: 'cuisine', value: 'Indian', count: 89 },
        { type: 'recipe', value: 'Chicken Parmesan', count: 12 },
        { type: 'ingredient', value: 'chicken thighs', count: 156 },
      ] as SearchSuggestion[]).filter(s => s.value.toLowerCase().includes(debouncedQuery.toLowerCase()))

      setSuggestions(mockSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedQuery])

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('umami-recent-searches', JSON.stringify(updated))

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', searchQuery)
    router.push(`/recipes?${params.toString()}`)

    setShowSuggestions(false)
  }, [recentSearches, router, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.value)
    handleSearch(suggestion.value)
  }

  const handleClearSearch = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    const newUrl = params.toString() ? `/recipes?${params.toString()}` : '/recipes'
    router.push(newUrl)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('umami-recent-searches')
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search recipes, ingredients, or cuisines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-20 h-12 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Live Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{suggestion.value}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {suggestion.type}
                      </Badge>
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">{suggestion.count} results</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {query.length === 0 && (
            <div className="p-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}