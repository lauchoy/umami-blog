import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RelatedRecipe {
  _id: string
  title: string
  slug: { current: string }
  mainImage: string
  prepTime: number
  cookTime: number
  difficulty: string
  rating: number
}

interface RecipeRelatedProps {
  recipes: RelatedRecipe[]
}

export default function RecipeRelated({ recipes }: RecipeRelatedProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/recipes/${recipe.slug.current}`}>
              <div className="aspect-video bg-gray-200 relative">
                <Image
                  src={recipe.mainImage}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {recipe.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}