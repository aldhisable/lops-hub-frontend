import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'aside' | 'div' | 'section'
}

export function GlassCard({ as: Component = 'div', className, ...props }: GlassCardProps) {
  return <Component className={cn('glass-card', className)} {...props} />
}
