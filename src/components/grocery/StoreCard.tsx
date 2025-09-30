'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { GroceryStore } from '@/lib/grocery'

interface StoreCardProps {
  store: GroceryStore
  selected?: boolean
  onSelect?: () => void
  showDetails?: boolean
}

export default function StoreCard({
  store,
  selected = false,
  onSelect,
  showDetails = true
}: StoreCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        selected
          ? 'border-umami-sage bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {store.logo && (
              <img
                src={store.logo}
                alt={store.name}
                className="w-8 h-8 rounded object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-sm">{store.name}</h3>
              <Badge variant="outline" className="text-xs mt-1">
                {store.type.charAt(0).toUpperCase() + store.type.slice(1)}
              </Badge>
            </div>
          </div>
          {selected && (
            <Badge className="bg-umami-sage">Selected</Badge>
          )}
        </div>

        {showDetails && (
          <div className="space-y-2">
            {/* Delivery & Pickup */}
            <div className="flex items-center space-x-4 text-xs">
              {store.deliveryAvailable && (
                <div className="flex items-center space-x-1 text-green-600">
                  <TruckIcon className="h-3 w-3" />
                  <span>Delivery</span>
                </div>
              )}
              {store.pickupAvailable && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <BuildingStorefrontIcon className="h-3 w-3" />
                  <span>Pickup</span>
                </div>
              )}
            </div>

            {/* Delivery Details */}
            {store.deliveryAvailable && (
              <div className="text-xs text-gray-600 space-y-1">
                {store.deliveryFee && (
                  <div className="flex items-center justify-between">
                    <span>Delivery fee:</span>
                    <span>${store.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {store.minimumOrder && (
                  <div className="flex items-center justify-between">
                    <span>Minimum order:</span>
                    <span>${store.minimumOrder.toFixed(2)}</span>
                  </div>
                )}
                {store.estimatedDeliveryTime && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{store.estimatedDeliveryTime}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}