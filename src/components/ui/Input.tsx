import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="block text-sm font-bold text-[#0F2137] mb-1.5 ml-0.5">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3B82F6] transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={cn(
                            'flex h-12 w-full rounded-lg border border-transparent bg-slate-50 px-4 py-2 text-sm text-slate-900 ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white border-slate-100 transition-all shadow-sm',
                            icon && 'pl-11',
                            error && 'border-rose-500 focus:ring-rose-500 bg-rose-50/30',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1.5 text-xs font-medium text-rose-600 ml-1 italic">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;