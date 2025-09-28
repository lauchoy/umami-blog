'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ClockIcon,
  UsersIcon,
  HeartIcon,
  ShareIcon,
  PrinterIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Recipe {
  _id: string
  title: string
  description: string
  mainImage: string
  video?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cuisine: string
  dietaryTags: string[]
  rating: number
  reviewCount: number
  author: {
    _id: string
    name: string
    image: string
    verified: boolean
  }
  publishedAt: string
}

interface RecipeHeaderProps {
  recipe: Recipe
}

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const totalTime = recipe.prepTime + recipe.cookTime
  const publishDate = new Date(recipe.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleSave = () => {
    setIsSaved(!isSaved)
    // TODO: Implement save/unsave recipe functionality
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* Hero Image/Video */}
      <div className="relative aspect-video bg-gray-100">
        {showVideo && recipe.video ? (
          <iframe
            src={recipe.video}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={recipe.mainImage}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
            {recipe.video && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-90 rounded-full group-hover:bg-opacity-100 transition-all">
                  <PlayIcon className="h-6 w-6 text-gray-900 ml-1" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`capitalize font-medium ${getDifficultyColor(recipe.difficulty)}`}
            >
              {recipe.difficulty}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {recipe.cuisine}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={isSaved ? 'text-red-600' : 'text-gray-600'}
            >
              {isSaved ? (
                <HeartSolidIcon className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="ml-1 hidden sm:inline">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <ShareIcon className="h-5 w-5" />
              <span className="ml-1 hidden sm:inline">Share</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <PrinterIcon className="h-5 w-5" />
              <span className="ml-1 hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {recipe.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {recipe.description}
        </p>

        {/* Recipe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Prep Time</p>
              <p className="font-semibold text-gray-900">{recipe.prepTime} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Cook Time</p>
              <p className="font-semibold text-gray-900">{recipe.cookTime} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="font-semibold text-gray-900">{totalTime} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-semibold text-gray-900">{recipe.servings}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarSolidIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(recipe.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">
              {recipe.rating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({recipe.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Dietary Tags */}
        {recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.dietaryTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={recipe.author.image} alt={recipe.author.name} />
              <AvatarFallback>
                {recipe.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {recipe.author.name}
                </h3>
                {recipe.author.verified && (
                  <Badge variant="outline" className="text-xs">
                    Verified Chef
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Published on {publishDate}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </div>
      </div>
    </div>
  )
}