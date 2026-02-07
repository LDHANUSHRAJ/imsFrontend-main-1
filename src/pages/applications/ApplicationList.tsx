import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InternshipService } from '../../services/internship.service';
import { useAuth } from '../../context/AuthContext';
import type { StudentApplication } from '../../types';
import { User, Calendar, Briefcase, Filter, ChevronRight, FileText } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import { ExportButton } from '../../utils/export';
import { CardSkeleton } from '../../components/ui/Skeleton';

const ApplicationList = () => {
    const { user } = useAuth();
    const isRecruiter = user?.role === 'RECRUITER';

    // Extended type to include Job details for display
    type ExtendedApplication = StudentApplication & { jobTitle: string; companyName: string };

    const [applications, setApplications] = useState<ExtendedApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [cgpaFilter, setCgpaFilter] = useState<number>(0);
    const [skillFilter, setSkillFilter] = useState<string>('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // 1. Get all my internships
            const myJobs = await InternshipService.getMyInternships();

            // 2. For each job, get applications
            const appPromises = myJobs.map(async (job) => {
                try {
                    const apps = await InternshipService.getApplications(job.id);
                    return apps.map(app => ({
                        ...app,
                        jobTitle: job.title,
                        companyName: (job as any).company_name || 'My Company'
                    }));
                } catch (e) {
                    console.error(`Failed to load apps for job ${job.id}`, e);
                    return [];
                }
            });

            const results = await Promise.all(appPromises);
            const allApps = results.flat().map(app => {
                // Attach mock match scores if not present
                const cgpa = app.student?.cgpa || 3.0;
                return {
                    ...app,
                    matchScore: app.matchScore || (cgpa >= 3.8 ? 95 : cgpa >= 3.5 ? 85 : 70)
                };
            });

            setApplications(allApps);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'SHORTLISTED':
                return <Badge variant="success">{status}</Badge>;
            case 'REJECTED':
                return <Badge variant="error">Rejected</Badge>;
            default:
                return <Badge variant="warning">Pending</Badge>;
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            (app.student?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.student?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

        const matchesCgpa = cgpaFilter === 0 || (app.student?.cgpa || 0) >= cgpaFilter;

        const matchesSkill = skillFilter === '' ||
            (app.skills || []).some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));

        return matchesSearch && matchesStatus && matchesCgpa && matchesSkill;
    });

    // Grouping logic for recruiters
    const groupedApps = filteredApplications.reduce((acc, app) => {
        if (!acc[app.jobTitle]) acc[app.jobTitle] = [];
        acc[app.jobTitle].push(app);
        return acc;
    }, {} as Record<string, ExtendedApplication[]>);

    const exportData = filteredApplications.map(app => ({
        'Student Name': app.student?.name || 'N/A',
        'Email': app.student?.email || 'N/A',
        'Student ID': app.student_id,
        'Position': app.jobTitle,
        'Status': app.status,
        'Applied Date': new Date(app.created_at).toLocaleDateString()
    }));

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#0F2137]">
                        {isRecruiter ? 'Internship Applicants' : 'Student Applications'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Review and manage student applications for your postings
                    </p>
                </div>
                <ExportButton
                    data={exportData}
                    filename="applications"
                    label="Export Results"
                />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search by student, email, or position..."
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all appearance-none cursor-pointer font-bold"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Shortlisted</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Min CGPA</label>
                            <select
                                value={cgpaFilter}
                                onChange={(e) => setCgpaFilter(Number(e.target.value))}
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 font-bold"
                            >
                                <option value={0}>Any CGPA</option>
                                <option value={3.0}>3.0 +</option>
                                <option value={3.5}>3.5 +</option>
                                <option value={3.8}>3.8 +</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Required Skills</label>
                            <input
                                type="text"
                                placeholder="e.g. React, Python..."
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isRecruiter ? (
                Object.keys(groupedApps).length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F2137] mb-2">No Applications Found</h3>
                        <p className="text-slate-500 text-sm">No applications match your current filters.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedApps).map(([jobTitle, apps]) => (
                            <section key={jobTitle} className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="flex items-center gap-3 mb-4 px-2">
                                    <div className="h-8 w-1 bg-[#3B82F6] rounded-full" />
                                    <h3 className="text-lg font-bold text-[#0F2137]">{jobTitle}</h3>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                                        {apps.length} Applicant{apps.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {apps.map((application) => (
                                        <Link
                                            key={application.id}
                                            to={`/applications/${application.id}`}
                                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200 hover:border-[#3B82F6] group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="text-[#3B82F6]" size={20} />
                                            </div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                                    <User className="text-[#3B82F6]" size={24} />
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {getStatusBadge(application.status)}
                                                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                        {application.matchScore}% AI Match
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-lg text-[#0F2137] mb-1 group-hover:text-[#3B82F6] transition-colors">
                                                {application.student?.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm mb-4 truncate italic">{application.student?.email}</p>

                                            <div className="flex items-center gap-2 text-[#3B82F6] font-medium text-sm pt-4 border-t border-slate-100">
                                                <Calendar size={16} />
                                                <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((application) => (
                        <Link
                            key={application.id}
                            to={`/applications/${application.id}`}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-slate-200 hover:border-[#3B82F6] group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                    <User className="text-[#3B82F6]" size={24} />
                                </div>
                                {getStatusBadge(application.status)}
                            </div>

                            <h3 className="font-bold text-lg text-[#0F2137] mb-1">{application.student?.name}</h3>
                            <p className="text-slate-500 text-sm mb-4 truncate" title={application.student?.email}>{application.student?.email}</p>

                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-slate-400" />
                                    <span className="truncate">{application.jobTitle}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#3B82F6] font-medium mt-3 pt-3 border-t border-slate-100">
                                    <Calendar size={16} />
                                    <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationList;
