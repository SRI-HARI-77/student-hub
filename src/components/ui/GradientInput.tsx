import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GradientInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const GradientInput = forwardRef<HTMLInputElement, GradientInputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-background text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-destructive focus:ring-destructive/50" : "border-input",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

GradientInput.displayName = 'GradientInput';

export { GradientInput };
