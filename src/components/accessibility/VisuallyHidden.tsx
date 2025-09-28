import React from 'react'

interface VisuallyHiddenProps {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  as: Component = 'span'
}) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

export default VisuallyHidden