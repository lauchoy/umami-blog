'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const cuisines = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'French',
]

const categories = [
  { name: 'Techniques', href: '/blog/techniques' },
  { name: 'Ingredients', href: '/blog/ingredients' },
  { name: 'Equipment', href: '/blog/equipment' },
  { name: 'Nutrition', href: '/blog/nutrition' },
]

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user state - in real app, this would come from auth context
  const isAuthenticated = false
  const user: { avatar?: string; displayName?: string; email?: string } | null = null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                U
              </div>
              <span className="hidden font-bold sm:inline-block">
                Umami Culinary
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Recipes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-orange-500/20 to-orange-500/30 p-6 no-underline outline-none focus:shadow-md"
                          href="/recipes"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Discover Recipes
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore thousands of delicious recipes from around the world
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {cuisines.slice(0, 6).map((cuisine) => (
                      <li key={cuisine}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/recipes/cuisine/${cuisine.toLowerCase()}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {cuisine}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500/20 to-green-500/30 p-6 no-underline outline-none focus:shadow-md"
                          href="/blog"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Culinary Blog
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Tips, techniques, and culinary wisdom from expert chefs
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {categories.map((category) => (
                      <li key={category.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {category.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/chefs" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Chefs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="relative w-full max-w-sm">
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes, ingredients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Saved Recipes */}
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <HeartIcon className="h-5 w-5" />
                  <span className="sr-only">Saved recipes</span>
                </Button>

                {/* Shopping List */}
                <Link href="/shopping-lists">
                  <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                    <ShoppingCartIcon className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                      3
                    </Badge>
                    <span className="sr-only">Shopping list</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} alt={''} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Guest User
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          guest@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HeartIcon className="mr-2 h-4 w-4" />
                      <span>Saved Recipes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/shopping-lists">
                        <ShoppingCartIcon className="mr-2 h-4 w-4" />
                        <span>Shopping Lists</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CogIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Bars3Icon className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link href="/recipes" className="text-lg font-medium">
                    Recipes
                  </Link>
                  <Link href="/blog" className="text-lg font-medium">
                    Learn
                  </Link>
                  <Link href="/chefs" className="text-lg font-medium">
                    Chefs
                  </Link>
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Button variant="outline">Sign In</Button>
                      <Button>Sign Up</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}