import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CheckCircle, Shield, AlertTriangle } from 'lucide-react'; // Added icons
import StatCard from '../../components/ui/StatCard';
import { AdminService } from '../../services/admin.service';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';
import Button from '../../components/ui/Button';

const PlacementOfficeDashboard = () => {
    const [stats, setStats] = useState<any>({});
    const [pendingInternships, setPendingInternships] = useState<Internship[]>([]);
    const [pendingStartups, setPendingStartups] = useState<any[]>([]); // Mock for startups

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, pendingData] = await Promise.all([
                    AdminService.getStats(),
                    InternshipService.getPendingInternships(),
                ]);

                setStats(statsData || {});
                setPendingInternships(pendingData || []);
                // Mock pending startups
                setPendingStartups([
                    { id: 1, name: 'TechNova Innovations', status: 'PENDING', type: 'Startup' },
                    { id: 2, name: 'GreenEarth Solutions', status: 'PENDING', type: 'Startup' }
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">PLACEMENT OFFICE</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Institution-level governance and final approvals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Recruiters Managed" value={stats.corporatePartners || '85'} icon={Building2} color="purple" />
                <StatCard label="Pending Startups" value={pendingStartups.length.toString()} icon={Users} color="orange" />
                <StatCard label="In-Progress Closures" value={pendingInternships.length.toString()} icon={CheckCircle} color="blue" />
                <StatCard label="Credit Requests" value="5" icon={Shield} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Credits Approval Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-1 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm">Credits Approval</h3>
                        <div className="flex gap-2">
                            <Link to="/credits-approval">
                                <span className="text-xs font-bold text-blue-600 hover:underline">View All Requests</span>
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {pendingStartups.map(startup => (
                            <div key={startup.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <p className="font-bold text-sm text-[#0F2137]">{startup.name}</p>
                                    <p className="text-xs text-slate-500">Registration</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link to="/company-approvals">
                                        <Button size="sm" variant="outline" className="text-xs h-8">Review</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Internship Completion Approvals */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-6">Internship Completion Approvals</h3>
                    <div className="space-y-3">
                        {pendingInternships.length > 0 ? (
                            pendingInternships.slice(0, 3).map(internship => (
                                <div key={internship.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <p className="font-bold text-sm text-[#0F2137]">{internship.title}</p>
                                        <p className="text-xs text-slate-500">{internship.department.name}</p>
                                    </div>

                                    <Button size="sm" variant="primary" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No pending completions</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Credit Authorization Section */}
            <div className="bg-[#0F2137] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold uppercase tracking-widest text-xs text-blue-400">Credit Authorization System</h3>
                        <p className="text-slate-400 text-xs mt-1">Authorize final credit addition to student records</p>
                    </div>
                    <Button variant="outline" className="border-blue-400/30 text-blue-100 hover:bg-blue-900/30">View All Requests</Button>
                </div>
            </div>
        </div>
    );
};

export default PlacementOfficeDashboard;
