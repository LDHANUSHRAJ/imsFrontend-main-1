import React, { useState, useEffect } from 'react';
import { Plus, UserX, UserCheck, Shield, Building2, Search, Filter } from 'lucide-react';
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
            message: `${name}'s access to the portal has been ${currentStatus ? 'revoked' : 'restored'}.`,
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
                                    {rec.isActive ? 'Active Access' : 'Access Revoked'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={rec.isActive ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}
                                    onClick={() => toggleStatus(rec.id, rec.isActive, rec.companyName)}
                                >
                                    {rec.isActive ? (
                                        <><UserX size={16} className="mr-2" /> Revoke</>
                                    ) : (
                                        <><UserCheck size={16} className="mr-2" /> Activate</>
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </Table>

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