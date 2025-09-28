import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const footerLinks = {
  recipes: [
    { name: 'Browse All Recipes', href: '/recipes' },
    { name: 'Quick & Easy', href: '/recipes?time=30min' },
    { name: 'Healthy Recipes', href: '/recipes?dietary=healthy' },
    { name: 'Vegetarian', href: '/recipes?dietary=vegetarian' },
    { name: 'Desserts', href: '/recipes?category=desserts' },
  ],
  learn: [
    { name: 'Cooking Techniques', href: '/blog/techniques' },
    { name: 'Ingredient Guides', href: '/blog/ingredients' },
    { name: 'Kitchen Equipment', href: '/blog/equipment' },
    { name: 'Nutrition Tips', href: '/blog/nutrition' },
    { name: 'Seasonal Cooking', href: '/blog/seasonal' },
  ],
  community: [
    { name: 'Featured Chefs', href: '/chefs' },
    { name: 'Recipe Reviews', href: '/reviews' },
    { name: 'Cooking Tips', href: '/tips' },
    { name: 'Share Your Recipe', href: '/submit-recipe' },
    { name: 'Join Our Community', href: '/community' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partnerships', href: '/partnerships' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
}

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/umamiculinary',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.017 0C8.396 0 7.936.013 6.706.072 5.481.13 4.656.333 3.942.63a5.92 5.92 0 00-2.14 1.39 5.92 5.92 0 00-1.39 2.14C.333 4.656.131 5.481.072 6.706.013 7.936 0 8.396 0 12.017c0 3.624.013 4.083.072 5.314.058 1.225.261 2.05.558 2.764a5.92 5.92 0 001.39 2.14 5.92 5.92 0 002.14 1.39c.714.297 1.54.5 2.764.558 1.23.059 1.69.072 5.314.072 3.624 0 4.083-.013 5.314-.072 1.225-.058 2.05-.261 2.764-.558a5.92 5.92 0 002.14-1.39 5.92 5.92 0 001.39-2.14c.297-.714.5-1.54.558-2.764.059-1.23.072-1.69.072-5.314 0-3.624-.013-4.083-.072-5.314-.058-1.225-.261-2.05-.558-2.764a5.92 5.92 0 00-1.39-2.14 5.92 5.92 0 00-2.14-1.39C16.097.333 15.272.131 14.047.072 12.817.013 12.357 0 8.733 0h3.284zm0 2.164c3.554 0 3.977.012 5.38.07 1.299.059 2.006.275 2.478.458.622.242 1.067.532 1.533.998.466.466.756.911.998 1.533.183.472.399 1.179.458 2.478.058 1.403.07 1.826.07 5.38 0 3.554-.012 3.977-.07 5.38-.059 1.299-.275 2.006-.458 2.478a4.133 4.133 0 01-.998 1.533c-.466.466-.911.756-1.533.998-.472.183-1.179.399-2.478.458-1.403.058-1.826.07-5.38.07-3.554 0-3.977-.012-5.38-.07-1.299-.059-2.006-.275-2.478-.458a4.137 4.137 0 01-1.533-.998 4.133 4.133 0 01-.998-1.533c-.183-.472-.399-1.179-.458-2.478-.058-1.403-.07-1.826-.07-5.38 0-3.554.012-3.977.07-5.38.059-1.299.275-2.006.458-2.478.242-.622.532-1.067.998-1.533a4.137 4.137 0 011.533-.998c.472-.183 1.179-.399 2.478-.458 1.403-.058 1.826-.07 5.38-.07z"
          clipRule="evenodd"
        />
        <path d="M12.017 5.838a6.18 6.18 0 100 12.359 6.18 6.18 0 000-12.359zM12.017 16a4 4 0 110-8 4 4 0 010 8zM18.408 4.155a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/umamiculinary',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/umamiculinary',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/umamiculinary',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Signup */}
        <div className="mb-12 border-b border-gray-800 pb-8">
          <div className="mx-auto max-w-md text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay in the Loop
            </h3>
            <p className="text-gray-400 mb-4">
              Get the latest recipes, cooking tips, and culinary inspiration delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-orange-600 hover:bg-orange-700">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Unsubscribe at any time. Read our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-white mb-4">Recipes</h4>
            <ul className="space-y-2">
              {footerLinks.recipes.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Learn</h4>
            <ul className="space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
              U
            </div>
            <span className="font-bold text-white">Umami Culinary</span>
          </div>

          <div className="flex items-center space-x-6">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            © 2024 Umami Culinary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}