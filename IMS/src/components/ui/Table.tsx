import React from 'react';
import { cn } from '../../utils/cn';

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
}

const Table = ({ headers, children, className }: TableProps) => {
    return (
        <div className={cn("overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm", className)}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    scope="col"
                                    className="py-4 pl-6 pr-3 text-left text-[11px] font-bold text-[#0F2137] uppercase tracking-[0.05em]"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const TableRow = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <tr
        onClick={onClick}
        className={cn(
            "group hover:bg-slate-50/50 transition-colors duration-150",
            onClick && "cursor-pointer",
            className
        )}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <td className={cn("whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-700", className)}>
        {children}
    </td>
);

export default Table;