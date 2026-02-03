import { useState, useEffect } from 'react';
import { Plus, Edit2, Archive, CheckCircle, Calendar, Filter } from 'lucide-react';
import { SessionService } from '../../services/mock/SessionService';
import type { InternshipSession } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Modal from '../../components/ui/Modal';
import SessionForm from './SessionForm';
import { useNotifications } from '../../context/NotificationContext';

const SessionList = () => {
    const { addNotification } = useNotifications();
    const [sessions, setSessions] = useState<InternshipSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<InternshipSession | undefined>(undefined);

    useEffect(() => { loadSessions(); }, []);

    const loadSessions = async () => {
        setIsLoading(true);
        const data = await SessionService.getAll();
        setSessions(data);
        setIsLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean, year: string) => {
        await SessionService.toggleStatus(id);
        addNotification({
            title: currentStatus ? 'Session Closed' : 'Session Activated',
            message: `The ${year} internship cycle is now ${currentStatus ? 'archived' : 'live'}.`,
            type: currentStatus ? 'warning' : 'success',
            category: 'SYSTEM'
        });
        loadSessions();
    };

    const handleCreate = () => {
        setEditingSession(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (session: InternshipSession) => {
        setEditingSession(session);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Partial<InternshipSession>) => {
        if (editingSession) {
            await SessionService.update(editingSession.id, data);
        } else {
            await SessionService.create(data as any);
        }
        setIsModalOpen(false);
        loadSessions();
    };

    return (
        <div className="animate-in fade-in duration-500">
            <Breadcrumbs items={[{ label: 'Administration', path: '/dashboard' }, { label: 'Internship Sessions' }]} />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Academic Sessions</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Configure batch-specific internship timelines and eligibility.</p>
                </div>
                <Button onClick={handleCreate} className="w-auto px-6 gap-2">
                    <Plus size={18} /> Define New Session
                </Button>
            </div>

            <Table headers={['Academic Details', 'Program / Batch', 'Internship Duration', 'Status', 'Actions']}>
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12">Synchronizing academic data...</TableCell></TableRow>
                ) : (
                    sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell className="font-bold text-[#0F2137]">{session.academicYear}</TableCell>
                            <TableCell>
                                <div className="text-sm font-semibold text-slate-700">{session.program}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Batch: {session.batch}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                    <Calendar size={14} className="text-[#3B82F6]" />
                                    {session.startDate} <span className="text-slate-300">→</span> {session.endDate}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={session.isActive ? 'success' : 'neutral'}>
                                    {session.isActive ? 'Live' : 'Archived'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <button className="text-slate-400 hover:text-[#3B82F6] transition-colors" onClick={() => handleEdit(session)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        className={session.isActive ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"}
                                        title={session.isActive ? "Archive Session" : "Activate Session"}
                                        onClick={() => toggleStatus(session.id, session.isActive, session.academicYear)}
                                    >
                                        {session.isActive ? <Archive size={16} /> : <CheckCircle size={16} />}
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </Table>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingSession ? "Modify Session Parameters" : "Initialize Internship Session"}
                maxWidth="max-w-2xl"
            >
                <SessionForm
                    initialData={editingSession}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default SessionList;