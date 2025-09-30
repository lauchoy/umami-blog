'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  getRecipeReviews,
  addRecipeReview,
  updateRecipeReview,
  deleteRecipeReview
} from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  X
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
} from '@/components/ui/dialog'

import { Review as BaseReview, ReviewReply } from '@/types'


interface RecipeReviewsProps {
  recipeId: string
}

export default function RecipeReviews({ recipeId }: RecipeReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<BaseReview[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    loadReviews()
  }, [recipeId])

  const loadReviews = async () => {
    try {
      const recipeReviews = await getRecipeReviews(recipeId)
      setReviews(recipeReviews.data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user || !newReview.title.trim() || !newReview.comment.trim()) return

    try {
      const reviewData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || undefined,
        recipeId,
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        helpful: 0,
        notHelpful: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await addRecipeReview(reviewData)
      await loadReviews()
      setShowReviewForm(false)
      setNewReview({ rating: 5, title: '', comment: '' })
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteRecipeReview(reviewId)
      await loadReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleHelpfulClick = async (reviewId: string, isHelpful: boolean) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return

    try {
      const updates = isHelpful
        ? { helpful: review.helpful + 1 }
        : { notHelpful: review.notHelpful + 1 }

      await updateRecipeReview(reviewId, updates)
      await loadReviews()
    } catch (error) {
      console.error('Error updating helpfulness:', error)
    }
  }

  const handleReply = async (reviewId: string) => {
    if (!user || !replyText.trim()) return

    try {
      const review = reviews.find(r => r.id === reviewId)
      if (!review) return

      const newReplyData: ReviewReply = {
        id: `reply_${Date.now()}`,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || undefined,
        comment: replyText.trim(),
        createdAt: new Date()
      }

      const updatedReplies = [...review.replies, newReplyData]
      await updateRecipeReview(reviewId, { replies: updatedReplies })
      await loadReviews()
      setReplyingTo(null)
      setReplyText('')
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRatingChange?.(star)}
            className={`${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-3">
              <span>Reviews</span>
              <Badge variant="secondary">{reviews.length}</Badge>
            </CardTitle>
            {reviews.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} out of 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
          {user && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center space-x-2"
            >
              <Star className="h-4 w-4" />
              <span>Write Review</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Form Dialog */}
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this recipe to help others.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="mt-2">
                  {renderStars(newReview.rating, true, (rating) =>
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="review-title">Title</Label>
                <Input
                  id="review-title"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your review a title..."
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="review-comment">Review</Label>
                <textarea
                  id="review-comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about this recipe..."
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-umami-sage focus:border-transparent"
                  maxLength={1000}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={!newReview.title.trim() || !newReview.comment.trim()}
              >
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to review this recipe and help others!
            </p>
            {user && (
              <Button onClick={() => setShowReviewForm(true)}>
                Write First Review
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-umami-sage text-white text-sm font-semibold">
                          {review.userName[0]?.toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{review.userName}</span>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  {user?.uid === review.userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingReview(review.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="mb-3">
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {/* Helpful buttons */}
                <div className="flex items-center space-x-4 mb-3">
                  <button
                    onClick={() => handleHelpfulClick(review.id, true)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-umami-sage transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button
                    onClick={() => handleHelpfulClick(review.id, false)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not helpful ({review.notHelpful})</span>
                  </button>
                  {user && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-umami-sage transition-colors"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  )}
                </div>

                {/* Reply form */}
                {replyingTo === review.id && (
                  <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex space-x-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 min-h-[80px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umami-sage focus:border-transparent"
                      />
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReplyingTo(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {review.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-3">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          {reply.userAvatar ? (
                            <img src={reply.userAvatar} alt={reply.userName} />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-umami-sage text-white text-xs font-semibold">
                              {reply.userName[0]?.toUpperCase()}
                            </div>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">{reply.userName}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}