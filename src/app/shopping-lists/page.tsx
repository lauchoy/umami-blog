import { Suspense } from 'react'
import { Metadata } from 'next'
import ShoppingListManager from '@/components/shopping/ShoppingListManager'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Shopping Lists - Umami Culinary',
  description: 'Manage your shopping lists and never forget an ingredient again.',
}

function ShoppingListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ShoppingListsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shopping Lists
            </h1>
            <p className="text-lg text-gray-600">
              Organize your grocery shopping and never forget an ingredient
            </p>
          </div>

          {/* Shopping List Manager */}
          <Suspense fallback={<ShoppingListSkeleton />}>
            <ShoppingListManager />
          </Suspense>
        </div>
      </div>
    </div>
  )
}