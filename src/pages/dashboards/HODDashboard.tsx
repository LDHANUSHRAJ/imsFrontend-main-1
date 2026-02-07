import React, { useState } from 'react';
import { Users, AlertCircle, ShieldCheck } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import DashboardFilters from '../../components/ui/DashboardFilters';
import PlacementStatsChart from '../../components/charts/PlacementStatsChart';

const HODDashboard = () => {
    const [year, setYear] = useState('2024-2025');
    const [batch, setBatch] = useState('All Batches');

    return (
        <div className="space-y-8 dashboard-enter">
            <div className="dashboard-header">
                <h1 className="text-2xl font-bold text-[#0F2137]">HOD Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Strategic overview of department internship placements and LOR approvals.</p>
            </div>

            <div className="dashboard-stats">
                <DashboardFilters
                    years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                    batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'CS', value: 'CS' }, { label: 'IT', value: 'IT' }]}
                    selectedYear={year}
                    selectedBatch={batch}
                    onYearChange={setYear}
                    onBatchChange={setBatch}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Total Students" value="--" icon={Users} color="navy" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Placed Rate" value="--" icon={ShieldCheck} color="green" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Pending Approvals" value="--" icon={AlertCircle} color="amber" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 dashboard-table">
                <PlacementStatsChart data={[]} />

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-6">Pending Student Approvals (LOR Requests)</h3>
                    <Table headers={['Student', 'Register No', 'Recruiter', 'Action']}>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                                No pending approvals
                            </TableCell>
                        </TableRow>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default HODDashboard;
