import { Download } from 'lucide-react';
import { exportToCSV } from './csvHelper';

export const ExportButton = ({
    data,
    filename,
    label = "Export CSV",
    className = ""
}: {
    data: any[];
    filename: string;
    label?: string;
    className?: string;
}) => {
    return (
        <button
            onClick={() => exportToCSV(data, filename)}
            className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm ${className}`}
            disabled={!data || data.length === 0}
        >
            <Download size={16} />
            {label}
        </button>
    );
};
