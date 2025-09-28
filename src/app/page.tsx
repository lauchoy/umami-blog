import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ClockIcon, UsersIcon, StarIcon } from "@heroicons/react/24/outline"

const featuredRecipes = [
  {
    id: "1",
    title: "Creamy Tuscan Chicken",
    description: "Succulent chicken breasts in a rich, creamy sauce with sun-dried tomatoes and spinach",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "intermediate",
    rating: 4.8,
    reviewCount: 234,
    tags: ["gluten-free", "keto"]
  },
  {
    id: "2",
    title: "Vegan Buddha Bowl",
    description: "Colorful and nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    difficulty: "beginner",
    rating: 4.6,
    reviewCount: 189,
    tags: ["vegan", "gluten-free", "healthy"]
  },
  {
    id: "3",
    title: "Classic Margherita Pizza",
    description: "Homemade pizza dough topped with fresh mozzarella, basil, and San Marzano tomatoes",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    prepTime: 120,
    cookTime: 12,
    servings: 4,
    difficulty: "advanced",
    rating: 4.9,
    reviewCount: 456,
    tags: ["vegetarian", "italian"]
  }
]

const categories = [
  { name: "Quick & Easy", count: 1240, color: "bg-orange-100 text-orange-700" },
  { name: "Healthy", count: 890, color: "bg-green-100 text-green-700" },
  { name: "Comfort Food", count: 567, color: "bg-blue-100 text-blue-700" },
  { name: "Desserts", count: 345, color: "bg-purple-100 text-purple-700" },
  { name: "International", count: 789, color: "bg-red-100 text-red-700" },
  { name: "Vegetarian", count: 456, color: "bg-emerald-100 text-emerald-700" }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Recipe
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Personalized culinary experiences tailored to your taste, skill level, and dietary preferences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Cooking
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              Browse Recipes
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Recipes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked recipes from our community of talented chefs and home cooks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{recipe.rating}</span>
                      <span className="text-sm text-gray-500">({recipe.reviewCount})</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{recipe.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/recipes/${recipe.id}`}>
                      View Recipe
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/recipes">
                Browse All Recipes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recipe Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find recipes that match your mood, time constraints, and dietary preferences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/recipes?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="text-center hover:shadow-md transition-shadow group-hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${category.color} mb-4`}>
                      <span className="text-lg font-bold">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.count} recipes
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks discovering new flavors and perfecting their skills
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            Create Your Free Account
          </Button>
        </div>
      </section>
    </div>
  )
}