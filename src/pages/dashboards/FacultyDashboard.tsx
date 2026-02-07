import { useState } from 'react';
import { Users, BookOpen, Clock, ArrowRight } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import DashboardFilters from '../../components/ui/DashboardFilters';

const FacultyDashboard = () => {
    const [year, setYear] = useState('2024-2025');
    const [batch, setBatch] = useState('All Batches');

    return (
        <div className="space-y-8 dashboard-enter">
            <div className="dashboard-header">
                <h1 className="text-2xl font-bold text-[#0F2137]">Faculty Guide Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Part E: Monitor your assigned mentees and review their weekly internship logs.</p>
            </div>

            <div className="dashboard-stats">
                <DashboardFilters
                    years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                    batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'MCA', value: 'MCA' }, { label: 'MSc', value: 'MSc' }]}
                    selectedYear={year}
                    selectedBatch={batch}
                    onYearChange={setYear}
                    onBatchChange={setBatch}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Assigned Mentees" value="--" icon={Users} color="navy" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Pending Log Reviews" value="--" icon={Clock} color="amber" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Final Reports Due" value="--" icon={BookOpen} color="green" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden dashboard-table">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm">Active Mentees Progress</h3>
                </div>
                <Table headers={['Student Name', 'Company', 'Current Phase', 'Last Log']}>
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                            No assigned mentees found.
                        </TableCell>
                    </TableRow>
                </Table>
            </div>
        </div>
    );
};

export default FacultyDashboard;
