'use client'

import React, { useEffect, useRef, useCallback } from 'react'

interface FocusTrapProps {
  children: React.ReactNode
  active: boolean
  restoreFocus?: boolean
  onEscape?: () => void
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active,
  restoreFocus = true,
  onEscape
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []

    const selectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    return Array.from(containerRef.current.querySelectorAll(selectors)) as HTMLElement[]
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!active) return

    const focusableElements = getFocusableElements()
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    } else if (event.key === 'Escape' && onEscape) {
      event.preventDefault()
      onEscape()
    }
  }, [active, getFocusableElements, onEscape])

  useEffect(() => {
    if (active) {
      // Save the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Focus the first focusable element in the trap
      const focusableElements = getFocusableElements()
      const firstElement = focusableElements[0]
      if (firstElement) {
        firstElement.focus()
      }

      // Add event listener
      document.addEventListener('keydown', handleKeyDown)
    } else if (restoreFocus && previousActiveElement.current) {
      // Restore focus to the previously focused element
      previousActiveElement.current.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, restoreFocus, handleKeyDown, getFocusableElements])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

export default FocusTrap