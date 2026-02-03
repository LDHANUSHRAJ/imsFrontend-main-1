import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
    label: string;
    path?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

/**
 * Christ IMS Breadcrumbs
 * Implements the professional ERP navigation pattern from the Christ Portal.
 */
const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    if (items.length === 0) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className="flex items-center py-4 text-sm font-medium"
        >
            <ol className="flex items-center space-x-1">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isFirst = index === 0;
                    const Icon = item.icon || (isFirst ? Home : null);

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight
                                    size={14}
                                    className="text-slate-400 mx-1.5 shrink-0"
                                    aria-hidden="true"
                                />
                            )}

                            {item.path && !isLast ? (
                                <Link
                                    to={item.path}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-[#3B82F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 rounded px-1.5 py-0.5"
                                    aria-label={`Maps to ${item.label}`}
                                >
                                    {Icon && <Icon size={15} strokeWidth={2.5} />}
                                    <span className="text-xs">{item.label}</span>
                                </Link>
                            ) : (
                                <span
                                    className="flex items-center gap-1.5 text-[#0F2137] font-bold px-1.5 py-0.5"
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {Icon && <Icon size={15} strokeWidth={2.5} className="text-[#0F2137]" />}
                                    <span className="text-xs uppercase tracking-tight">{item.label}</span>
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;