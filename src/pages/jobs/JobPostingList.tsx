import { useState, useEffect } from 'react';
import { Plus, Briefcase, Filter, Calendar, Edit, Check, X, Eye, MapPin, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ApplicationModal from '../../components/jobs/ApplicationModal';
import DepartmentSelector from '../../components/ui/DepartmentSelector';

const JobPostingList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    // State
    const [jobs, setJobs] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const itemsPerPage = 9;

    // Filters
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    // Modals
    // const [isPostModalOpen, setIsPostModalOpen] = useState(false); // Removed in favor of navigation
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [previewJob, setPreviewJob] = useState<Internship | null>(null); // For Eye Preview
    const [selectedJob, setSelectedJob] = useState<Internship | null>(null); // For Apply

    useEffect(() => {
        loadJobs();
    }, [user]);

    const loadJobs = async () => {
        setLoading(true);
        try {
            let data: Internship[] = [];
            if (user?.role === 'RECRUITER' || user?.role === 'CORPORATE') {
                data = await InternshipService.getMyInternships();
            } else if (user?.role === 'IC' || user?.role === 'HOD') {
                const pending = await InternshipService.getPendingInternships();
                const approved = await InternshipService.getApprovedInternships();
                data = [...pending, ...approved];
            } else {
                data = await InternshipService.getApprovedInternships();
            }
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            if (action === 'approve') {
                await InternshipService.approve(id);
            } else {
                await InternshipService.reject(id);
            }
            addNotification({
                title: action === 'approve' ? 'Posting Published' : 'Posting Rejected',
                message: action === 'approve' ? 'Internship is now live.' : 'Feedback sent to recruiter.',
                type: action === 'approve' ? 'success' : 'error',
                category: 'SYSTEM'
            });
            loadJobs();
        } catch (error) {
            console.error("Failed to update status", error);
            addNotification({ title: 'Update Failed', message: 'Could not update status.', type: 'error' });
        }
    };

    const handleApplyClick = (job: Internship) => {
        setSelectedJob(job);
        setIsApplyModalOpen(true);
    };

    const submitApplication = async (data: any) => {
        if (!selectedJob) return;
        try {
            await InternshipService.apply(selectedJob.id, data);
            addNotification({
                title: 'Application Sent',
                message: `Successfully applied to ${selectedJob.title}`,
                type: 'success'
            });
            setIsApplyModalOpen(false);
            loadJobs();
        } catch (error: any) {
            addNotification({
                title: 'Application Failed',
                message: error.response?.data?.detail?.[0]?.msg || 'Could not submit application.',
                type: 'error'
            });
        }
    };

    // Filter Logic
    const filteredJobs = jobs
        .filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job as any).company_name?.toLowerCase().includes(searchTerm.toLowerCase());

            // Matches Department Filter
            // Matches Department Filter
            const matchesDept = selectedDepartments.length === 0 ||
                selectedDepartments.some(d =>
                    (job.department && job.department.id === d) ||
                    (job.programs && job.programs.some(p => p.id === d))
                );

            return matchesSearch && matchesDept;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const paginatedJobs = filteredJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <Breadcrumbs items={[{ label: 'Internship Portal', path: '/dashboard' }, { label: 'Job Postings' }]} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">
                        {user?.role === 'RECRUITER' ? 'My Job Postings' : 'Internship Opportunities'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {user?.role === 'RECRUITER' ? 'Manage your posted opportunities' : 'Explore and apply to internships'}
                    </p>
                </div>
                {user?.role === 'RECRUITER' && (
                    <Button onClick={() => navigate('/jobs/new')} className="gap-2">
                        <Plus size={18} /> Post New Job
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 space-y-4 shrink-0">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={18} className="text-slate-500" />
                            <h3 className="font-bold text-[#0F2137]">Filters</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Department Filter */}
                            <DepartmentSelector
                                selected={selectedDepartments}
                                onChange={setSelectedDepartments}
                                label="Departments"
                                placeholder="Filter by program..."
                            />

                            {/* Sort (moved here or kept top? Layout suggest sidebar is cleaner) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="title">Alphabetical</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full">
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search jobs by title or company..."
                        />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {paginatedJobs.map((job) => (
                                    <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                                <Briefcase size={24} />
                                            </div>
                                            <div className="flex gap-2">
                                                {/* Preview Action */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewJob(job);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors z-10"
                                                    title="Preview Details"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {user?.role === 'RECRUITER' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/jobs/${job.id}/edit`);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors z-10"
                                                        title="Edit Job"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* IC/HOD Actions overlay */}
                                        {(user?.role === 'IC' || user?.role === 'HOD') && job.status === 'PENDING' && (
                                            <div className="absolute top-4 right-14 flex gap-1 z-10">
                                                <button onClick={(e) => { e.stopPropagation(); handleAction(job.id, 'approve'); }} className="p-1 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200" title="Approve">
                                                    <Check size={14} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleAction(job.id, 'reject'); }} className="p-1 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-200" title="Reject">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${job.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                job.status === 'CLOSED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0F2137] mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{job.description}</p>

                                        <div className="space-y-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                <span>{job.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-400" />
                                                <span>{job.location_type || 'Remote'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-400" />
                                                <span className="truncate max-w-[200px]" title={job.department?.name}>{job.department?.name || 'General'}</span>
                                            </div>
                                        </div>

                                        {user?.role === 'STUDENT' && (
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <Button
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleApplyClick(job);
                                                    }}
                                                    disabled={Boolean(job.has_applied)}
                                                    variant={job.has_applied ? 'outline' : 'primary'}
                                                >
                                                    {job.has_applied ? 'Applied' : 'Apply Now'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center px-4 font-medium text-slate-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                                <Briefcase className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0F2137]">No jobs found</h3>
                            <p className="text-slate-500">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Job Modal Removed - Uses /jobs/new page now */}

            {/* Apply Modal */}
            <ApplicationModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                onSubmit={submitApplication}
                jobTitle={selectedJob?.title || ''}
            />

            {/* Preview Modal */}
            {previewJob && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
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
                                    {previewJob.is_paid && previewJob.stipend && <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">₹{previewJob.stipend}/mo</span>}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${previewJob.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                        }`}>{previewJob.status}</span>
                                </div>
                            </div>

                            {/* Targeted Departments */}
                            {(previewJob.programs?.length > 0 || previewJob.department) && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h4 className="font-bold text-slate-700 mb-2 text-sm">Target Programs</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {previewJob.programs?.length > 0 ? (
                                            previewJob.programs.map((p) => (
                                                <span key={p.id} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">{p.name}</span>
                                            ))
                                        ) : (
                                            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">{previewJob.department?.name}</span>
                                        )}
                                    </div>
                                </div>
                            )}

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
                            {user?.role === 'RECRUITER' && (
                                <Button onClick={() => {
                                    setPreviewJob(null);
                                    navigate(`/jobs/${previewJob.id}/edit`);
                                }}>Edit Posting</Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostingList;
