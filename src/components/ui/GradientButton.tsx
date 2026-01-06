import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "gradient-primary text-primary-foreground hover:opacity-90 focus:ring-primary shadow-glow-sm hover:shadow-glow",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary",
      outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
      ghost: "text-foreground hover:bg-muted focus:ring-muted",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
