import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Eye, Briefcase, Building2 } from 'lucide-react';
import { JobService } from '../../services/mock/JobService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Modal from '../../components/ui/Modal';
import JobForm from './JobForm';

const JobPostingList = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { loadJobs(); }, []);

    const loadJobs = async () => {
        setIsLoading(true);
        const data = await JobService.getAll();
        setJobs(data);
        setIsLoading(false);
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        await JobService.updateStatus(id, status);
        addNotification({
            title: status === 'APPROVED' ? 'Posting Published' : 'Posting Rejected',
            message: status === 'APPROVED' ? 'Syncing with Student App via ERP API...' : 'Feedback sent to recruiter.',
            type: status === 'APPROVED' ? 'success' : 'error',
            category: 'SYSTEM'
        });
        loadJobs();
    };

    return (
        <div className="animate-in fade-in duration-500">
            <Breadcrumbs items={[{ label: 'Internship Portal', path: '/dashboard' }, { label: 'Job Postings' }]} />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Internship Postings</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        {user?.role === 'RECRUITER'
                            ? 'Manage your corporate opportunities'
                            : 'Review and verify external internship requests'}
                    </p>
                </div>
                {user?.role === 'RECRUITER' && (
                    <Button onClick={() => setIsModalOpen(true)} className="w-auto px-6 gap-2">
                        <Plus size={18} /> Post Opportunity
                    </Button>
                )}
            </div>

            <Table headers={['Opportunity', 'Company', 'Stipend', 'Status', 'Actions']}>
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10">Loading opportunities...</TableCell></TableRow>
                ) : (
                    jobs.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-slate-800">{job.title}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1 mt-0.5">
                                        <MapPin size={10} /> {job.location}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium italic">
                                {job.companyName || 'Corporate Partner'}
                            </TableCell>
                            <TableCell className="font-bold text-[#3B82F6]">₹{job.stipend}/mo</TableCell>
                            <TableCell>
                                <Badge variant={job.status === 'APPROVED' ? 'success' : job.status === 'REJECTED' ? 'error' : 'warning'}>
                                    {job.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <button className="text-slate-400 hover:text-[#0F2137] transition-colors"><Eye size={18} /></button>

                                    {/* Part A: IC/Placement Approval Flow */}
                                    {(user?.role === 'IC' || user?.role === 'HOD') && job.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => handleAction(job.id, 'APPROVED')} className="text-emerald-500 hover:bg-emerald-50 p-1 rounded transition-colors" title="Approve & Publish">
                                                <Check size={18} strokeWidth={3} />
                                            </button>
                                            <button onClick={() => handleAction(job.id, 'REJECTED')} className="text-rose-500 hover:bg-rose-50 p-1 rounded transition-colors" title="Reject">
                                                <X size={18} strokeWidth={3} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </Table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Internship Posting" maxWidth="max-w-3xl">
                <JobForm
                    onSubmit={async (data: any) => {
                        await JobService.create(data);
                        setIsModalOpen(false);
                        loadJobs();
                        addNotification({ title: 'Submitted', message: 'Sent for IC approval.', type: 'info' });
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default JobPostingList;