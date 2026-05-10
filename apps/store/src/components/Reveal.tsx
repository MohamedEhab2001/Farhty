import { useReveal } from '../hooks/useReveal'
import type { ReactNode, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  stagger?: boolean
  blur?: boolean
  delay?: number
}

export function Reveal({ children, className = '', stagger, blur, delay = 0, ...rest }: Props) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${blur ? 'reveal-blur' : ''} ${stagger ? 'reveal-stagger' : ''} ${shown ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
