import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InternshipService } from '../../services/internship.service';
import type { StudentApplication, Internship } from '../../types';
import { User, Calendar, Briefcase, Building2, Filter } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import { ExportButton } from '../../utils/export';
import { CardSkeleton } from '../../components/ui/Skeleton';

const ApplicationList = () => {
    // Extended type to include Job details for display
    type ExtendedApplication = StudentApplication & { jobTitle: string; companyName: string };

    const [applications, setApplications] = useState<ExtendedApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // 1. Get all my internships
            const myJobs = await InternshipService.getMyInternships();

            // 2. For each job, get applications
            // This might be heavy if many jobs, but necessary without a specific endpoint
            const appPromises = myJobs.map(async (job) => {
                try {
                    const apps = await InternshipService.getApplications(job.id);
                    // Attach job details to each app
                    return apps.map(app => ({
                        ...app,
                        jobTitle: job.title,
                        companyName: (job as any).company_name || 'My Company' // Type fallback
                    }));
                } catch (e) {
                    console.error(`Failed to load apps for job ${job.id}`, e);
                    return [];
                }
            });

            const results = await Promise.all(appPromises);
            const allApps = results.flat();

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
            case 'SHORTLISTED': // Assuming SHORTLISTED is a valid status for recruiters
                return <Badge variant="success">{status}</Badge>;
            case 'REJECTED':
                return <Badge variant="error">Rejected</Badge>;
            default:
                return <Badge variant="warning">Pending</Badge>;
        }
    };

    // Filter and search logic
    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            (app.student?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.student?.email || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Prepare export data
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
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#0F2137]">Student Applications</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#0F2137]">Student Applications</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {filteredApplications.length} of {applications.length} applications
                    </p>
                </div>
                <ExportButton
                    data={exportData}
                    filename="applications"
                    label="Export Applications"
                />
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search by student name or email..."
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications Grid */}
            {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F2137] mb-2">No Applications Found</h3>
                    <p className="text-slate-500 text-sm">
                        {searchQuery || statusFilter !== 'ALL'
                            ? 'Try adjusting your search or filters'
                            : 'No applications have been submitted yet'}
                    </p>
                </div>
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
