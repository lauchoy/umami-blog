import { Suspense } from 'react'
import { Metadata } from 'next'
import UserProfile from '@/components/profile/UserProfile'
import ProfileTabs from '@/components/profile/ProfileTabs'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'My Profile - Umami Culinary',
  description: 'Manage your profile, preferences, and cooking journey.',
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account, preferences, and cooking journey
            </p>
          </div>

          {/* Profile Content */}
          <Suspense fallback={<ProfileSkeleton />}>
            <div className="space-y-6">
              {/* User Profile Card */}
              <UserProfile />

              {/* Profile Tabs */}
              <ProfileTabs />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}