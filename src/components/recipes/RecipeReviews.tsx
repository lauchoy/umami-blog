import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RecipeReviewsProps {
  recipeId: string
}

export default function RecipeReviews({ recipeId }: RecipeReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Reviews coming soon...</p>
      </CardContent>
    </Card>
  )
}