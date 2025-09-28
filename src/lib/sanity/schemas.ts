// Sanity Schema Definitions for Umami Culinary Platform

export const recipeSchema = {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(100)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(300)
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}]
    },
    {
      name: 'video',
      title: 'Recipe Video',
      type: 'url'
    },
    {
      name: 'prepTime',
      title: 'Prep Time (minutes)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0)
    },
    {
      name: 'cookTime',
      title: 'Cook Time (minutes)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0)
    },
    {
      name: 'servings',
      title: 'Servings',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'}
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'cuisine',
      title: 'Cuisine',
      type: 'string',
      options: {
        list: [
          'Italian', 'French', 'Mexican', 'Chinese', 'Japanese', 'Indian',
          'Thai', 'Mediterranean', 'American', 'Korean', 'Vietnamese',
          'Middle Eastern', 'Greek', 'Spanish', 'Other'
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'dietaryTags',
      title: 'Dietary Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          'vegetarian', 'vegan', 'gluten-free', 'dairy-free',
          'keto', 'paleo', 'low-carb', 'low-sodium'
        ]
      }
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'name', title: 'Ingredient Name', type: 'string', validation: (Rule: any) => Rule.required()},
          {name: 'amount', title: 'Amount', type: 'number', validation: (Rule: any) => Rule.required().min(0)},
          {name: 'unit', title: 'Unit', type: 'string', validation: (Rule: any) => Rule.required()},
          {name: 'notes', title: 'Notes', type: 'string'},
          {name: 'optional', title: 'Optional', type: 'boolean', initialValue: false}
        ]
      }],
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'instructions',
      title: 'Instructions',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'step', title: 'Step Number', type: 'number', validation: (Rule: any) => Rule.required().min(1)},
          {name: 'description', title: 'Description', type: 'text', validation: (Rule: any) => Rule.required()},
          {name: 'duration', title: 'Duration (minutes)', type: 'number'},
          {name: 'temperature', title: 'Temperature', type: 'number'},
          {name: 'image', title: 'Step Image', type: 'image', options: {hotspot: true}},
          {name: 'video', title: 'Step Video', type: 'file', options: {accept: 'video/*'}},
          {name: 'tips', title: 'Tips', type: 'array', of: [{type: 'string'}]}
        ]
      }],
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'nutrition',
      title: 'Nutrition Information',
      type: 'object',
      fields: [
        {name: 'calories', title: 'Calories', type: 'number'},
        {name: 'protein', title: 'Protein (g)', type: 'number'},
        {name: 'carbs', title: 'Carbohydrates (g)', type: 'number'},
        {name: 'fat', title: 'Fat (g)', type: 'number'},
        {name: 'fiber', title: 'Fiber (g)', type: 'number'},
        {name: 'sugar', title: 'Sugar (g)', type: 'number'},
        {name: 'sodium', title: 'Sodium (mg)', type: 'number'}
      ]
    },
    {
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(5),
      initialValue: 0
    },
    {
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'featured',
      title: 'Featured Recipe',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'cuisine'
    }
  }
}

export const authorSchema = {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'verified',
      title: 'Verified Chef',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'instagram', title: 'Instagram', type: 'url'},
        {name: 'youtube', title: 'YouTube', type: 'url'},
        {name: 'website', title: 'Website', type: 'url'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}

export const postSchema = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(200)
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', title: 'Alt Text', type: 'string'}
          ]
        }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'techniques', 'ingredients', 'equipment',
          'nutrition', 'seasonal', 'culture'
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      subtitle: 'category'
    }
  }
}

export const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}

// Export all schemas
export const schemas = [
  recipeSchema,
  authorSchema,
  postSchema,
  categorySchema
]

// Export schema types for Sanity config
export const schemaTypes = schemas