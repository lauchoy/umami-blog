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

### Phase 2: Core Features (Week 3-5)
- [ ] Build recipe discovery system with personalized feed
- [ ] Implement recipe detail page with cooking mode
- [ ] Create user profile management
- [ ] Add shopping list functionality
- [ ] Implement search and filtering

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