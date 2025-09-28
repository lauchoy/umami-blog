'use client'

import React from 'react'

interface SkipLinkProps {
  targetId: string
  children: React.ReactNode
  className?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  children,
  className = ''
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`
        skip-link
        absolute -top-40 left-6 z-[100000]
        bg-black text-white px-3 py-2 text-sm
        focus:top-6 focus:outline-2 focus:outline-white
        transition-all duration-200
        ${className}
      `}
      onFocus={(e) => {
        e.currentTarget.style.top = '1.5rem'
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-10rem'
      }}
    >
      {children}
    </a>
  )
}

export default SkipLink