import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CheckCircle, Shield } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { RecruiterService } from '../../services/recruiter.service';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';
import Button from '../../components/ui/Button';

const PlacementOfficeDashboard = () => {
    const [pendingInternships, setPendingInternships] = useState<Internship[]>([]);
    const [pendingExternalInternships, setPendingExternalInternships] = useState<any[]>([]);
    const [approvedInternshipsCount, setApprovedInternshipsCount] = useState<number>(0);
    const [pendingRecruiters, setPendingRecruiters] = useState<any[]>([]);

    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            let debugLog = [];

            // 1. Fetch Pending Internships
            try {
                const pendingData = await InternshipService.getPendingInternships();
                setPendingInternships(Array.isArray(pendingData) ? pendingData : []);
                debugLog.push(`Pending Internships: ${Array.isArray(pendingData) ? pendingData.length : 'Not Array'}`);
            } catch (error) {
                console.error("Pending Internships failed", error);
                debugLog.push(`Pending Internships: 0`);
                setPendingInternships([]);
            }

            // 2. Fetch Pending External Internships
            try {
                const externalData = await InternshipService.getExternalPending();
                setPendingExternalInternships(Array.isArray(externalData) ? externalData : []);
                debugLog.push(`Pending External: ${Array.isArray(externalData) ? externalData.length : 'Not Array'}`);
            } catch (error) {
                console.error("Pending External Internships failed", error);
                debugLog.push(`Pending External: 0`);
                setPendingExternalInternships([]);
            }

            // 3. Fetch Approved Internships
            try {
                const approvedData = await InternshipService.getApprovedInternships();
                const count = Array.isArray(approvedData) ? approvedData.length : 0;
                setApprovedInternshipsCount(count);
                debugLog.push(`Approved Internships: ${count}`);
            } catch (error) {
                console.error("Approved Internships failed", error);
                debugLog.push(`Approved Internships: 0`);
            }

            // 4. Fetch Pending Recruiters
            try {
                const recruitersData = await RecruiterService.getPendingRecruiters();
                setPendingRecruiters(Array.isArray(recruitersData) ? recruitersData : []);
                debugLog.push(`Pending Recruiters: ${Array.isArray(recruitersData) ? recruitersData.length : 'Not Array'}`);
            } catch (error) {
                console.error("Pending Recruiters failed", error);
                debugLog.push(`Pending Recruiters: 0`);
                setPendingRecruiters([]);
            }

            setDebugInfo(debugLog.join('\n'));
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 dashboard-enter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 dashboard-header">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">PLACEMENT OFFICE</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Institution-level governance and final approvals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Approved Internships" value={approvedInternshipsCount.toString()} icon={CheckCircle} color="purple" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Pending Recruiters" value={pendingRecruiters.length.toString()} icon={Users} color="orange" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="Pending Approvals" value={pendingInternships.length.toString()} icon={Shield} color="blue" />
                </div>
                <div className="dashboard-card stat-card-hover">
                    <StatCard label="External Internships" value={pendingExternalInternships.length.toString()} icon={Building2} color="green" />
                </div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 dashboard-table">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-1 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm">Pending Recruiter Approvals</h3>
                        <div className="flex gap-2">
                            <Link to="/company-approval">
                                <span className="text-xs font-bold text-blue-600 hover:underline">View All</span>
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {pendingRecruiters.length > 0 ? (
                            pendingRecruiters.slice(0, 5).map((recruiter: any) => (
                                <div key={recruiter.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <p className="font-bold text-sm text-[#0F2137]">{recruiter.company_name || recruiter.name}</p>
                                        <p className="text-xs text-slate-500">{recruiter.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="primary" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No pending recruiters</p>
                        )}
                    </div>
                </div>

                {/* Pending Internship Approvals */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-6">Pending Internship Approvals</h3>
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
                            <p className="text-sm text-slate-500 text-center py-4">No pending internships</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Credit Authorization Section */}
            <div className="bg-[#0F2137] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 welcome-banner">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold uppercase tracking-widest text-xs text-blue-400">Credit Authorization System</h3>
                        <p className="text-slate-400 text-xs mt-1">Authorize final credit addition to student records</p>
                    </div>
                    <Button variant="outline" className="border-blue-400/30 text-blue-100 hover:bg-blue-900/30">View All Requests</Button>
                </div>
            </div>
            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded text-xs font-mono text-gray-600 whitespace-pre-wrap">
                <p className="font-bold">Debug Info (Remove after fixing):</p>
                {debugInfo}
            </div>
        </div>
    );
};

export default PlacementOfficeDashboard;
