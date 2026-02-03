import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, MessageSquare, PlusCircle, Search, Calendar, ArrowRight } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import DashboardFilters from '../../components/ui/DashboardFilters';
import RecruiterStatsChart from '../../components/charts/RecruiterStatsChart';
import { SessionService } from '../../services/mock/SessionService';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [year, setYear] = useState('2024-2025');
    const [batch, setBatch] = useState('All Batches');

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await SessionService.getAll();
            // Filter to show only active sessions to recruiters
            setSessions(data.filter(s => s.isActive) || []);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const chartData = [
        { name: 'Week 1', applications: 12, views: 45 },
        { name: 'Week 2', applications: 19, views: 55 },
        { name: 'Week 3', applications: 35, views: 90 },
        { name: 'Week 4', applications: 28, views: 75 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Corporate Recruiter Portal</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Post opportunities and manage CHRIST University talent applications.</p>
                </div>
                <Button
                    variant="secondary"
                    className="w-auto gap-2 bg-[#3B82F6] text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
                    onClick={() => navigate('/jobs/new')}
                >
                    <PlusCircle size={18} /> NEW POSTING
                </Button>
            </div>

            <DashboardFilters
                years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'MCA', value: 'MCA' }, { label: 'MBA', value: 'MBA' }]}
                selectedYear={year}
                selectedBatch={batch}
                onYearChange={setYear}
                onBatchChange={setBatch}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Active Postings" value={sessions.length.toString().padStart(2, '0')} icon={Briefcase} color="navy" />
                    <StatCard label="New Applications" value="48" icon={Users} color="purple" trend="+12 today" trendUp />
                    <StatCard label="Unread Queries" value="01" icon={MessageSquare} color="amber" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <RecruiterStatsChart data={chartData} />

                {/* Active Recruitment Drives Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#0F2137]">Active Recruitment Drives</h2>

                    {isLoading ? (
                        <div className="p-12 text-center border border-dashed border-slate-300 rounded-xl">
                            <p className="text-slate-400">Loading sessions...</p>
                        </div>
                    ) : sessions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto">
                            {sessions.map((session: any) => (
                                <div key={session.id || session._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Calendar size={20} />
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                                    </div>
                                    <h3 className="font-bold text-[#0F2137] text-lg mb-1">{session.program || 'General Internship'} - {session.academicYear}</h3>
                                    <p className="text-slate-500 text-sm mb-4">Batch: {session.batch}</p>

                                    <div className="flex items-center text-xs text-slate-400 mb-4 gap-4">
                                        <span>Start: {new Date(session.startDate).toLocaleDateString()}</span>
                                        <span>End: {new Date(session.endDate).toLocaleDateString()}</span>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-between group hover:border-[#0F2137] hover:text-[#0F2137]"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        View Opportunities <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="text-slate-300 h-8 w-8" />
                            </div>
                            <h3 className="text-base font-bold text-[#0F2137] mb-1">No active drives</h3>
                            <p className="text-slate-500 text-xs max-w-sm mx-auto">
                                There are currently no active internship sessions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
