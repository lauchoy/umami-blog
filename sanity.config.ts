import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './src/lib/sanity/schemas'

export default defineConfig({
  name: 'umami-culinary',
  title: 'Umami Culinary CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Recipes section
            S.listItem()
              .title('Recipes')
              .child(
                S.list()
                  .title('Recipe Management')
                  .items([
                    S.listItem()
                      .title('All Recipes')
                      .child(S.documentTypeList('recipe').title('All Recipes')),
                    S.listItem()
                      .title('Featured Recipes')
                      .child(
                        S.documentList()
                          .title('Featured Recipes')
                          .filter('_type == "recipe" && featured == true')
                      ),
                    S.listItem()
                      .title('By Difficulty')
                      .child(
                        S.list()
                          .title('By Difficulty')
                          .items([
                            S.listItem()
                              .title('Beginner')
                              .child(
                                S.documentList()
                                  .title('Beginner Recipes')
                                  .filter('_type == "recipe" && difficulty == "beginner"')
                              ),
                            S.listItem()
                              .title('Intermediate')
                              .child(
                                S.documentList()
                                  .title('Intermediate Recipes')
                                  .filter('_type == "recipe" && difficulty == "intermediate"')
                              ),
                            S.listItem()
                              .title('Advanced')
                              .child(
                                S.documentList()
                                  .title('Advanced Recipes')
                                  .filter('_type == "recipe" && difficulty == "advanced"')
                              ),
                          ])
                      ),
                  ])
              ),

            // Blog section
            S.listItem()
              .title('Blog Posts')
              .child(
                S.list()
                  .title('Blog Management')
                  .items([
                    S.listItem()
                      .title('All Posts')
                      .child(S.documentTypeList('post').title('All Posts')),
                    S.listItem()
                      .title('By Category')
                      .child(
                        S.list()
                          .title('By Category')
                          .items([
                            'techniques', 'ingredients', 'equipment',
                            'nutrition', 'seasonal', 'culture'
                          ].map(category =>
                            S.listItem()
                              .title(category.charAt(0).toUpperCase() + category.slice(1))
                              .child(
                                S.documentList()
                                  .title(`${category.charAt(0).toUpperCase() + category.slice(1)} Posts`)
                                  .filter(`_type == "post" && category == "${category}"`)
                              )
                          ))
                      ),
                  ])
              ),

            // Authors section
            S.listItem()
              .title('Authors')
              .child(
                S.list()
                  .title('Author Management')
                  .items([
                    S.listItem()
                      .title('All Authors')
                      .child(S.documentTypeList('author').title('All Authors')),
                    S.listItem()
                      .title('Verified Chefs')
                      .child(
                        S.documentList()
                          .title('Verified Chefs')
                          .filter('_type == "author" && verified == true')
                      ),
                  ])
              ),

            // Categories
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),

            // Divider
            S.divider(),

            // All other document types
            ...S.documentTypeListItems().filter(
              (listItem) =>
                !['recipe', 'author', 'post', 'category'].includes(listItem.getId()!)
            ),
          ])
    }),
    visionTool(),
    media(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Custom theme - removed for now due to typing issues

  // Custom document actions - removed for now due to typing issues

  // Custom toolbar
  studio: {
    components: {
      toolMenu: () => null
    }
  }
})