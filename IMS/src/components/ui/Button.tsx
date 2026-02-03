import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const variants = {
            // Primary matches the "Login" and "Register" buttons in screenshots
            primary: 'bg-[#0F2137] text-white hover:bg-[#1a314d] focus:ring-[#3B82F6]',
            secondary: 'bg-[#3B82F6] text-white hover:bg-blue-600 focus:ring-blue-400',
            gold: 'bg-[#EAB308] text-[#0F2137] hover:bg-[#d9a306] focus:ring-yellow-400',
            outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700',
            ghost: 'bg-transparent hover:bg-slate-100 text-[#3B82F6]',
            danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
        };

        const sizes = {
            sm: 'h-9 px-3 text-xs',
            md: 'h-11 px-5 py-2 text-sm font-semibold tracking-wide',
            lg: 'h-13 px-8 text-base font-bold',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;