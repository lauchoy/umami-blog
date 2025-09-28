'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingList } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Edit2,
  Trash2,
  Share2,
  MoreVertical,
  Check,
  X,
  ShoppingCart,
  Calendar
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ShoppingListCardProps {
  list: ShoppingList
  onUpdate: (listId: string, updates: Partial<ShoppingList>) => void
  onDelete: (listId: string) => void
}

export default function ShoppingListCard({
  list,
  onUpdate,
  onDelete
}: ShoppingListCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(list.name)

  const completedItems = list.items.filter(item => item.checked).length
  const totalItems = list.items.length
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const handleSaveName = () => {
    if (editName.trim() && editName !== list.name) {
      onUpdate(list.id, { name: editName.trim() })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(list.name)
    setIsEditing(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shopping List: ${list.name}`,
          text: `Check out my shopping list: ${list.name}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        // Could show a toast notification here
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-lg font-semibold"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleSaveName}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <CardTitle className="text-lg line-clamp-2">{list.name}</CardTitle>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Shopping List</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &quot;{list.name}&quot;? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      onClick={() => onDelete(list.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-umami-sage h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Items Summary */}
        <div className="space-y-2">
          {totalItems === 0 ? (
            <p className="text-gray-500 text-sm">No items yet</p>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {completedItems} of {totalItems} items completed
              </span>
              <Badge variant={completedItems === totalItems ? "default" : "secondary"}>
                {completedItems === totalItems ? "Complete" : "In Progress"}
              </Badge>
            </div>
          )}

          {/* Recent Items Preview */}
          {list.items.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Items
              </p>
              <div className="space-y-1">
                {list.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 text-sm">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.checked ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <span className={item.checked ? 'line-through text-gray-500' : ''}>
                      {item.ingredient.name}
                    </span>
                  </div>
                ))}
                {list.items.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{list.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatDate(list.updatedAt)}</span>
          </div>
          <Link href={`/shopping-lists/${list.id}`}>
            <Button size="sm" variant="outline" className="flex items-center space-x-1">
              <ShoppingCart className="h-3 w-3" />
              <span>Open</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}