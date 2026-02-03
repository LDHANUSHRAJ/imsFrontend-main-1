import { TrendingUp, TrendingDown } from 'lucide-react';

interface QuickStatProps {
    label: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'amber' | 'rose' | 'purple';
}

const QuickStat = ({
    label,
    value,
    change,
    changeLabel,
    icon,
    color = 'blue'
}: QuickStatProps) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    {icon}
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                        {isPositive && <TrendingUp size={16} />}
                        {isNegative && <TrendingDown size={16} />}
                        <span>{change > 0 ? '+' : ''}{change}%</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-[#0F2137]">{value}</p>
                {changeLabel && (
                    <p className="text-xs text-slate-400 mt-2">{changeLabel}</p>
                )}
            </div>
        </div>
    );
};

export default QuickStat;
