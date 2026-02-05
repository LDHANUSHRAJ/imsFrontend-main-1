import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options?: SelectOption[];
    placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, children, id, disabled, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="block text-sm font-bold text-[#0F2137] mb-1.5 ml-0.5">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <select
                        ref={ref}
                        id={id}
                        disabled={disabled}
                        className={cn(
                            'flex h-12 w-full appearance-none rounded-lg border border-transparent bg-slate-50 px-4 py-2 text-sm text-slate-900 ring-offset-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white border-slate-100 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
                            error && 'border-rose-500 focus:ring-rose-500 bg-rose-50/30',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && <option value="" disabled selected>{placeholder}</option>}
                        {options ? (
                            options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        ) : (
                            children
                        )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500 group-focus-within:text-[#3B82F6]">
                        <ChevronDown size={16} />
                    </div>
                </div>
                {error && <p className="mt-1.5 text-xs font-medium text-rose-600 ml-1 italic">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
export default Select;
