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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#0F2137]">HOD Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Strategic overview of department internship placements and LOR approvals.</p>
            </div>

            <DashboardFilters
                years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'CS', value: 'CS' }, { label: 'IT', value: 'IT' }]}
                selectedYear={year}
                selectedBatch={batch}
                onYearChange={setYear}
                onBatchChange={setBatch}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Students" value="450" icon={Users} color="navy" />
                <StatCard label="Placed Rate" value="68%" icon={ShieldCheck} color="green" trend="+12% vs 2025" trendUp />
                <StatCard label="Pending Approvals" value="12" icon={AlertCircle} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PlacementStatsChart data={[
                    { name: 'CS', placed: 120, pending: 30 },
                    { name: 'IT', placed: 90, pending: 20 },
                    { name: 'EC', placed: 80, pending: 40 },
                ]} />

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-6">Pending Student Approvals (LOR Requests)</h3>
                    <Table headers={['Student', 'Register No', 'Recruiter', 'Action']}>
                        {[1, 2, 3].map((i) => (
                            <TableRow key={i}>
                                <TableCell className="font-bold">Student {i}</TableCell>
                                <TableCell className="font-mono text-xs text-[#3B82F6]">234720{i}</TableCell>
                                <TableCell className="text-slate-500">Global Tech Solutions</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" className="font-bold text-xs">REVIEW DOSSIER</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default HODDashboard;
