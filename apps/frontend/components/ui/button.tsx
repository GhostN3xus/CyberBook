import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonStyles = cva(
  'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-brand-neon text-black hover:opacity-90',
        outline: 'border-brand-neon text-brand-neon hover:bg-brand-dark/40',
        ghost: 'text-slate-200 hover:bg-brand-dark/60',
        destructive: 'bg-red-600 text-white hover:bg-red-700'
      },
      size: {
        default: 'h-10',
        sm: 'h-8 text-xs',
        lg: 'h-12 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonStyles({ variant, size }), className)} {...props} />
));

Button.displayName = 'Button';
