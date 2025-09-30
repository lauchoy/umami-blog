'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  StarIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { GroceryItem } from '@/lib/grocery'

interface GroceryItemCardProps {
  item: GroceryItem
  isSelected?: boolean
  isBestPrice?: boolean
  onSelect?: () => void
  showStore?: boolean
  compact?: boolean
}

export default function GroceryItemCard({
  item,
  isSelected = false,
  isBestPrice = false,
  onSelect,
  showStore = true,
  compact = false
}: GroceryItemCardProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'text-green-600'
      case 'limited':
        return 'text-yellow-600'
      case 'out_of_stock':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <CheckIcon className="h-3 w-3" />
      case 'limited':
        return <ExclamationTriangleIcon className="h-3 w-3" />
      case 'out_of_stock':
        return <XMarkIcon className="h-3 w-3" />
      default:
        return null
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'In Stock'
      case 'limited':
        return 'Limited Stock'
      case 'out_of_stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all relative ${
        isSelected
          ? 'border-umami-sage bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${compact ? 'h-full' : ''}`}
      onClick={onSelect}
    >
      {isBestPrice && (
        <Badge className="absolute -top-2 -right-2 bg-green-500 z-10">
          Best Price
        </Badge>
      )}

      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="space-y-3">
          {/* Product Image */}
          {item.imageUrl && !compact && (
            <div className="w-full h-24 bg-gray-100 rounded overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-2">
            <div>
              <h4 className={`font-medium ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
                {item.name}
              </h4>
              {item.brand && (
                <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {item.brand}
                </p>
              )}
              {item.size && (
                <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {item.size}
                </p>
              )}
            </div>

            {/* Rating */}
            {item.rating && !compact && (
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                {item.reviewCount && (
                  <span className="text-xs text-gray-500">({item.reviewCount})</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`font-bold ${compact ? 'text-lg' : 'text-xl'}`}>
                  ${item.price.toFixed(2)}
                </span>
                <span className={`text-gray-500 ml-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {item.currency}
                </span>
              </div>
              {item.unitPrice && (
                <div className={`text-right ${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  ${item.unitPrice.toFixed(2)}/{item.unit}
                </div>
              )}
            </div>

            {/* Store Info */}
            {showStore && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BuildingStorefrontIcon className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
                  <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                    {item.store.name}
                  </span>
                  {item.store.deliveryAvailable && (
                    <TruckIcon className={`text-green-500 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  )}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className={`flex items-center space-x-1 ${getAvailabilityColor(item.availability)}`}>
              {getAvailabilityIcon(item.availability)}
              <span className={compact ? 'text-xs' : 'text-sm'}>
                {getAvailabilityText(item.availability)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {onSelect && !compact && (
            <Button
              size="sm"
              className="w-full"
              variant={isSelected ? "default" : "outline"}
              disabled={item.availability === 'out_of_stock'}
            >
              {isSelected ? 'Selected' : 'Select Item'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}