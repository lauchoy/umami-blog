# Umami Culinary - Project Context

## Project Vision
Umami Culinary is a mobile-first platform designed to intelligently match home cooks and food enthusiasts with personalized recipes, cooking tutorials, and ingredient recommendations based on their preferences and skill levels.

## Core Value Proposition
- **Personalized Discovery**: AI-powered recipe recommendations based on taste, dietary needs, and skill level
- **Guided Cooking**: Step-by-step visual and video instructions with interactive cooking mode
- **Seamless Shopping**: Integrated ingredient ordering and smart shopping list generation
- **Community Learning**: Social features for sharing, rating, and learning from other home cooks

## Target Personas

### 1. Busy Professional (Alex)
- **Demographics**: 25-40 years old, full-time worker, limited cooking time
- **Goals**: Quick, healthy meals with minimal planning
- **Pain Points**: Lack of time, limited cooking skills, meal planning fatigue
- **Key Features**: Quick recipes, video tutorials, smart grocery lists

### 2. Aspiring Home Chef (Jamie)
- **Demographics**: 20-35 years old, cooking enthusiast, seeks skill development
- **Goals**: Expand culinary skills, explore new cuisines, share creations
- **Pain Points**: Recipe complexity, technique uncertainty, lack of feedback
- **Key Features**: Skill-building tutorials, advanced recipes, social sharing

### 3. Nutrition-Focused Parent (Morgan)
- **Demographics**: 30-45 years old, parent, health-conscious
- **Goals**: Safe, nutritious family meals that accommodate dietary restrictions
- **Pain Points**: Allergy management, meal variety, time constraints
- **Key Features**: Dietary filtering, family-friendly recipes, meal planning

### 4. First-Time User (Taylor)
- **Demographics**: Any age, new to cooking or the platform
- **Goals**: Learn basic cooking skills, find beginner-friendly recipes
- **Pain Points**: Overwhelm, lack of confidence, unclear instructions
- **Key Features**: Onboarding quiz, beginner tutorials, simple navigation

## Business Objectives

### Year 1 Goals
- **User Acquisition**: 25,000 active users within 6 months
- **Engagement**: 40% weekly recipe engagement rate by year-end
- **Partnerships**: 10+ partnerships with local suppliers and influencers
- **Revenue**: $100,000 from affiliate sales and premium features

### Revenue Streams
- **Affiliate Commissions**: Ingredient sales through grocery partnerships
- **Premium Subscriptions**: Advanced features, exclusive content
- **Sponsored Content**: Featured recipes from brands and influencers
- **API Licensing**: Recipe data and personalization engine licensing

## Technical Philosophy

### Mobile-First Design
- Touch-optimized interfaces with large tap targets
- Responsive design that scales from mobile to desktop
- Gesture-based navigation for intuitive interaction
- Progressive Web App capabilities for app-like experience

### Performance-First Development
- Core Web Vitals optimization as a primary concern
- Aggressive image optimization and lazy loading
- Code splitting and route-based loading
- Offline functionality for core features

### Accessibility by Design
- WCAG 2.1 AA compliance from the start
- Screen reader compatibility
- High contrast mode support
- Keyboard navigation support

### Scalable Architecture
- Modular component design for rapid feature development
- API-first approach for future mobile app development
- Microservices-ready backend architecture
- Cloud-native deployment strategies

## Key User Journeys

### 1. First-Time User Onboarding
1. **Discovery**: User finds app through social media or app store
2. **Signup**: Quick registration with social login options
3. **Preferences Quiz**: Interactive questionnaire about taste, dietary needs, skill level
4. **Personalized Feed**: Immediate display of tailored recipe recommendations
5. **First Recipe**: Guided tutorial through cooking mode experience

### 2. Daily Recipe Discovery
1. **Feed Browse**: User opens app to personalized recipe feed
2. **Recipe Selection**: Filtering and searching based on available ingredients/time
3. **Recipe Review**: Detailed view with ingredients, instructions, nutrition info
4. **Cooking Decision**: Save for later or start cooking immediately
5. **Shopping Integration**: Add missing ingredients to smart shopping list

### 3. Cooking Experience
1. **Cooking Mode**: Full-screen, step-by-step instructions
2. **Video Guidance**: Embedded technique videos for complex steps
3. **Progress Tracking**: Timer integration and step completion
4. **Real-time Help**: Access to tips and substitutions during cooking
5. **Completion**: Recipe rating and sharing options

