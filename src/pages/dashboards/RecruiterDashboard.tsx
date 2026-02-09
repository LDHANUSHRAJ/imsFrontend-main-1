
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, MessageSquare, PlusCircle, Search, User, Edit, Eye } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { RecruiterService } from '../../services/recruiter.service';
import { Lock } from 'lucide-react';
import type { StudentApplication } from '../../types';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [myInternships, setMyInternships] = useState<Internship[]>([]);
    const [allApplications, setAllApplications] = useState<StudentApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        // Ban check removed as it required admin privileges. 
        // Assuming active if logged in, or handled by backend 403s.
        loadInternships();
    }, [user]);

    useEffect(() => {
        if (myInternships.length > 0) {
            loadApplications();
        }
    }, [myInternships]);

    const loadInternships = async () => {
        try {
            const data = await InternshipService.getMyInternships();
            setMyInternships(data || []);
        } catch (error) {
            console.error("Failed to fetch internships", error);
        }
    };

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            // Fetch applications for each internship
            const appPromises = myInternships.map(internship =>
                InternshipService.getApplications(internship.id)
                    .catch(err => {
                        console.warn(`Failed to fetch apps for ${internship.id}`, err);
                        return [];
                    })
            );

            const results = await Promise.all(appPromises);
            const allApps = results.flat();
            setAllApplications(allApps);
        } catch (error) {
            console.error("Failed to load applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [previewJob, setPreviewJob] = useState<Internship | null>(null);
    const { addNotification } = useNotifications(); // Assuming this hook is available globally or imported

    // ... existing loadInternships ...

    const handleStatusToggle = async (id: string, currentStatus: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Toggle logic: If ACTIVE -> CLOSED, if CLOSED -> ACTIVE (assuming backend supports it or we just label it)
        // Since we don't have a direct 'active' boolean in type, let's assume 'status' field usage or a new field.
        // For now, let's assume we can 'close' an internship.
        if (currentStatus === 'CLOSED') return; // Can't reopen?

        try {
            await InternshipService.close(id);
            addNotification({ title: 'Status Updated', message: 'Internship closed successfully', type: 'success' });
            loadInternships();
        } catch (error) {
            console.error("Failed to update status", error);
            addNotification({ title: 'Error', message: 'Failed to update status', type: 'error' });
        }
    };

    if (isBanned) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <Lock className="h-16 w-16 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#0F2137] mb-4">YOU ARE RESTRICTED</h1>
                <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed mb-8">
                    You are no longer linked to Christ University. Your access to the recruitment portal has been suspended.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl max-w-lg w-full">
                    <h3 className="font-bold text-[#0F2137] mb-2">Need Help?</h3>
                    <p className="text-slate-600 mb-4">Please contact the Placement Office for further assistance regarding your account status.</p>
                    <a href="mailto:placement@christuniversity.in" className="text-blue-600 font-bold hover:underline">
                        placement@christuniversity.in
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 dashboard-enter relative">
            {/* ... Header and Filters ... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 dashboard-header">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Corporate Recruiter Portal</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Post opportunities and manage CHRIST University talent applications.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="w-auto gap-2 border-[#0F2137] text-[#0F2137] hover:bg-slate-50"
                        onClick={() => navigate('/recruiters/profile')}
                    >
                        <User size={18} /> View Profile
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-auto gap-2 bg-[#3B82F6] text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
                        onClick={() => navigate('/jobs/new')}
                    >
                        <PlusCircle size={18} /> POST NEW JOB
                    </Button>
                </div>
            </div>

            {/* Dashboard Headers removed filters */}

            {/* Stats Grid */}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="dashboard-card stat-card-hover">
                        <StatCard label="My Postings" value={myInternships.length.toString()} icon={Briefcase} color="navy" />
                    </div>
                    <div className="dashboard-card stat-card-hover">
                        <StatCard label="Total Applications" value={allApplications.length.toString()} icon={Users} color="purple" />
                    </div>
                    <div className="dashboard-card stat-card-hover">
                        <StatCard label="Active Shortlists" value={allApplications.filter(a => a.status === 'SHORTLISTED' || a.status === 'OFFER_RECEIVED').length.toString()} icon={MessageSquare} color="amber" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 dashboard-table">


                {/* AI TOP APPLICANTS SECTION REMOVED - Not supported by API */}

                {/* My Recent Postings */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#0F2137]">My Postings</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')} className="text-xs">View All</Button>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center border border-dashed border-slate-300 rounded-xl">
                            <p className="text-slate-400">Loading postings...</p>
                        </div>
                    ) : myInternships.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {myInternships.slice(0, 10).map((internship) => (
                                <div key={internship.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Briefcase size={20} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setPreviewJob(internship)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Preview Posting"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/jobs/${internship.id}/edit`)}
                                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Edit Posting"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${internship.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            internship.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                internship.status === 'CLOSED' ? 'bg-slate-100 text-slate-500' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {internship.status}
                                        </span>
                                        {/* Status Toggle Button if needed */}
                                        <button
                                            onClick={(e) => handleStatusToggle(internship.id, internship.status, e)}
                                            className="text-[10px] underline text-slate-400 hover:text-red-500"
                                        >
                                            {internship.status === 'CLOSED' ? 'Closed' : 'Close Job'}
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-[#0F2137] text-lg mb-1">{internship.title}</h3>
                                    <p className="text-slate-500 text-xs mb-3 line-clamp-2">{internship.description}</p>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                        <span>Posted: {new Date(internship.created_at).toLocaleDateString()}</span>
                                        <span className="font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/jobs/${internship.id}/applications`)}>
                                            See Applications →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="text-slate-300 h-8 w-8" />
                            </div>
                            <h3 className="text-base font-bold text-[#0F2137] mb-1">No postings yet</h3>
                            <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                                You haven't created any internship postings yet.
                            </p>
                            <Button size="sm" onClick={() => navigate('/jobs/new')}>Create First Posting</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#0F2137]">Job Preview</h2>
                            <button onClick={() => setPreviewJob(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-[#0F2137] mb-2">{previewJob.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">{previewJob.location_type || 'REMOTE'}</span>
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">{previewJob.is_paid ? 'Paid' : 'Unpaid'}</span>
                                    {previewJob.stipend && <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">₹{previewJob.stipend}/mo</span>}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-[#0F2137] mb-2">Description</h4>
                                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{previewJob.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold text-[#0F2137] mb-1">Duration</h4>
                                    <p className="text-slate-600 text-sm">{previewJob.duration}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0F2137] mb-1">Posted Date</h4>
                                    <p className="text-slate-600 text-sm">{new Date(previewJob.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setPreviewJob(null)}>Close</Button>
                            <Button onClick={() => {
                                setPreviewJob(null);
                                navigate(`/jobs/${previewJob.id}/edit`);
                            }}>Edit Posting</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;
