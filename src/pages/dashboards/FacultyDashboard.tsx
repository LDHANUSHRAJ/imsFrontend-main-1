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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#0F2137]">Faculty Guide Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Part E: Monitor your assigned mentees and review their weekly internship logs.</p>
            </div>

            <DashboardFilters
                years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'MCA', value: 'MCA' }, { label: 'MSc', value: 'MSc' }]}
                selectedYear={year}
                selectedBatch={batch}
                onYearChange={setYear}
                onBatchChange={setBatch}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Assigned Mentees" value="15" icon={Users} color="navy" />
                <StatCard label="Pending Log Reviews" value="08" icon={Clock} color="amber" />
                <StatCard label="Final Reports Due" value="04" icon={BookOpen} color="green" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm">Active Mentees Progress</h3>
                    <button className="text-[#3B82F6] text-xs font-bold hover:underline flex items-center gap-1">
                        VIEW ALL <ArrowRight size={14} />
                    </button>
                </div>
                <Table headers={['Student Name', 'Company', 'Current Phase', 'Last Log']}>
                    <TableRow>
                        <TableCell className="font-bold text-slate-800">Rahul Sharma</TableCell>
                        <TableCell className="text-slate-500">Google India</TableCell>
                        <TableCell><Badge variant="info">In Progress</Badge></TableCell>
                        <TableCell className="text-xs font-medium text-slate-400">24 mins ago</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold text-slate-800">Sneha Kapoor</TableCell>
                        <TableCell className="text-slate-500">Microsoft</TableCell>
                        <TableCell><Badge variant="success">Completed</Badge></TableCell>
                        <TableCell className="text-xs font-medium text-slate-400">Yesterday</TableCell>
                    </TableRow>
                </Table>
            </div>
        </div>
    );
};

export default FacultyDashboard;