### 4. Shopping Integration
1. **Ingredient Review**: Smart shopping list with price estimates
2. **Store Selection**: Choose from integrated grocery partners
3. **Order Placement**: One-tap ordering with delivery scheduling
4. **Order Tracking**: Real-time updates on ingredient delivery
5. **Cooking Preparation**: Notification when ingredients arrive

## Technical Requirements

### Performance Standards
- **Page Load Time**: <1.5 seconds on mobile
- **First Contentful Paint**: <1 second
- **Time to Interactive**: <2 seconds
- **Cumulative Layout Shift**: <0.1
- **Error Rate**: <0.5% of all sessions

### Browser Support
- **Modern Browsers**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Core functionality on older browsers

### Accessibility Standards
- **WCAG Compliance**: 2.1 AA level
- **Screen Readers**: Full compatibility with NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Complete functionality without mouse
- **Color Contrast**: Minimum 4.5:1 ratio for normal text

### Security Requirements
- **Data Protection**: GDPR and CCPA compliance
- **Authentication**: Multi-factor authentication support
- **API Security**: Rate limiting and request validation
- **Content Security**: XSS and CSRF protection

## Content Strategy

### Recipe Database (Sanity.io CMS)
- **Curated Content**: Professional chef and influencer contributions via Sanity Studio
- **Editorial Workflow**: Content review and publishing pipeline in Sanity
- **Rich Media**: High-quality images and videos stored in Sanity CDN
- **Structured Data**: Recipe schema with ingredients, instructions, nutrition, and metadata
- **Seasonal Focus**: Holiday and seasonal recipe collections with content scheduling
- **Dietary Coverage**: Comprehensive tagging and filtering system

### Educational Content (Sanity.io Blog System)
- **Technique Videos**: Fundamental cooking skills and methods managed in Sanity
- **Ingredient Guides**: Selection, storage, and preparation tips with rich media
- **Equipment Reviews**: Kitchen tools and appliance recommendations
- **Nutrition Information**: Health benefits and dietary guidance
- **Content Versioning**: Sanity's built-in version control for content updates
- **SEO Optimization**: Meta tags and structured data managed through Sanity

### Personalization Engine
- **Taste Profiles**: Machine learning from user interactions
- **Skill Progression**: Adaptive difficulty based on completed recipes
- **Seasonal Adaptation**: Weather and holiday-based recommendations
- **Social Signals**: Trending recipes within user's network

## Integration Partners

### Grocery Partners
- **National Chains**: Instacart, Amazon Fresh, Walmart Grocery
- **Local Stores**: Regional grocery chains and specialty stores
- **Farmers Markets**: Direct-to-consumer fresh ingredient sourcing

### Content Partners
- **Food Influencers**: YouTube chefs, Instagram food creators
- **Professional Chefs**: Restaurant partnerships for exclusive recipes
- **Food Brands**: Sponsored content and product integrations
- **Nutrition Experts**: Dietitians and health professionals

### Technology Partners
- **Payment Processing**: Stripe for subscription and affiliate payments
- **Analytics**: Firebase Analytics + Mixpanel for user behavior tracking
- **Communication**: Firebase Cloud Messaging for push notifications, SendGrid for email
- **Media Delivery**: Sanity CDN + Firebase Storage for optimized delivery
- **Search**: Algolia for advanced search capabilities (integrates well with Firebase)

## Competitive Landscape

### Direct Competitors
- **Allrecipes**: Large recipe database, community features
- **Food Network Kitchen**: Professional content, subscription model
- **Yummly**: Personalization focus, grocery integration

### Indirect Competitors
- **YouTube Cooking Channels**: Video-first cooking content
- **Instagram Food Accounts**: Visual recipe discovery
- **Meal Kit Services**: HelloFresh, Blue Apron convenience model

### Competitive Advantages
- **AI-Powered Personalization**: More sophisticated recommendation engine
- **Integrated Shopping**: Seamless ingredient ordering experience
- **Mobile-First Design**: Superior mobile experience
- **Community Features**: Better social engagement and sharing

## Risk Assessment

### Technical Risks
- **Performance Issues**: Mobile optimization challenges
- **Third-Party Dependencies**: Grocery API reliability
- **Scalability Concerns**: Database performance under load
- **Security Vulnerabilities**: User data protection

### Business Risks
- **Market Competition**: Established players with large user bases
- **User Adoption**: Convincing users to change cooking habits
- **Partner Reliability**: Grocery and content partner relationships
- **Monetization Challenges**: Converting users to paying customers

