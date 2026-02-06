import { useState, useEffect } from 'react';
import { RecruiterService } from '../../services/mock/RecruiterService';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import { CheckCircle, XCircle, ShieldOff, ShieldCheck, Eye, Loader2, Building2 } from 'lucide-react';

const CompanyApproval = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotifications();
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
    const [viewCredentials, setViewCredentials] = useState<{ email: string, password: string } | null>(null);
    const [isCredLoading, setIsCredLoading] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await RecruiterService.getAll();
            setCompanies(data);
        } catch (error) {
            console.error(error);
            addNotification({ title: 'Error', message: 'Failed to fetch companies', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBan = async (id: string) => {
        if (!confirm('Are you sure you want to ban this company? They will lose access immediately.')) return;
        try {
            await RecruiterService.ban(id);
            addNotification({ title: 'Success', message: 'Company banned successfully', type: 'success' });
            fetchCompanies();
        } catch (error) {
            addNotification({ title: 'Error', message: 'Failed to ban company', type: 'error' });
        }
    };

    const handleUnban = async (id: string) => {
        try {
            await RecruiterService.unban(id);
            addNotification({ title: 'Success', message: 'Company unbanned successfully', type: 'success' });
            fetchCompanies();
        } catch (error) {
            addNotification({ title: 'Error', message: 'Failed to unban company', type: 'error' });
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await RecruiterService.approve(id);
            addNotification({ title: 'Success', message: 'Company approved. They can now login.', type: 'success' });
            fetchCompanies();
        } catch (error) {
            addNotification({ title: 'Error', message: 'Failed to approve company', type: 'error' });
        }
    };

    const handleViewCredentials = async (company: any) => {
        setSelectedCompany(company);
        setIsCredLoading(true);
        setViewCredentials(null);
        try {
            // Mock API call to get creds
            const creds = await RecruiterService.getCredentials(company.id);
            setViewCredentials(creds);
        } catch (error) {
            addNotification({ title: 'Error', message: 'Failed to retrieve credentials', type: 'error' });
            setSelectedCompany(null);
        } finally {
            setIsCredLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#0F2137]">Company Approvals</h1>
                <p className="text-slate-500 mt-1">Manage company registrations, verify credentials, and control access.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Company Name</th>
                                <th className="px-6 py-4">HR Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-8 text-slate-500">Loading...</td></tr>
                            ) : companies.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-slate-500">No companies found</td></tr>
                            ) : (
                                companies.map((company) => (
                                    <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#0F2137] flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-700">
                                                <Building2 size={16} />
                                            </div>
                                            {company.companyName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {company.name} <br />
                                            <span className="text-xs text-slate-400">{company.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : company.status === 'BANNED' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
                                                    <ShieldOff size={12} /> Banned
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                                                    <Loader2 size={12} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleViewCredentials(company)} title="View Login Info">
                                                    <Eye size={14} className="mr-1" /> Login Info
                                                </Button>

                                                {company.isActive ? (
                                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleBan(company.id)}>
                                                        <ShieldOff size={14} className="mr-1" /> Ban
                                                    </Button>
                                                ) : company.status === 'BANNED' ? (
                                                    <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleUnban(company.id)}>
                                                        <ShieldCheck size={14} className="mr-1" /> Unban
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => handleApprove(company.id)}>
                                                        <CheckCircle size={14} className="mr-1" /> Approve
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Credentials Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                        <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <XCircle size={24} />
                        </button>

                        <h3 className="text-lg font-bold text-[#0F2137] mb-1">Company Login Credentials</h3>
                        <p className="text-sm text-slate-500 mb-6">For verification purposes only.</p>

                        {isCredLoading ? (
                            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-600" /></div>
                        ) : viewCredentials && (
                            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                                    <div className="font-mono text-slate-700 select-all">{viewCredentials.email}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">System Password</label>
                                    <div className="font-mono text-slate-700 bg-white border border-slate-200 p-2 rounded mt-1 flex justify-between items-center">
                                        <span>{viewCredentials.password}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <Button onClick={() => setSelectedCompany(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyApproval;
