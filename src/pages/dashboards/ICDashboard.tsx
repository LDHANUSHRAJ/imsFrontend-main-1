import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Users, Building2, Briefcase, Calendar, CheckCircle, Plus } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import PlacementStatsChart from '../../components/charts/PlacementStatsChart';
import ApplicationsTrendChart from '../../components/charts/ApplicationsTrendChart';
import DashboardFilters from '../../components/ui/DashboardFilters';
import Modal from '../../components/ui/Modal';
import SessionForm from '../sessions/SessionForm';
import RecruiterForm from '../recruiters/RecruiterForm';
import { SessionService } from '../../services/mock/SessionService';
import { RecruiterService } from '../../services/mock/RecruiterService';
import type { InternshipSession } from '../../types';

const ICDashboard = () => {
    const { addNotification } = useNotifications();
    const [year, setYear] = useState('2024-2025');
    const [batch, setBatch] = useState('All Batches');
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);

    const handleCreateSession = async (data: Partial<InternshipSession>) => {
        console.log("Creating session:", data);
        try {
            await SessionService.create(data);
            addNotification({
                title: 'Session Created',
                message: `${data.program} ${data.academicYear} session is now active.`,
                type: 'success',
                category: 'SYSTEM'
            });
        } catch (error) {
            console.error("Session creation failed", error);
            addNotification({
                title: 'Error',
                message: 'Failed to create session.',
                type: 'error',
                category: 'SYSTEM'
            });
        }
        setIsSessionModalOpen(false);
    };

    const handleAddCorporate = async (data: any) => {
        console.log("Adding corporate:", data);
        try {
            await RecruiterService.create(data);
            addNotification({
                title: 'Recruiter Added',
                message: `Invitation sent to ${data.email}`,
                type: 'success',
                category: 'SYSTEM'
            });
        } catch (error) {
            console.error("Recruiter creation failed", error);
            addNotification({
                title: 'Error',
                message: 'Failed to add recruiter.',
                type: 'error',
                category: 'SYSTEM'
            });
        }
        setIsRecruiterModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Internship Coordinator Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage corporate recruiter accounts and global internship sessions.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        className="w-auto gap-2"
                        onClick={() => setIsRecruiterModalOpen(true)}
                    >
                        <Plus size={18} /> Add Corporate
                    </Button>
                    <Button
                        variant="primary"
                        className="w-auto gap-2"
                        onClick={() => setIsSessionModalOpen(true)}
                    >
                        <Plus size={18} /> Create Session
                    </Button>
                </div>
            </div>

            <DashboardFilters
                years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'MCA', value: 'MCA' }, { label: 'MBA', value: 'MBA' }]}
                selectedYear={year}
                selectedBatch={batch}
                onYearChange={setYear}
                onBatchChange={setBatch}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Active Students" value="120" icon={Users} color="navy" />
                <StatCard label="Corporate Partners" value="45" icon={Building2} color="purple" />
                <StatCard label="Open Vacancies" value="18" icon={Briefcase} color="amber" />
                <StatCard label="Pending Recruiter Access" value="03" icon={CheckCircle} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PlacementStatsChart data={[
                    { name: 'MCA', placed: 40, pending: 24 },
                    { name: 'MBA', placed: 65, pending: 15 },
                    { name: 'MSc CS', placed: 30, pending: 10 },
                    { name: 'BCA', placed: 80, pending: 35 },
                ]} />
                <ApplicationsTrendChart data={[
                    { name: 'Jan', applications: 20 },
                    { name: 'Feb', applications: 45 },
                    { name: 'Mar', applications: 70 },
                    { name: 'Apr', applications: 65 },
                    { name: 'May', applications: 100 },
                ]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-6">Recruiter Access Requests</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#3B82F6] transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 bg-[#0F2137] text-white rounded-lg flex items-center justify-center text-xs font-bold uppercase italic">
                                        C{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 leading-none">Venture Soft {i}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Applied 2h ago</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-auto h-8 px-3 text-[#3B82F6]">REVIEW</Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0F2137] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <Calendar className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12" />
                    <h3 className="font-bold uppercase tracking-widest text-xs text-blue-400 mb-4">Critical Deadlines</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="border-l-2 border-amber-400 pl-4 py-1">
                            <p className="text-sm font-bold">Student Registration Phase</p>
                            <p className="text-xs text-slate-400">Ends in <span className="text-amber-400">48 Hours</span></p>
                        </div>
                        <div className="border-l-2 border-blue-400 pl-4 py-1">
                            <p className="text-sm font-bold">Offer Letter Uploads</p>
                            <p className="text-xs text-slate-400">Deadline: 15th October 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                title="Open New Internship Session"
                maxWidth="max-w-2xl"
            >
                <SessionForm
                    onSubmit={handleCreateSession}
                    onCancel={() => setIsSessionModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isRecruiterModalOpen}
                onClose={() => setIsRecruiterModalOpen(false)}
                title="Add New Corporate Partner"
                maxWidth="max-w-2xl"
            >
                <RecruiterForm
                    onSubmit={handleAddCorporate}
                    onCancel={() => setIsRecruiterModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ICDashboard;
