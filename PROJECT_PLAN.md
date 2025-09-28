# Umami Culinary - Development Plan

## Project Overview
Mobile-first Next.js platform for personalized culinary experiences, matching home cooks with tailored recipes, tutorials, and ingredient recommendations.

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: ShadCN/UI + Material UI (selective)
- **Animations**: Framer Motion
- **State Management**: Zustand + React Query

### Backend & Content
- **CMS**: Sanity.io (recipes, blog posts, content)
- **Database**: Firebase Firestore (user data, preferences, shopping lists)
- **Authentication**: Firebase Auth (cost-effective alternative)
- **API**: Next.js API Routes + Sanity GROQ + Firebase SDK
- **File Storage**: Sanity CDN + Firebase Storage
- **Real-time**: Firebase Realtime Database for live features

### DevOps & Tools
- **Hosting**: Vercel
- **CDN**: Sanity CDN + Firebase Storage
- **Analytics**: Firebase Analytics + Vercel Analytics
- **Monitoring**: Firebase Crashlytics + Sentry
- **Testing**: Jest, React Testing Library, Playwright
- **Push Notifications**: Firebase Cloud Messaging

## Development Phases

### Phase 1: Foundation & Core Setup (Week 1-2) ✅ COMPLETED
- [x] Initialize Next.js 14 with App Router
- [x] Configure TypeScript with strict mode (strict: true enabled)
- [x] Set up Tailwind CSS with custom design system (umami/sage/cream color palette, mobile-first utilities, CultivateWP-inspired components)
- [x] Install and configure ShadCN/UI components (button, card, input, label, badge, avatar, dialog, dropdown-menu, navigation-menu)
- [x] Configure Sanity.io CMS project (schemas, studio config, content structure)
- [x] Set up Firebase project for user data (Firestore, Storage, configuration)
- [x] Implement Firebase Authentication (email/password, Google OAuth, user management)
- [x] Add performance monitoring setup (Firebase Analytics + Vercel Analytics + Speed Insights)
- [x] Configure error monitoring (Sentry for client/server/edge, Firebase Crashlytics)
- [x] Set up testing framework (Jest + React Testing Library + Playwright + accessibility testing)
- [x] Implement WCAG 2.1 AA accessibility compliance foundation (skip links, focus management, screen reader support, aria labels)

### Phase 2: Core Features (Week 3-5) ✅ COMPLETED
- [x] Build recipe discovery system with personalized feed
- [x] Implement recipe detail page with cooking mode
- [x] Create user profile management (profile page, settings, preferences)
- [x] Add shopping list functionality (create, edit, share lists)
- [x] Implement advanced search and filtering with enhanced options

### Phase 3: Advanced Features (Week 6-7)
- [ ] Add social features (ratings, comments, sharing)
- [ ] Implement real-time cooking sessions
- [ ] Add ingredient integration with grocery APIs
- [ ] Performance optimization and animations

### Phase 4: Polish & Launch (Week 8)
- [ ] Testing and quality assurance
- [ ] SEO optimization
- [ ] Performance monitoring setup
- [ ] Deployment to production

## Data Architecture
- **Content Layer**: Sanity.io for recipes, blog posts, and editorial content
- **User Layer**: Firebase Firestore for user profiles, preferences, and social features
- **Hybrid Approach**: Sanity for content-heavy data, Firebase for user interactions
- **Real-time updates**: Firebase Realtime Database for social features, Sanity webhooks for content
- **Search**: Sanity's built-in search + Firebase full-text search with Algolia integration
- **Cost Optimization**: Firebase's pay-per-use model more suitable for growing user base

## Current Implementation Status

### Completed Features ✅

#### Phase 1: Foundation & Core Setup
- Complete Next.js 14 setup with TypeScript and Tailwind CSS
- ShadCN/UI component library integration
- Firebase Authentication with Google OAuth support
- Sanity.io CMS configuration and schemas
- Comprehensive accessibility foundation (WCAG 2.1 AA compliance)
- Performance monitoring and error tracking setup
- Testing framework configuration

#### Phase 2: Core Features
- **Recipe System**: Complete recipe discovery, detail pages with interactive cooking mode
- **User Profiles**: Full profile management with preferences, dietary restrictions, and settings
- **Shopping Lists**: Create, edit, delete, and manage shopping lists with progress tracking
- **Advanced Search**: Enhanced search with filters for cuisine, dietary tags, cooking time, equipment, techniques, and ingredient inclusion/exclusion
- **Navigation**: Complete header/footer with user authentication states

### Key Components Implemented

#### User Management
- `/src/app/profile/page.tsx` - User profile page
- `/src/components/profile/UserProfile.tsx` - Profile editing component
- `/src/components/profile/ProfileTabs.tsx` - Tabbed interface for favorites, recent, reviews, settings

#### Shopping Lists
- `/src/app/shopping-lists/page.tsx` - Shopping list management page
- `/src/components/shopping/ShoppingListManager.tsx` - Main shopping list interface
- `/src/components/shopping/ShoppingListCard.tsx` - Individual list component
- `/src/components/shopping/CreateShoppingList.tsx` - List creation dialog

#### Enhanced Search & Filtering
- `/src/components/recipes/AdvancedSearch.tsx` - Comprehensive search modal
- `/src/components/recipes/RecipeFilters.tsx` - Enhanced filtering options
- `/src/components/recipes/RecipeSearch.tsx` - Smart search with suggestions

#### Data Layer
- Firebase Firestore integration for user data, profiles, shopping lists
- User profile management with preferences and settings
- Shopping list CRUD operations with real-time updates

### Next Steps (Phase 3)
- Social features implementation (ratings, comments, sharing)
- Real-time cooking sessions
- Ingredient integration with grocery APIs
- Performance optimization and animations
- SEO optimization and production deployment

### Technical Notes
- Build successful with TypeScript compilation
- All core functionality implemented and tested
- Ready for Phase 3 advanced features
- Environment variables needed for Sanity.io integration in production