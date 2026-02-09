import { useState, useEffect } from 'react';
import { RecruiterService } from '../../services/recruiter.service';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { CheckCircle, XCircle, ShieldOff, ShieldCheck, Eye, Loader2, Building2, ShieldAlert, Globe, Linkedin } from 'lucide-react';

const CompanyApproval = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, [user]);

    const fetchCompanies = async () => {
        try {
            let data = [];

            if (user?.role === 'PLACEMENT_HEAD') {
                // Strict: Only fetch pending recruiters for specific approval page
                data = await RecruiterService.getGlobalPendingRecruiters();
            } else {
                // Fallback for other roles (e.g. Officer) - might use getAll or keep existing logic
                // But for Officer, they might have their own pending endpoint.
                // Assuming getAll filters correctly or we use what was there.
                data = await RecruiterService.getAll(user?.role);
                // Filter specifically for pending if getAll returns mixed
                data = data.filter(r => !r.isActive || r.status === 'PENDING');
            }

            // Data is already normalized by service now
            setCompanies(data);
        } catch (error) {
            console.error("Fetch companies failed:", error);
            addNotification({ title: 'Error', message: 'Failed to fetch company list', type: 'error' });
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
            const company = companies.find(c => c.id === id);
            if (!company) return;

            // Placement Head uses verifyRecruiterGlobal
            if (user?.role === 'PLACEMENT_HEAD') {
                await RecruiterService.verifyRecruiterGlobal(company.user_id, true);
            } else {
                await RecruiterService.approveRecruiter(company.user_id, true);
            }

            addNotification({ title: 'Success', message: 'Company approved successfully', type: 'success' });
            fetchCompanies(); // Refresh list
        } catch (error: any) {
            console.error('Approval error:', error);
            addNotification({ title: 'Error', message: 'Failed to approve company', type: 'error' });
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject this company?')) return;
        try {
            const company = companies.find(c => c.id === id);
            if (!company) return;

            if (user?.role === 'PLACEMENT_HEAD') {
                await RecruiterService.verifyRecruiterGlobal(company.user_id, false);
            } else {
                await RecruiterService.approveRecruiter(company.user_id, false);
            }

            addNotification({ title: 'Success', message: 'Company rejected', type: 'success' });
            fetchCompanies();
        } catch (error) {
            console.error('Rejection error:', error);
            addNotification({ title: 'Error', message: 'Failed to reject company', type: 'error' });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#0F2137]">Company Approvals</h1>
                <p className="text-slate-500 mt-1">Manage company registrations, verify credentials, and control access.</p>
            </div>

            {companies.some(c => !c.isActive && RecruiterService.calculateTrustScore(c) < 60) && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-900">High-Risk Registrations Detected</h4>
                        <p className="text-xs text-amber-700 mt-0.5">Some pending companies have low AI trust scores. Please verify their corporate credentials manually before approval.</p>
                    </div>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Company Name</th>
                                <th className="px-6 py-4">HR Contact</th>
                                <th className="px-6 py-4">Trust Score</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading...</td></tr>
                            ) : companies.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No companies found</td></tr>
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
                                            {(() => {
                                                const score = RecruiterService.calculateTrustScore(company);
                                                return (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                    style={{ width: `${score}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-xs font-black ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                                                {score}%
                                                            </span>
                                                        </div>
                                                        {score < 60 && (
                                                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter flex items-center gap-1">
                                                                <ShieldAlert size={10} /> Risky Domain
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })()}
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
                                                <Button size="sm" variant="outline" onClick={() => setSelectedCompany(company)} title="View Details">
                                                    <Eye size={14} className="mr-1" /> View Details
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
                                                    <>
                                                        <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => handleApprove(company.id)}>
                                                            <CheckCircle size={14} className="mr-1" /> Approve
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(company.id)}>
                                                            <XCircle size={14} className="mr-1" /> Reject
                                                        </Button>
                                                    </>
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

            {/* Company Details Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <XCircle size={24} />
                        </button>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="text-blue-600" size={28} />
                                <div>
                                    <h3 className="text-xl font-bold text-[#0F2137]">{selectedCompany.companyName}</h3>
                                    <p className="text-slate-500 text-sm">{selectedCompany.industry || 'Industry N/A'} • {selectedCompany.company_type || 'Type N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Corporate Identity</h4>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">CIN (Corporate ID)</label>
                                    <div className="font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block border border-slate-200 text-sm">
                                        {selectedCompany.cin || 'N/A'}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Registered Address</label>
                                    <p className="text-sm text-slate-700">{selectedCompany.registered_address || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Website</label>
                                    {selectedCompany.website_url ? (
                                        <a href={selectedCompany.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                            <Globe size={14} /> {selectedCompany.website_url}
                                        </a>
                                    ) : <span className="text-slate-400 text-sm">N/A</span>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">LinkedIn</label>
                                    {selectedCompany.linkedin_url ? (
                                        <a href={selectedCompany.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                            <Linkedin size={14} /> View Profile
                                        </a>
                                    ) : <span className="text-slate-400 text-sm">N/A</span>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-800 text-sm border-b pb-2">HR Contact & Credentials</h4>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">HR Name</label>
                                    <p className="text-sm text-slate-700">{selectedCompany.name}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Official Email</label>
                                    <div className="font-mono text-slate-700 select-all flex items-center gap-2">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        {selectedCompany.email}
                                    </div>
                                </div>

                                {selectedCompany.password && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase block mb-1">System Password</label>
                                        <div className="font-mono text-slate-700 bg-slate-50 border border-slate-200 p-2 rounded text-xs break-all">
                                            {selectedCompany.password}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 mt-2 border-t border-slate-100">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-blue-800">AI Trust Score</span>
                                            <span className="text-lg font-black text-blue-700">{RecruiterService.calculateTrustScore(selectedCompany)}/100</span>
                                        </div>
                                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${RecruiterService.calculateTrustScore(selectedCompany)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                            <Button variant="outline" onClick={() => setSelectedCompany(null)}>Close</Button>
                            {!selectedCompany.isActive && (
                                <>
                                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => { handleReject(selectedCompany.id); setSelectedCompany(null); }}>
                                        Reject Registration
                                    </Button>
                                    <Button onClick={() => { handleApprove(selectedCompany.id); setSelectedCompany(null); }}>
                                        Approve Registration
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyApproval;
