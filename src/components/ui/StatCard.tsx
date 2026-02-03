import { type LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    title?: string;
    label?: string; // Alias for title, supported for compatibility
    value: string | number;
    subtitle?: string;
    isWarning?: boolean;
    icon?: LucideIcon;
    color?: string; // 'navy' | 'purple' | 'amber' etc
    trend?: string;
    trendUp?: boolean;
}

const StatCard = ({ title, label, value, subtitle, isWarning, icon: Icon, color, trend, trendUp }: StatCardProps) => {
    const displayTitle = title || label;

    // Color mapping for Recruiter Dashboard style
    const getColorClasses = (c?: string) => {
        switch (c) {
            case 'navy': return 'bg-blue-50 text-blue-700';
            case 'purple': return 'bg-purple-50 text-purple-700';
            case 'amber': return 'bg-amber-50 text-amber-700';
            case 'green': return 'bg-green-50 text-green-700';
            default: return isWarning ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className={`bg-white rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${isWarning ? 'border-red-200 bg-red-50' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-sm font-medium ${isWarning ? 'text-red-600' : 'text-slate-500'}`}>{displayTitle}</p>
                    <h3 className={`text-3xl font-bold mt-2 ${isWarning ? 'text-red-700' : 'text-[#0F2137]'}`}>
                        {value}
                    </h3>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${getColorClasses(color)}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>

            {(subtitle || trend) && (
                <div className="mt-4 flex items-center gap-2">
                    {trend && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {trend}
                        </span>
                    )}
                    {subtitle && (
                        <p className="text-xs text-slate-400">{subtitle}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatCard;
