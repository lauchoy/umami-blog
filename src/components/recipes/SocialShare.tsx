'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Share2,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Download,
  Heart,
  Users
} from 'lucide-react'

interface Recipe {
  _id: string
  title: string
  description: string
  mainImage: string
  rating: number
  prepTime: number
  cookTime: number
  servings: number
}

interface SocialShareProps {
  recipe: Recipe
  children?: React.ReactNode
}

interface ShareStats {
  likes: number
  shares: number
  saves: number
}

export default function SocialShare({ recipe, children }: SocialShareProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareStats, setShareStats] = useState<ShareStats>({
    likes: Math.floor(Math.random() * 500) + 50,
    shares: Math.floor(Math.random() * 200) + 20,
    saves: Math.floor(Math.random() * 300) + 30
  })

  const recipeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/recipes/${recipe._id}`
    : ''

  const shareText = `Check out this amazing recipe: ${recipe.title}! It takes only ${recipe.prepTime + recipe.cookTime} minutes to make and serves ${recipe.servings} people. ⭐ ${recipe.rating.toFixed(1)}/5`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recipeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleSocialShare = (platform: string) => {
    let shareUrl = ''
    const encodedUrl = encodeURIComponent(recipeUrl)
    const encodedText = encodeURIComponent(shareText)

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
        break
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(recipe.mainImage)}&description=${encodedText}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(recipe.title)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Recipe: ${recipe.title}`)}&body=${encodedText}%0A%0A${encodedUrl}`
        break
      default:
        return
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      // Update share count
      setShareStats(prev => ({ ...prev, shares: prev.shares + 1 }))
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: recipeUrl,
        })
        setShareStats(prev => ({ ...prev, shares: prev.shares + 1 }))
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      setShowShareDialog(true)
    }
  }

  const handleDownloadRecipe = () => {
    // Create a simple text version of the recipe for download
    const recipeText = `
${recipe.title}
${recipe.description}

Prep Time: ${recipe.prepTime} minutes
Cook Time: ${recipe.cookTime} minutes
Total Time: ${recipe.prepTime + recipe.cookTime} minutes
Servings: ${recipe.servings}
Rating: ${recipe.rating.toFixed(1)}/5

View full recipe at: ${recipeUrl}

Shared from Umami Culinary - ${new Date().toLocaleDateString()}
    `.trim()

    const blob = new Blob([recipeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLike = () => {
    setShareStats(prev => ({ ...prev, likes: prev.likes + 1 }))
  }

  const handleSave = () => {
    setShareStats(prev => ({ ...prev, saves: prev.saves + 1 }))
  }

  return (
    <>
      {/* Social Stats and Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Social Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">{shareStats.likes}</span>
                <span className="text-sm text-gray-500">likes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{shareStats.shares}</span>
                <span className="text-sm text-gray-500">shares</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{shareStats.saves}</span>
                <span className="text-sm text-gray-500">saves</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className="flex items-center space-x-1"
              >
                <Heart className="h-4 w-4" />
                <span>Like</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Save</span>
              </Button>
              {children || (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNativeShare}
                  className="flex items-center space-x-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Recipe</DialogTitle>
            <DialogDescription>
              Share &quot;{recipe.title}&quot; with friends and family
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Recipe Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <img
                  src={recipe.mainImage}
                  alt={recipe.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{recipe.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">⭐ {recipe.rating.toFixed(1)}</Badge>
                    <Badge variant="outline">{recipe.prepTime + recipe.cookTime} min</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center space-x-2 justify-start"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span>Facebook</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center space-x-2 justify-start"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span>Twitter</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('pinterest')}
                className="flex items-center space-x-2 justify-start"
              >
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                <span>Pinterest</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center space-x-2 justify-start"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('email')}
                className="flex items-center space-x-2 justify-start"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                <span>Email</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadRecipe}
                className="flex items-center space-x-2 justify-start"
              >
                <Download className="h-4 w-4 text-umami-sage" />
                <span>Download</span>
              </Button>
            </div>

            {/* Copy Link */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={recipeUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}