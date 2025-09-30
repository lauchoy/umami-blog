import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="min-h-screen bg-brand-white">
      {/* Hero Section - Oatly Style: Asymmetric, Bold Typography */}
      <section className="relative bg-brand-black text-brand-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Asymmetric grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side - Massive bold headline */}
            <div className="lg:col-span-7 text-left">
              <h1 className="font-headline font-black text-6xl md:text-8xl lg:text-9xl leading-none mb-6 tracking-tighter">
                COOK<br/>
                BOLD.
              </h1>
              <p className="font-body text-sm md:text-base max-w-md mb-8 tracking-wide">
                Personalized recipes for brave home cooks. No boring meals.
                Just honest food that makes you say &ldquo;WOW HOW COOL!&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-brand-white text-brand-black hover:bg-brand-cream font-body font-bold border-4 border-brand-black shadow-oatly-button hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  START COOKING →
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-4 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black font-body font-bold shadow-oatly-button hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  BROWSE RECIPES
                </Button>
              </div>
            </div>

            {/* Right side - Playful badge/callout */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-pastel-yellow p-8 rounded-full w-64 h-64 flex items-center justify-center border-4 border-brand-black rotate-6 shadow-oatly-bold">
                  <p className="font-handwritten text-3xl text-center text-brand-black transform -rotate-6">
                    1000+ Bold Recipes!
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-pastel-pink p-4 rounded-lg border-3 border-brand-black rotate-12 shadow-oatly-card">
                  <p className="font-body text-xs font-bold">NEW!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graph paper grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>
      </section>

      {/* Featured Recipes - Oatly Style */}
      <section className="py-16 bg-brand-cream relative">
        {/* Graph paper background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Asymmetric header */}
          <div className="text-left mb-12 max-w-2xl">
            <h2 className="font-headline font-black text-5xl md:text-7xl text-brand-black mb-4 leading-none">
              FEATURED<br/>RECIPES
            </h2>
            <p className="font-body text-sm md:text-base text-brand-black">
              Bold flavors. Brave techniques. Zero boring meals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="bg-brand-black border-4 border-brand-black shadow-oatly-card hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all cursor-pointer group"
              >
                <div className="aspect-video bg-brand-white relative overflow-hidden border-b-4 border-brand-black">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Playful badge */}
                  <div className={`absolute top-3 right-3 ${index === 0 ? 'bg-pastel-pink' : index === 1 ? 'bg-pastel-blue' : 'bg-pastel-yellow'} px-3 py-1 border-2 border-brand-black rotate-3`}>
                    <span className="font-body text-xs font-bold uppercase">{recipe.difficulty}</span>
                  </div>
                </div>
                {/* Card content with bold contrast */}
                <div className="p-6 bg-brand-black text-brand-white">
                  {/* Title - Bold headline font */}
                  <h3 className="font-headline font-black text-2xl md:text-3xl mb-3 leading-tight">
                    {recipe.title.toUpperCase()}
                  </h3>

                  {/* Description - Monospace */}
                  <p className="font-body text-xs md:text-sm mb-4 leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Stats with bold icons */}
                  <div className="flex items-center gap-4 mb-4 font-body text-xs">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-5 w-5" />
                      <span className="font-bold">{recipe.prepTime + recipe.cookTime} MIN</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-5 w-5" />
                      <span className="font-bold">{recipe.servings} SERVINGS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 fill-current" />
                      <span className="font-bold">{recipe.rating}</span>
                    </div>
                  </div>

                  {/* Tags with colorful borders */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className={`${tagIndex === 0 ? 'bg-pastel-mint' : tagIndex === 1 ? 'bg-pastel-peach' : 'bg-pastel-lavender'} text-brand-black px-2 py-1 text-xs font-body font-bold uppercase border-2 border-brand-white`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full bg-brand-white text-brand-black hover:bg-pastel-yellow font-body font-bold border-3 border-brand-white shadow-oatly-button hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <Link href={`/recipes/${recipe.id}`}>
                      VIEW RECIPE →
                    </Link>
                  </Button>
                </div>
              </div>
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