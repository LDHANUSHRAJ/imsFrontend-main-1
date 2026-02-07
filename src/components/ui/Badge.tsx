import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'navy' | 'outline';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

/**
 * Christ IMS Status Badge
 * Used for: Internship statuses, session states, and approval levels.
 */
const Badge = ({ children, variant = 'neutral', className }: BadgeProps) => {
    const variants = {
        // Approved / Active
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        // Pending / IC Review
        warning: 'bg-amber-50 text-amber-800 border-amber-200',
        // Rejected / Needs Feedback
        error: 'bg-rose-50 text-rose-700 border-rose-200',
        // Draft / Closed / Archived
        neutral: 'bg-slate-100 text-slate-600 border-slate-200',
        // General Info / Assigned
        info: 'bg-blue-50 text-[#3B82F6] border-blue-100',
        // Brand Highlight
        navy: 'bg-[#0F2137]/10 text-[#0F2137] border-[#0F2137]/20',
        // Minimal Outline
        outline: 'bg-transparent text-slate-400 border-slate-200',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border badge',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;