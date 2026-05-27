import type { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const glowButtonVariants = cva(
  'glow-button inline-flex min-h-10 items-center justify-center gap-2 rounded-card px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'border border-primary/15 bg-primary-container text-white shadow-[0_12px_24px_rgba(83,65,205,0.2)] hover:bg-[#5a4bd1] focus-visible:outline-primary/25',
        soft:
          'border border-white/70 bg-white/70 text-on-surface-variant hover:bg-white focus-visible:outline-primary/25',
        ghost:
          'border border-transparent bg-transparent text-primary hover:bg-white/55 focus-visible:outline-primary/25',
      },
      size: {
        sm: 'min-h-8 px-3 text-xs',
        md: 'min-h-10 px-4 text-sm',
        lg: 'min-h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type GlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof glowButtonVariants> & {
    asChild?: boolean
  }

export function GlowButton({
  asChild = false,
  className,
  size,
  type,
  variant,
  ...props
}: GlowButtonProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={cn(glowButtonVariants({ variant, size }), className)}
      type={asChild ? undefined : (type ?? 'button')}
      {...props}
    />
  )
}
