'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  getUserShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList
} from '@/lib/firebase/firestore'
import { ShoppingList } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  ShoppingCart
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ShoppingListCard from './ShoppingListCard'
import CreateShoppingList from './CreateShoppingList'

export default function ShoppingListManager() {
  const { user } = useAuth()
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    if (user) {
      loadShoppingLists()
    }
  }, [user])

  const loadShoppingLists = async () => {
    if (!user) return

    try {
      const userLists = await getUserShoppingLists(user.uid)
      setLists(userLists)
    } catch (error) {
      console.error('Error loading shopping lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async (name: string) => {
    if (!user) return

    setCreating(true)
    try {
      const listId = await createShoppingList(user.uid, name)
      await loadShoppingLists() // Reload lists
      setShowCreateDialog(false)
    } catch (error) {
      console.error('Error creating shopping list:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateList = async (listId: string, updates: Partial<ShoppingList>) => {
    try {
      await updateShoppingList(listId, updates)
      await loadShoppingLists() // Reload lists
    } catch (error) {
      console.error('Error updating shopping list:', error)
    }
  }

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteShoppingList(listId)
      setLists(lists.filter(list => list.id !== listId))
    } catch (error) {
      console.error('Error deleting shopping list:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            My Shopping Lists
          </h2>
          {lists.length > 0 && (
            <Badge variant="secondary">
              {lists.length} list{lists.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New List</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Shopping List</DialogTitle>
              <DialogDescription>
                Create a new shopping list to organize your ingredients.
              </DialogDescription>
            </DialogHeader>
            <CreateShoppingList
              onCreateList={handleCreateList}
              creating={creating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Shopping Lists Grid */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No shopping lists yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first shopping list to get started organizing your grocery shopping.
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First List</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onUpdate={handleUpdateList}
              onDelete={handleDeleteList}
            />
          ))}
        </div>
      )}
    </div>
  )
}