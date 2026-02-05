import { useState, useEffect } from 'react';
import { Plus, Edit2, Archive, CheckCircle, Calendar, Eye } from 'lucide-react';
import { SessionService } from '../../services/mock/SessionService';
import type { InternshipSession } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Modal from '../../components/ui/Modal';
import SessionForm from './SessionForm';
import { useNotifications } from '../../context/NotificationContext';
import { PROGRAMS } from '../../data/programs';

const SessionList = () => {
    const { addNotification } = useNotifications();
    const [sessions, setSessions] = useState<InternshipSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<InternshipSession | undefined>(undefined);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        program: '',
        subProgram: '',
        mode: '',
        status: '',
        duration: '',
        stipend: ''
    });

    const [previewSession, setPreviewSession] = useState<InternshipSession | null>(null);

    // Derived state for filtered sessions
    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.academicYear.toLowerCase().includes(filters.search.toLowerCase()) ||
            session.program.toLowerCase().includes(filters.search.toLowerCase());
        const matchesProgram = !filters.program || session.program === filters.program;
        const matchesSubProgram = !filters.subProgram || session.subProgram === filters.subProgram;

        const matchesStatus = !filters.status || (filters.status === 'active' ? session.isActive : !session.isActive);
        const matchesDuration = !filters.duration || (session.duration && session.duration.toLowerCase().includes(filters.duration.toLowerCase()));
        const matchesStipend = !filters.stipend || (session.stipend && session.stipend.includes(filters.stipend));
        const matchesMode = !filters.mode || session.mode === filters.mode;

        return matchesSearch && matchesProgram && matchesSubProgram && matchesStatus && matchesDuration && matchesStipend && matchesMode;
    });

    const handlePreview = (session: InternshipSession) => {
        setPreviewSession(session);
    };

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Search</label>
                    <input
                        type="text"
                        placeholder="Search by academic year, etc..."
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Program</label>
                    <select
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.program}
                        onChange={(e) => setFilters({ ...filters, program: e.target.value, subProgram: '' })}
                    >
                        <option value="">All Programs</option>
                        {PROGRAMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Sub Program</label>
                    <select
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.subProgram}
                        onChange={(e) => setFilters({ ...filters, subProgram: e.target.value })}
                        disabled={!filters.program}
                    >
                        <option value="">All Sub Programs</option>
                        {filters.program && PROGRAMS.find(p => p.name === filters.program)?.subprograms.map(sp => (
                            <option key={sp} value={sp}>{sp}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Internship Mode</label>
                    <select
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.mode}
                        onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                    >
                        <option value="">Any Mode</option>
                        <option value="ONSITE">Onsite</option>
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                    <select
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                    <input
                        type="text"
                        placeholder="e.g. 6 Months"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.duration}
                        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Stipend</label>
                    <input
                        type="text"
                        placeholder="Min Amount"
                        className="w-full mt-1 p-2 border rounded text-sm"
                        value={filters.stipend}
                        onChange={(e) => setFilters({ ...filters, stipend: e.target.value })}
                    />
                </div>
            </div>

            <Table headers={['Academic Details', 'Program / Batch', 'Internship Duration', 'Status', 'Actions']}>
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12">Synchronizing academic data...</TableCell></TableRow>
                ) : (
                    filteredSessions.map((session) => (
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
                                {session.duration && (
                                    <div className="text-[10px] text-slate-400 font-medium mt-1 pl-6">
                                        {session.duration}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={session.isActive ? 'success' : 'neutral'}>
                                    {session.isActive ? 'Live' : 'Archived'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="text-slate-400 hover:text-blue-500 transition-colors"
                                        title="Preview Session"
                                        onClick={() => handlePreview(session)}
                                    >
                                        <Eye size={16} />
                                    </button>
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

            <Modal
                isOpen={!!previewSession}
                onClose={() => setPreviewSession(null)}
                title="Session Preview"
                maxWidth="max-w-lg"
            >
                {previewSession && (
                    <div className="space-y-4 p-4">
                        <div className="border-b pb-2">
                            <h3 className="text-lg font-bold text-[#0F2137]">{previewSession.academicYear}</h3>
                            <p className="text-sm text-slate-500">{previewSession.program}</p>
                            {previewSession.subProgram && <p className="text-xs text-slate-400 mt-1">{previewSession.subProgram}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-xs font-bold text-slate-400">Batch</span>
                                <span className="font-medium text-slate-700">{previewSession.batch}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400">Status</span>
                                <Badge variant={previewSession.isActive ? 'success' : 'neutral'}>
                                    {previewSession.isActive ? 'Live' : 'Archived'}
                                </Badge>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400">Start Date</span>
                                <span className="font-medium text-slate-700">{previewSession.startDate}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400">End Date</span>
                                <span className="font-medium text-slate-700">{previewSession.endDate}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t mt-2">
                            <div>
                                <span className="block text-xs font-bold text-slate-400">Duration</span>
                                <span className="font-medium text-slate-700">{previewSession.duration || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400">Stipend</span>
                                <span className="font-medium text-slate-700">{previewSession.stipend ? `₹${previewSession.stipend}` : 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400">Mode</span>
                                <span className="font-medium text-slate-700">{previewSession.mode || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button variant="secondary" onClick={() => setPreviewSession(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SessionList;