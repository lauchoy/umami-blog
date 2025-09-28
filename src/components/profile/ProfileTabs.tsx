'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Clock, Star, Settings, ChefHat, BookOpen } from 'lucide-react'

type TabType = 'favorites' | 'recent' | 'reviews' | 'settings' | 'achievements' | 'recipes'

interface TabContent {
  id: TabType
  label: string
  icon: React.ReactNode
  content: React.ReactNode
}

const FavoritesContent = () => (
  <div className="space-y-4">
    <p className="text-gray-600">Your favorite recipes will appear here.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Placeholder for favorite recipes */}
      <div className="text-center py-12 col-span-full">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No favorite recipes yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Start exploring recipes and add them to your favorites!
        </p>
      </div>
    </div>
  </div>
)

const RecentContent = () => (
  <div className="space-y-4">
    <p className="text-gray-600">Recently viewed and cooked recipes.</p>
    <div className="space-y-3">
      {/* Placeholder for recent recipes */}
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No recent activity</p>
        <p className="text-sm text-gray-400 mt-2">
          Your recently viewed recipes will appear here.
        </p>
      </div>
    </div>
  </div>
)

const ReviewsContent = () => (
  <div className="space-y-4">
    <p className="text-gray-600">Your recipe reviews and ratings.</p>
    <div className="space-y-3">
      {/* Placeholder for reviews */}
      <div className="text-center py-12">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Try some recipes and leave your first review!
        </p>
      </div>
    </div>
  </div>
)

const SettingsContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" defaultChecked />
          <span>Email notifications for new recipes</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" defaultChecked />
          <span>Weekly cooking tips and inspiration</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" />
          <span>Recipe recommendations based on preferences</span>
        </label>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" defaultChecked />
          <span>Make my profile public</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" defaultChecked />
          <span>Show my reviews publicly</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" />
          <span>Allow others to see my favorite recipes</span>
        </label>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          Download my data
        </Button>
        <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
          Delete account
        </Button>
      </div>
    </div>
  </div>
)

const AchievementsContent = () => (
  <div className="space-y-4">
    <p className="text-gray-600">Your cooking achievements and milestones.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sample achievements */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-semibold">First Recipe</h4>
            <p className="text-sm text-gray-600">Completed your first recipe</p>
            <Badge variant="secondary" className="mt-1">Unlocked</Badge>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg opacity-50">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h4 className="font-semibold">Recipe Reviewer</h4>
            <p className="text-sm text-gray-600">Leave 5 recipe reviews</p>
            <Badge variant="outline" className="mt-1">Locked</Badge>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const MyRecipesContent = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-gray-600">Recipes you&apos;ve created and shared.</p>
      <Button size="sm">Create Recipe</Button>
    </div>
    <div className="text-center py-12">
      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No recipes created yet</p>
      <p className="text-sm text-gray-400 mt-2">
        Share your culinary creations with the community!
      </p>
    </div>
  </div>
)

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('favorites')

  const tabs: TabContent[] = [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Heart className="h-4 w-4" />,
      content: <FavoritesContent />
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: <Clock className="h-4 w-4" />,
      content: <RecentContent />
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star className="h-4 w-4" />,
      content: <ReviewsContent />
    },
    {
      id: 'recipes',
      label: 'My Recipes',
      icon: <BookOpen className="h-4 w-4" />,
      content: <MyRecipesContent />
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <ChefHat className="h-4 w-4" />,
      content: <AchievementsContent />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      content: <SettingsContent />
    }
  ]

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-umami-sage text-umami-sage'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeContent}
        </div>
      </CardContent>
    </Card>
  )
}