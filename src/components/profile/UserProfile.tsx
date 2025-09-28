'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { updateUserProfile, getUserProfile } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Camera, Edit2, Save, X } from 'lucide-react'

interface UserProfileData {
  displayName: string
  email: string
  bio: string
  location: string
  dietaryPreferences: string[]
  cookingLevel: string
  favoritesCuisines: string[]
  photoURL?: string
}

export default function UserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfileData | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const profileData = await getUserProfile(user.uid)
      const defaultProfile: UserProfileData = {
        displayName: user.displayName || '',
        email: user.email || '',
        bio: '',
        location: '',
        dietaryPreferences: [],
        cookingLevel: 'beginner',
        favoritesCuisines: [],
        photoURL: user.photoURL || undefined,
        ...profileData
      }
      setProfile(defaultProfile)
      setEditedProfile(defaultProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !editedProfile) return

    setSaving(true)
    try {
      await updateUserProfile(user.uid, editedProfile)
      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfileData, value: string | string[]) => {
    if (!editedProfile) return
    setEditedProfile({ ...editedProfile, [field]: value })
  }

  const addDietaryPreference = (preference: string) => {
    if (!editedProfile || editedProfile.dietaryPreferences.includes(preference)) return
    handleInputChange('dietaryPreferences', [...editedProfile.dietaryPreferences, preference])
  }

  const removeDietaryPreference = (preference: string) => {
    if (!editedProfile) return
    handleInputChange('dietaryPreferences', editedProfile.dietaryPreferences.filter(p => p !== preference))
  }

  const addFavoriteCuisine = (cuisine: string) => {
    if (!editedProfile || editedProfile.favoritesCuisines.includes(cuisine)) return
    handleInputChange('favoritesCuisines', [...editedProfile.favoritesCuisines, cuisine])
  }

  const removeFavoriteCuisine = (cuisine: string) => {
    if (!editedProfile) return
    handleInputChange('favoritesCuisines', editedProfile.favoritesCuisines.filter(c => c !== cuisine))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) return null

  const displayProfile = isEditing ? editedProfile : profile

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {displayProfile?.photoURL ? (
                  <img
                    src={displayProfile.photoURL}
                    alt={displayProfile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-umami-sage text-white text-2xl font-semibold">
                    {displayProfile?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  {isEditing ? (
                    <Input
                      id="displayName"
                      value={editedProfile?.displayName || ''}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{displayProfile?.displayName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm text-gray-600">{displayProfile?.email}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={editedProfile?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-umami-sage focus:border-transparent"
                    placeholder="Tell us about your cooking journey..."
                  />
                ) : (
                  <p className="text-gray-700">{displayProfile?.bio || 'No bio added yet.'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editedProfile?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-700">{displayProfile?.location || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cookingLevel">Cooking Level</Label>
                  {isEditing ? (
                    <select
                      id="cookingLevel"
                      value={editedProfile?.cookingLevel || 'beginner'}
                      onChange={(e) => handleInputChange('cookingLevel', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umami-sage focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="professional">Professional</option>
                    </select>
                  ) : (
                    <Badge variant="secondary" className="capitalize">
                      {displayProfile?.cookingLevel}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <Label>Dietary Preferences</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {displayProfile?.dietaryPreferences.map((preference) => (
                <Badge key={preference} variant="outline" className="flex items-center space-x-1">
                  <span>{preference}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeDietaryPreference(preference)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {isEditing && (
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addDietaryPreference(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Add preference...</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-free</option>
                  <option value="dairy-free">Dairy-free</option>
                  <option value="nut-free">Nut-free</option>
                  <option value="low-carb">Low-carb</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              )}
            </div>
          </div>

          {/* Favorite Cuisines */}
          <div>
            <Label>Favorite Cuisines</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {displayProfile?.favoritesCuisines.map((cuisine) => (
                <Badge key={cuisine} variant="outline" className="flex items-center space-x-1">
                  <span>{cuisine}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeFavoriteCuisine(cuisine)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {isEditing && (
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addFavoriteCuisine(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Add cuisine...</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="asian">Asian</option>
                  <option value="indian">Indian</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="french">French</option>
                  <option value="american">American</option>
                  <option value="thai">Thai</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}