'use client'

import { Button } from '@/components/ui/button'
import { PlayIcon } from '@heroicons/react/24/outline'

interface Recipe {
  _id: string
  title: string
}

interface CookingModeToggleProps {
  recipe: Recipe
}

export default function CookingModeToggle({ recipe }: CookingModeToggleProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Ready to Cook?</h2>
          <p className="text-orange-100">
            Start cooking mode for step-by-step guidance with timers and tips
          </p>
        </div>
        <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
          <PlayIcon className="h-5 w-5 mr-2" />
          Start Cooking
        </Button>
      </div>
    </div>
  )
}