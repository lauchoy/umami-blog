import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

interface RecipeNutritionProps {
  nutrition: Nutrition
}

export default function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories, unit: '' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' },
    { label: 'Carbs', value: nutrition.carbs, unit: 'g' },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    { label: 'Fiber', value: nutrition.fiber, unit: 'g' },
    { label: 'Sugar', value: nutrition.sugar, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nutrition Facts</CardTitle>
        <Badge variant="outline" className="w-fit">
          Per Serving
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nutritionItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold">
                {item.value}{item.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}