### Mitigation Strategies
- **Progressive Enhancement**: Core functionality works without advanced features
- **Fallback Systems**: Alternative options when integrations fail
- **User Testing**: Continuous feedback and iteration cycles
- **Partnership Diversification**: Multiple options for all integrations

## Success Metrics

### User Engagement
- **Daily Active Users**: Target 15% of registered users
- **Session Duration**: Average 8+ minutes per session
- **Recipe Completion Rate**: 60%+ of started recipes completed
- **Return Rate**: 70%+ users return within 7 days

### Business Metrics
- **Revenue Growth**: 20% month-over-month increase
- **Customer Acquisition Cost**: <$25 per user
- **Lifetime Value**: >$150 per user
- **Conversion Rate**: 5%+ free to premium conversion

### Technical Metrics
- **Performance Scores**: 90+ Lighthouse scores across all pages
- **Error Monitoring**: <0.5% error rate across all features
- **API Performance**: <200ms average response time
- **Uptime**: 99.9% availability

## Future Roadmap

### Phase 2 Features (Months 6-12)
- **Advanced Meal Planning**: Weekly and monthly meal planning tools
- **Nutrition Tracking**: Detailed nutritional analysis and goals
- **Voice Integration**: Hands-free cooking mode with voice commands
- **AR/VR Features**: Augmented reality cooking assistance

### Platform Expansion
- **Native Mobile Apps**: iOS and Android applications
- **Smart Device Integration**: Alexa, Google Home voice commands
- **IoT Kitchen Integration**: Smart appliance connectivity
- **International Expansion**: Multi-language and regional content

### Advanced Personalization
- **Health Integration**: Fitness tracker and health app connections
- **Advanced AI**: Computer vision for ingredient recognition
- **Predictive Ordering**: Automatic ingredient suggestions and ordering
- **Social Features**: Follow chefs, cooking challenges, live streaming

## Current Implementation Status (Phase 2 Complete)

### Architecture Overview
- **Framework**: Next.js 14.3.1 with App Router and TypeScript strict mode
- **Styling**: Tailwind CSS 3.4.1 with custom umami/sage/cream color palette
- **Components**: ShadCN/UI + Radix UI primitives for consistent design system
- **Backend**: Firebase (Auth, Firestore, Storage) + Sanity.io CMS
- **Development**: ESLint, Prettier, Jest, Playwright testing framework

### Completed Features ✅

#### Phase 1: Foundation
- Complete Next.js setup with TypeScript and Tailwind CSS
- ShadCN/UI component library with custom color scheme
- Firebase Authentication (email/password, Google OAuth)
- Sanity.io CMS with recipe schemas and editorial workflow
- WCAG 2.1 AA accessibility compliance foundation
- Testing framework and error monitoring setup

#### Phase 2: Core Features
- **Recipe System**: Full discovery feed, detail pages, cooking mode
- **User Profiles**: Complete profile management with preferences and settings
- **Shopping Lists**: CRUD operations with progress tracking and sharing
- **Advanced Search**: Multi-criteria filtering (cuisine, dietary, time, equipment)
- **Navigation**: Header/footer with authenticated user states

### Component Architecture

```
src/
├── app/
│   ├── profile/page.tsx          # User profile management
│   ├── shopping-lists/page.tsx   # Shopping list management
│   └── recipes/[slug]/page.tsx   # Dynamic recipe pages
├── components/
│   ├── layout/                   # Header, Footer, MainLayout
│   ├── profile/                  # UserProfile, ProfileTabs
│   ├── shopping/                 # Shopping list components
│   ├── recipes/                  # Recipe components + AdvancedSearch
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── firebase/                 # Auth, Firestore integration
│   └── sanity/                   # CMS configuration and queries
└── types/index.ts               # TypeScript definitions
```

### Data Layer
- **Firebase Firestore**: User profiles, shopping lists, preferences
- **Sanity.io**: Recipe content, blog posts, media assets
- **Authentication**: Firebase Auth with profile creation workflow
- **Real-time**: Firebase Realtime Database (configured for Phase 3)

### Technical Achievements
- TypeScript strict mode: 100% compliance
- Mobile-first responsive design across all components
- Accessibility: Skip links, focus management, screen reader support
- Performance: Optimized loading states and error boundaries
- Code quality: ESLint configuration with consistent patterns

### Phase 3 Roadmap (70% Complete)

