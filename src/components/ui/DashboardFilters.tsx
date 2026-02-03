import React from 'react';
import { Filter, Calendar, Layers } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface DashboardFiltersProps {
    years: FilterOption[];
    batches: FilterOption[];
    selectedYear: string;
    selectedBatch: string;
    onYearChange: (year: string) => void;
    onBatchChange: (batch: string) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    years,
    batches,
    selectedYear,
    selectedBatch,
    onYearChange,
    onBatchChange
}) => {
    return (
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm mb-6 w-fit">
            <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <Filter size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filters</span>
            </div>

            <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer py-1"
                >
                    {years.map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                </select>
            </div>

            <div className="w-px h-4 bg-slate-200"></div>

            <div className="flex items-center gap-2 pr-2">
                <Layers size={14} className="text-slate-400" />
                <select
                    value={selectedBatch}
                    onChange={(e) => onBatchChange(e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer py-1"
                >
                    {batches.map(batch => (
                        <option key={batch.value} value={batch.value}>{batch.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default DashboardFilters;
