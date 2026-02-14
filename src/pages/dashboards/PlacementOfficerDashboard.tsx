import { useState, useEffect } from 'react';
import { InternshipService } from '../../services/internship.service';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
    Briefcase, CheckCircle, Clock, FileText,
    ExternalLink, AlertCircle, XCircle, Search
} from 'lucide-react';

const PlacementOfficerDashboard = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    // State
    const [stats, setStats] = useState({
        pendingSystem: 0,
        pendingExternal: 0,
        totalVerified: 0
    });
    const [systemPending, setSystemPending] = useState<any[]>([]);
    const [externalPending, setExternalPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'SYSTEM' | 'EXTERNAL'>('SYSTEM');

    // Fetch Data
    const loadData = async () => {
        setLoading(true);
        try {
            const [sysPending, extPending] = await Promise.all([
                InternshipService.getCoordinatorPendingInternships(),
                InternshipService.getExternalPending()
            ]);

            setSystemPending(sysPending || []);
            setExternalPending(extPending || []);

            setStats({
                pendingSystem: sysPending?.length || 0,
                pendingExternal: extPending?.length || 0,
                totalVerified: 0 // Placeholder, backend API needed for total verified count
            });

        } catch (error) {
            console.error("Dashboard fetch error:", error);
            addNotification({
                title: 'Error',
                message: 'Failed to load dashboard data.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handlers
    const handleApproveSystem = async (id: string, title: string) => {
        if (!window.confirm(`Approve internship "${title}"? It will be visible to students.`)) return;
        try {
            await InternshipService.approveInternship(id);
            addNotification({
                title: 'Approved',
                message: 'Internship approved successfully.',
                type: 'success'
            });
            loadData();
        } catch (error: any) {
            addNotification({
                title: 'Failed',
                message: error?.response?.data?.detail || 'Approval failed.',
                type: 'error'
            });
        }
    };

    const handleRejectSystem = async (id: string, title: string) => {
        if (!window.confirm(`Reject internship "${title}"?`)) return;
        try {
            await InternshipService.rejectInternship(id);
            addNotification({
                title: 'Rejected',
                message: 'Internship rejected.',
                type: 'info'
            });
            loadData();
        } catch (error: any) {
            addNotification({
                title: 'Failed',
                message: error?.response?.data?.detail || 'Rejection failed.',
                type: 'error'
            });
        }
    };

    const handleApproveExternal = async (id: string, title: string) => {
        if (!window.confirm(`Approve external request "${title}"?`)) return;
        try {
            await InternshipService.approveExternal(id);
            addNotification({
                title: 'Approved',
                message: 'External request approved.',
                type: 'success'
            });
            loadData();
        } catch (error: any) {
            addNotification({
                title: 'Failed',
                message: error?.response?.data?.detail || 'Approval failed.',
                type: 'error'
            });
        }
    };

    const handleRejectExternal = async (id: string, title: string) => {
        if (!window.confirm(`Reject external request "${title}"?`)) return;
        try {
            await InternshipService.rejectExternal(id);
            addNotification({
                title: 'Rejected',
                message: 'External request rejected.',
                type: 'info'
            });
            loadData();
        } catch (error: any) {
            addNotification({
                title: 'Failed',
                message: error?.response?.data?.detail || 'Rejection failed.',
                type: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christBlue"></div>
            </div>
        );
    }

    // Components
    const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
                    <h3 className="text-3xl font-black text-slate-800 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={color} size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-christBlue">Placement Coordinator Portal</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage internship approvals and external requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold bg-blue-50 text-christBlue px-4 py-2 rounded-full border border-blue-100">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Pending Approvals"
                    value={stats.pendingSystem}
                    icon={Clock}
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
                <StatCard
                    title="External Requests"
                    value={stats.pendingExternal}
                    icon={ExternalLink}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Total Actions"
                    value={stats.pendingSystem + stats.pendingExternal}
                    icon={CheckCircle}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('SYSTEM')}
                        className={`px-8 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'SYSTEM'
                            ? 'bg-white text-christBlue border-b-2 border-christBlue'
                            : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Pending Internships
                    </button>
                    <button
                        onClick={() => setActiveTab('EXTERNAL')}
                        className={`px-8 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'EXTERNAL'
                            ? 'bg-white text-christBlue border-b-2 border-christBlue'
                            : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        External Requests
                    </button>
                </div>

                {/* Table Content */}
                <div className="p-6">
                    {activeTab === 'SYSTEM' ? (
                        systemPending.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Company</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Title</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Posted Date</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {systemPending.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 text-sm font-bold text-slate-700">{item.company_name || 'Unknown'}</td>
                                                <td className="p-4">
                                                    <p className="text-sm font-bold text-[#0F2137]">{item.title}</p>
                                                    <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRejectSystem(item.id, item.title)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold uppercase"
                                                        title="Reject"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveSystem(item.id, item.title)}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all text-xs font-bold uppercase"
                                                    >
                                                        Verify
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4 text-slate-400">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">No Pending Internships</h3>
                                <p className="text-slate-500 text-sm">All system internships have been verified.</p>
                            </div>
                        )
                    ) : (
                        externalPending.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Student</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Company / Role</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Date</th>
                                            <th className="p-4 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {externalPending.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4">
                                                    <p className="text-sm font-bold text-slate-700">{item.student?.name}</p>
                                                    <p className="text-xs text-slate-400">{item.student?.email}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-sm font-bold text-[#0F2137]">{item.company_name}</p>
                                                    <p className="text-xs text-slate-500">{item.title}</p>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRejectExternal(item.id, item.title)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold uppercase"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveExternal(item.id, item.title)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all text-xs font-bold uppercase"
                                                    >
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4 text-slate-400">
                                    <ExternalLink size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">No External Requests</h3>
                                <p className="text-slate-500 text-sm">There are no pending external internship requests.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlacementOfficerDashboard;