#### 1. Social Features Implementation ✅ COMPLETE
- ✅ Complete review system with star ratings and detailed feedback
- ✅ Comment and reply functionality with user avatars
- ✅ Social sharing to Facebook, Twitter, WhatsApp, Email, and clipboard
- ✅ Recipe rating aggregation and display
- ✅ Helpful/Not Helpful voting on reviews
- 📂 **Components**: `RecipeReviews.tsx`, `SocialShare.tsx`
- 📂 **Firebase**: Review CRUD operations in `firestore.ts`

#### 2. Real-time Cooking Sessions 🚧 IN PROGRESS
- ✅ Interactive cooking mode with step-by-step navigation
- ✅ Progress tracking with timer integration
- ✅ Pause/Resume functionality for cooking sessions
- ⏳ Multi-user cooking sessions with Firebase Realtime Database (PENDING)
- ⏳ Live progress sharing with family/friends (PENDING)
- ⏳ Voice-guided instructions integration (PENDING)
- 📂 **Components**: `CookingModeToggle.tsx`, `RecipeInstructions.tsx`

#### 3. Grocery API Integration ✅ COMPLETE
- ✅ Instacart API integration for product search and pricing
- ✅ Walmart API integration for product availability
- ✅ Multi-store price comparison interface
- ✅ Smart shopping list with ingredient-to-product matching
- ✅ Store selection and price optimization
- ✅ Automatic ingredient availability checking
- 📂 **Components**: `RecipeIngredients.tsx`, `GroceryItemCard.tsx`, `StoreCard.tsx`
- 📂 **APIs**: `lib/grocery/instacart.ts`, `lib/grocery/walmart.ts`

#### 4. Performance & Polish 🚧 IN PROGRESS
- ⏳ Image optimization with Next.js Image component (PENDING)
- ⏳ Code splitting and lazy loading implementation (PENDING)
- ⏳ Framer Motion animations for enhanced UX (PENDING)
- ⏳ PWA features for offline recipe access (PENDING)
- ⏳ SEO optimization with structured data (PENDING)

### Technical Debt & Known Issues
- ⚠️ Image optimization: Many components still use `<img>` instead of Next.js `<Image />`
- ⚠️ Unused variables warnings in several components (cleanup needed)
- ⚠️ React Hook dependency warnings in useEffect hooks
- 📝 Environment variables: Firebase/Sanity configs use placeholder fallbacks for build
- 🧪 Test suite: Framework configured but tests need implementation
- 🎨 Animations: Framer Motion installed but not yet utilized
- 📱 PWA: Service worker and manifest not yet configured
- 🔍 SEO: Structured data (Recipe schema) not implemented

### Development Guidelines
- Follow existing component patterns in `/src/components/`
- Maintain TypeScript strict mode compliance
- Use existing color palette (umami-sage, cream, neutral grays)
- Ensure mobile-first responsive design
- Include proper accessibility attributes
- Test on multiple screen sizes and devices

### Success Metrics for Phase 3
- **Social Engagement**: 40% of users leave reviews/comments ✅ Framework implemented
- **Cooking Sessions**: 60% recipe completion rate in guided mode ✅ Tracking enabled
- **Shopping Integration**: 25% of users complete grocery orders ✅ APIs integrated
- **Performance**: 90+ Lighthouse scores across all pages ⏳ Pending optimization
- **User Retention**: 70% return rate within 7 days 📊 Analytics configured

### Immediate Next Steps (Priority Order)
1. **Performance Optimization** (High Impact)
   - Convert `<img>` tags to Next.js `<Image />` component
   - Implement lazy loading for recipe cards and images
   - Add loading skeletons and optimize bundle size

2. **Code Quality Cleanup** (Medium Impact)
   - Fix unused variable warnings
   - Resolve React Hook dependency issues
   - Clean up console warnings

3. **PWA Features** (High Impact)
   - Configure service worker for offline access
   - Add manifest.json for installable app
   - Implement offline recipe caching

4. **SEO Optimization** (High Impact)
   - Add Recipe structured data (schema.org)
   - Implement sitemap generation
   - Add meta tags and Open Graph optimization

5. **Animations & Polish** (Medium Impact)
   - Implement Framer Motion transitions
   - Add micro-interactions for better UX
   - Enhance loading states

6. **Real-time Collaborative Cooking** (Low Priority)
   - Implement Firebase Realtime Database for shared sessions
   - Add real-time progress updates
   - Enable voice-guided instructions

This project context serves as the foundation for all development decisions and ensures alignment with business objectives and user needs throughout the development process.