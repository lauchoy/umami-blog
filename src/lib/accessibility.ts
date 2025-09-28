// Accessibility utilities for WCAG 2.1 AA compliance

/**
 * Focus management utilities
 */
export const focusManager = {
  // Focus trap for modals and dropdowns
  createFocusTrap: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }

      if (e.key === 'Escape') {
        // Let parent handle escape
        element.dispatchEvent(new CustomEvent('escape-key'))
      }
    }

    element.addEventListener('keydown', handleTabKey)

    return {
      activate: () => firstElement?.focus(),
      deactivate: () => element.removeEventListener('keydown', handleTabKey)
    }
  },

  // Restore focus to previous element
  saveFocus: () => {
    const activeElement = document.activeElement as HTMLElement
    return () => activeElement?.focus()
  },

  // Focus first error in form
  focusFirstError: (formElement: HTMLElement) => {
    const firstError = formElement.querySelector('[aria-invalid="true"]') as HTMLElement
    if (firstError) {
      firstError.focus()
      return true
    }
    return false
  }
}

/**
 * ARIA live region utilities
 */
export const announcer = {
  // Create announcement for screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.setAttribute('class', 'sr-only')
    announcer.textContent = message

    document.body.appendChild(announcer)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  },

  // Announce loading states
  announceLoading: (isLoading: boolean, loadingText = 'Loading') => {
    if (isLoading) {
      announcer.announce(`${loadingText}...`, 'polite')
    }
  },

  // Announce form errors
  announceError: (error: string) => {
    announcer.announce(`Error: ${error}`, 'assertive')
  },

  // Announce success messages
  announceSuccess: (message: string) => {
    announcer.announce(`Success: ${message}`, 'polite')
  }
}

/**
 * Color contrast utilities
 */
export const colorContrast = {
  // Calculate contrast ratio
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255

      const srgb = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  },

  // Check if colors meet WCAG AA standards
  meetsAAStandard: (color1: string, color2: string, isLargeText = false): boolean => {
    const ratio = colorContrast.getContrastRatio(color1, color2)
    return isLargeText ? ratio >= 3 : ratio >= 4.5
  },

  // Check if colors meet WCAG AAA standards
  meetsAAAStandard: (color1: string, color2: string, isLargeText = false): boolean => {
    const ratio = colorContrast.getContrastRatio(color1, color2)
    return isLargeText ? ratio >= 4.5 : ratio >= 7
  }
}

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  // Handle arrow key navigation in lists
  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    let newIndex = currentIndex

    switch (event.key) {
      case 'ArrowDown':
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        event.preventDefault()
        break
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        event.preventDefault()
        break
      case 'Home':
        newIndex = 0
        event.preventDefault()
        break
      case 'End':
        newIndex = items.length - 1
        event.preventDefault()
        break
      default:
        return
    }

    onIndexChange(newIndex)
    items[newIndex]?.focus()
  },

  // Create roving tabindex behavior
  createRovingTabindex: (container: HTMLElement) => {
    const items = container.querySelectorAll('[role="button"], button, [tabindex="0"]') as NodeListOf<HTMLElement>
    let currentIndex = 0

    const updateTabindex = (activeIndex: number) => {
      items.forEach((item, index) => {
        item.tabIndex = index === activeIndex ? 0 : -1
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      keyboardNavigation.handleArrowNavigation(
        event,
        Array.from(items),
        currentIndex,
        (newIndex) => {
          currentIndex = newIndex
          updateTabindex(currentIndex)
        }
      )
    }

    container.addEventListener('keydown', handleKeyDown)
    updateTabindex(0)

    return () => container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Form accessibility utilities
 */
export const formAccessibility = {
  // Generate accessible form field IDs
  generateFieldId: (name: string): string => {
    return `field-${name}-${Math.random().toString(36).substr(2, 9)}`
  },

  // Associate labels with form fields
  associateLabel: (fieldId: string, labelText: string, required = false): object => {
    return {
      id: fieldId,
      'aria-labelledby': `${fieldId}-label`,
      'aria-required': required,
      'aria-invalid': false
    }
  },

  // Create error message attributes
  createErrorAttributes: (fieldId: string, errorMessage?: string): object => {
    if (!errorMessage) return {}

    return {
      'aria-invalid': true,
      'aria-describedby': `${fieldId}-error`
    }
  },

  // Validate form accessibility
  validateFormAccessibility: (form: HTMLFormElement): string[] => {
    const errors: string[] = []
    const inputs = form.querySelectorAll('input, select, textarea')

    inputs.forEach((input) => {
      const element = input as HTMLElement
      const id = element.id
      const ariaLabel = element.getAttribute('aria-label')
      const ariaLabelledBy = element.getAttribute('aria-labelledby')
      const associatedLabel = id ? form.querySelector(`label[for="${id}"]`) : null

      if (!ariaLabel && !ariaLabelledBy && !associatedLabel) {
        errors.push(`Form field missing accessible label: ${element.tagName}`)
      }
    })

    return errors
  }
}

/**
 * Screen reader utilities
 */
export const screenReader = {
  // Check if screen reader is likely being used
  isScreenReaderLikely: (): boolean => {
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis?.speaking ||
           false
  },

  // Create screen reader only content
  createSROnlyText: (text: string): HTMLElement => {
    const element = document.createElement('span')
    element.className = 'sr-only'
    element.textContent = text
    return element
  },

  // Skip link functionality
  createSkipLink: (targetId: string, linkText = 'Skip to main content'): HTMLElement => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.textContent = linkText
    skipLink.className = 'skip-link'

    // Styles for skip link (should be in CSS)
    Object.assign(skipLink.style, {
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: '#000',
      color: '#fff',
      padding: '8px',
      textDecoration: 'none',
      zIndex: '100000'
    })

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px'
    })

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })

    return skipLink
  }
}

/**
 * Motion and animation accessibility
 */
export const motionAccessibility = {
  // Check user's motion preferences
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  // Conditionally apply animations
  applyAnimation: (element: HTMLElement, animation: string, fallback?: string) => {
    if (motionAccessibility.prefersReducedMotion()) {
      if (fallback) {
        element.style.animation = fallback
      }
    } else {
      element.style.animation = animation
    }
  },

  // Respect user color scheme preferences
  respectsColorScheme: (): 'light' | 'dark' | 'no-preference' => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    return 'no-preference'
  }
}

// Export all utilities
export const a11y = {
  focusManager,
  announcer,
  colorContrast,
  keyboardNavigation,
  formAccessibility,
  screenReader,
  motionAccessibility
}