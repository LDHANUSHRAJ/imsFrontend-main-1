import { useState, useEffect } from 'react';
import { InternshipService } from '../../services/internship.service';
import Button from '../../components/ui/Button';
import { FileText, CheckCircle, ExternalLink, Download } from 'lucide-react';

const CustomApprovals = () => {
    const [activeTab, setActiveTab] = useState<'External' | 'System'>('External');
    const [externalPending, setExternalPending] = useState<any[]>([]);
    const [systemPending, setSystemPending] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [ext, sys] = await Promise.all([
                InternshipService.getExternalPending(),
                InternshipService.getPendingInternships() // Changed from getPendingOfferLetters
            ]);
            setExternalPending(ext || []);
            setSystemPending(sys || []);
        } catch (error) {
            console.error("Failed to load approvals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleApproveExternal = async (id: string) => {
        if (!window.confirm("Approve this external internship?")) return;
        try {
            await InternshipService.approveExternal(id);
            alert("Approved successfully");
            loadData();
        } catch (e) {
            console.error(e);
            alert("Failed to approve");
        }
    };

    const handleRejectExternal = async (id: string) => {
        if (!window.confirm("Reject this external internship?")) return;
        try {
            await InternshipService.rejectExternal(id);
            alert("Rejected successfully");
            loadData();
        } catch (e) {
            console.error(e);
            alert("Failed to reject");
        }
    }

    const handleApproveSystem = async (id: string) => {
        if (!window.confirm("Approve this internship?")) return;
        try {
            await InternshipService.approve(id); // Using standard approve for Pending Internships
            alert("Internship approved successfully");
            loadData();
        } catch (e) {
            console.error(e);
            alert("Failed to approve");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-[#0F2137] tracking-tight">Custom Approvals</h1>
                <p className="text-slate-500 font-bold mt-2">Verify and approve student-uploaded offer letters.</p>
            </div>

            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('External')}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'External' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    External Applications
                </button>
                <button
                    onClick={() => setActiveTab('System')}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'System' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    System Offers
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-slate-400 animate-pulse">Loading requests...</div>
            ) : (
                <div className="grid gap-6">
                    {activeTab === 'External' && (
                        externalPending.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-400 font-bold">No pending external applications.</p>
                            </div>
                        ) : (
                            externalPending.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase px-2 py-1 rounded-md">External</span>
                                            <h3 className="font-black text-lg text-[#0F2137]">{item.company_name}</h3>
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm mb-1">Role: <span className="text-slate-800">{item.position || item.title}</span></p>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Student ID: {item.student_id || 'Unknown'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                                        {item.offer_letter && (
                                            <a
                                                href={item.offer_letter} // Adjust based on actual API response field
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline"
                                            >
                                                <Download size={14} /> View Offer Letter
                                            </a>
                                        )}
                                        <div className="flex gap-2 w-full mt-auto">
                                            <Button onClick={() => handleRejectExternal(item.id)} variant="outline" className="flex-1 text-xs h-10 border-red-100 text-red-600 hover:bg-red-50">Reject</Button>
                                            <Button onClick={() => handleApproveExternal(item.id)} className="flex-1 text-xs h-10 bg-[#0F2137] text-white hover:bg-blue-900">Approve</Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {activeTab === 'System' && (
                        systemPending.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                <CheckCircle className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-400 font-bold">No pending system offers.</p>
                            </div>
                        ) : (
                            systemPending.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-2 py-1 rounded-md">System</span>
                                            <h3 className="font-black text-lg text-[#0F2137]">Application #{item.id.slice(-6)}</h3>
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm">Review uploaded offer for verification.</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                                        <a
                                            href={item.offer_letter_url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline"
                                        >
                                            <ExternalLink size={14} /> View Document
                                        </a>
                                        <div className="flex gap-2 w-full mt-auto">
                                            <Button onClick={() => handleApproveSystem(item.id)} className="w-full text-xs h-10 bg-emerald-600 text-white hover:bg-emerald-700">Approve & Activate</Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomApprovals;
