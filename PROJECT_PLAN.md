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

### Phase 3: Advanced Features (Week 6-7) 🚧 IN PROGRESS
- [x] Add social features (ratings, comments, sharing)
- [ ] Implement real-time cooking sessions with Firebase Realtime Database
- [x] Add ingredient integration with grocery APIs (Instacart, Walmart)
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

#### Phase 3: Advanced Features (Partial)
- **Social Features**: Complete review system with ratings, comments, replies, and social sharing
- **Cooking Mode**: Interactive step-by-step cooking mode with progress tracking
- **Grocery Integration**: Full API integration with Instacart and Walmart for pricing and availability
- **Shopping Optimization**: Multi-store price comparison and smart shopping list features

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

### Next Steps (Phase 3 Completion & Phase 4)

#### UI Redesign (Oatly-Inspired Design System) ✅ COMPLETED
- [x] Update Tailwind config with Oatly-inspired design tokens
  - ✅ Bold headline fonts (Impact, Arial Black for ultra-bold headlines)
  - ✅ Monospace body text (Courier New for typewriter aesthetic)
  - ✅ Black/white/cream color palette with pastel accents
  - ✅ Bold Oatly-style shadows (8px 8px cards, 4px 4px buttons)
  - ✅ Extended font sizes (7xl-9xl) and ultra-black weight
- [x] Implement custom typography system
  - ✅ Massive headlines with extreme contrast (font-headline, font-black)
  - ✅ Monospace body text (font-body) for quirky aesthetic
  - ✅ Handwritten font family for playful accents
- [x] Redesign homepage
  - ✅ Asymmetric hero section with "COOK BOLD" massive headline
  - ✅ Grid-based layouts with visible graph paper grid lines
  - ✅ Playful circular badges with rotation and shadows
  - ✅ Conversational monospace copy with personality
- [x] Redesign recipe cards
  - ✅ High contrast black cards with white text
  - ✅ Bold 4px borders with Oatly-style shadows
  - ✅ Playful pastel badges with rotation
  - ✅ All-caps monospace stats
- [x] Update interactive elements
  - ✅ Bold black/white buttons with arrow indicators (→)
  - ✅ Shadow effects that disappear on hover with translate
  - ✅ 3-4px border widths for sketch-style feel
- [ ] Add more visual personality (Future Enhancement)
  - Hand-drawn illustrations (clouds, pointing hands, food doodles)
  - Custom SVG elements and badges
  - More texture overlays and playful elements

#### Remaining Phase 3 Tasks
- [ ] Real-time cooking sessions with Firebase Realtime Database (collaborative cooking)
- [ ] Voice-guided cooking instructions integration
- [x] Performance optimization - Image optimization (in progress)
- [ ] Performance optimization - Code splitting and lazy loading
- [ ] Framer Motion animations for enhanced UX
- [ ] PWA features for offline recipe access

#### Phase 4 Tasks
- [ ] Comprehensive testing (unit, integration, e2e with Playwright)
- [ ] SEO optimization with structured data (Recipe schema, OpenGraph)
- [ ] Production deployment to Vercel
- [ ] Performance monitoring and analytics setup
- [ ] User acceptance testing and feedback collection

### Technical Notes
- ✅ Build successful with TypeScript compilation
- ✅ All Phase 2 & most Phase 3 core functionality implemented
- ✅ Social features fully integrated (reviews, ratings, sharing)
- ✅ Grocery API integration complete (Instacart, Walmart)
- ✅ Interactive cooking mode with timers and progress tracking
- ⏳ Performance optimizations pending (images, animations, PWA)
- ⏳ Real-time collaborative cooking sessions pending
- 📝 Environment variables configured with fallbacks for build resilience