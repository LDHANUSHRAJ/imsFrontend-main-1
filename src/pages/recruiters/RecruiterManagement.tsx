import { useState, useEffect } from 'react';
import { Plus, UserCheck, Shield, Building2, Search, Filter } from 'lucide-react';
import { RecruiterService } from '../../services/mock/RecruiterService';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Modal from '../../components/ui/Modal';
import RecruiterForm from './RecruiterForm';

const RecruiterManagement = () => {
    const { addNotification } = useNotifications();
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewRecruiter, setPreviewRecruiter] = useState<any | null>(null);

    useEffect(() => { loadRecruiters(); }, []);

    const loadRecruiters = async () => {
        setIsLoading(true);
        const data = await RecruiterService.getAll();
        setRecruiters(data);
        setIsLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean, name: string) => {
        await RecruiterService.toggleStatus(id);
        addNotification({
            title: currentStatus ? 'Account Disabled' : 'Account Activated',
            message: currentStatus
                ? `Company has been banned. "You are no longer linked to Christ University" notification sent.`
                : `${name}'s access to the portal has been restored.`,
            type: currentStatus ? 'warning' : 'success',
            category: 'ACCOUNT'
        });
        loadRecruiters();
    };

    return (
        <div className="animate-in fade-in duration-500">
            <Breadcrumbs items={[{ label: 'Administration', path: '/dashboard' }, { label: 'Recruiter Management' }]} />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Corporate Recruiter Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage external partner access and monitor recruitment activities.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="w-auto px-6 gap-2">
                    <Plus size={18} /> Add Corporate Partner
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20" placeholder="Search by company or recruiter name..." />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <Filter size={16} /> Filter
                </button>
            </div>

            <Table headers={['Corporate Partner', 'Contact Lead', 'Onboarded', 'Access Status', 'Actions']}>
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12">Synchronizing recruiter data...</TableCell></TableRow>
                ) : (
                    recruiters.map((rec) => (
                        <TableRow key={rec.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-[#0F2137] flex items-center justify-center text-white">
                                        <Building2 size={18} />
                                    </div>
                                    <span className="font-bold text-[#0F2137]">{rec.companyName}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm font-semibold text-slate-700">{rec.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{rec.email}</div>
                            </TableCell>
                            <TableCell className="text-slate-500 font-medium text-xs">{rec.createdAt}</TableCell>
                            <TableCell>
                                <Badge variant={rec.isActive ? 'success' : 'error'}>
                                    {rec.isActive ? 'Active Access' : 'Banned'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPreviewRecruiter(rec)}
                                        className="p-2 text-slate-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <div className="flex items-center gap-2"> {/* Lucide-react import needed if not present, but using text for now or existing icons */}
                                            {/* Re-using Building2 or similar if Eye is imported. Eye IS imported in line 2 but not used. */}
                                            {/* Wait, user asked for Eye icon. */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </div>
                                    </button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={rec.isActive ? "text-rose-600 font-bold hover:bg-rose-50" : "text-emerald-600 font-bold hover:bg-emerald-50"}
                                        onClick={() => toggleStatus(rec.id, rec.isActive, rec.companyName)}
                                    >
                                        {rec.isActive ? (
                                            <><Shield size={16} className="mr-2" /> Ban Company</>
                                        ) : (
                                            <><UserCheck size={16} className="mr-2" /> Unban / Activate</>
                                        )}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </Table>

            {/* Preview Modal */}
            {previewRecruiter && (
                <Modal isOpen={!!previewRecruiter} onClose={() => setPreviewRecruiter(null)} title="Company Profile" maxWidth="max-w-2xl">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-16 w-16 rounded-xl bg-[#0F2137] flex items-center justify-center text-white shadow-lg">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F2137]">{previewRecruiter.companyName}</h2>
                                <p className="text-sm text-slate-500">{previewRecruiter.industry}</p>
                                <Badge variant={previewRecruiter.isActive ? 'success' : 'error'} className="mt-2 text-xs">
                                    {previewRecruiter.isActive ? 'Active Partner' : 'Access Revoked'}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Person</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                            {previewRecruiter.name.charAt(0)}
                                        </div>
                                        <p className="font-semibold text-slate-700">{previewRecruiter.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <p className="font-medium text-[#0F2137] mt-1">{previewRecruiter.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Address</label>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{previewRecruiter.address}</p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-[#0F2137] text-sm mb-2">Recruitment Statistics</h3>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                    <span className="text-sm text-slate-600">Active Job Postings</span>
                                    <span className="font-bold text-[#0F2137]">{previewRecruiter.activePostings}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-sm text-slate-600">Total Hires</span>
                                    <span className="font-bold text-emerald-600">{previewRecruiter.hiredCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setPreviewRecruiter(null)}>Close</Button>
                        </div>
                    </div>
                </Modal>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Onboard New Corporate Partner" maxWidth="max-w-2xl">
                <RecruiterForm
                    onSubmit={async (data) => {
                        await RecruiterService.create(data);
                        setIsModalOpen(false);
                        addNotification({ title: 'Partner Registered', message: 'Invitation email sent successfully.', type: 'success' });
                        loadRecruiters();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default RecruiterManagement;