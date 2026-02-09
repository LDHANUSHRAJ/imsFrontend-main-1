
import { useState, useEffect } from 'react';
import {
    Search, Filter, Briefcase,
    MapPin, Clock, Building2,
    X, CheckCircle2, ArrowRight, FileText
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';

const BrowseOffers = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
    const [appliedInternshipIds, setAppliedInternshipIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // UI States
    const [showFilters, setShowFilters] = useState(false);

    // Application Modal States
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [githubLink, setGithubLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadInternships();
    }, []);

    const loadInternships = async () => {
        setIsLoading(true);
        try {
            // Fetch both internships and student applications
            const [data, applications] = await Promise.all([
                InternshipService.getAll(),
                InternshipService.getStudentApplications().catch(() => [])
            ]);

            // Track which internships the student has already applied to
            const appliedIds = new Set(applications.map(app => app.internship_id));
            setAppliedInternshipIds(appliedIds);

            setInternships(data);
            setFilteredInternships(data);
        } catch (error) {
            console.error("Failed to load internships", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = internships.filter(internship =>
            internship.title.toLowerCase().includes(lowerQuery) ||
            internship.company_name?.toLowerCase().includes(lowerQuery) ||
            internship.description?.toLowerCase().includes(lowerQuery)
        );
        setFilteredInternships(filtered);
    }, [searchQuery, internships]);

    const handleApplyClick = (internship: Internship) => {
        setSelectedInternship(internship);
        setShowApplyModal(true);
        setResumeFile(null);
        setGithubLink('');
        setLinkedinLink('');
    };

    const confirmApplication = async () => {
        if (!selectedInternship || !resumeFile) return;

        setIsSubmitting(true);
        try {
            await InternshipService.apply(selectedInternship.id, {
                resume: resumeFile,
                github_link: githubLink || undefined,
                linkedin_link: linkedinLink || undefined
            });
            alert('Application submitted successfully!');
            setShowApplyModal(false);
            loadInternships();
        } catch (error) {
            console.error(error);
            alert('Application failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'error';
            case 'CLOSED': return 'neutral';
            default: return 'info';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up md:p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-christBlue">Browse Internships</h1>
                    <p className="text-slate-500 mt-1 font-medium">Explore and apply to opportunities tailored for you.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by role, company..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-christBlue focus:ring-1 focus:ring-christBlue text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-lg border transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-christBlue' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christBlue"></div>
                </div>
            ) : filteredInternships.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                    <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No internships found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInternships.map((internship) => (
                        <div key={internship.id} className="bg-white rounded-xl border border-slate-200 block hover:border-christBlue hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-christBlue font-bold text-xl">
                                        {internship.company_name?.charAt(0) || 'C'}
                                    </div>
                                    <Badge variant={getBadgeVariant(internship.status)}>
                                        {internship.status}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-christBlue transition-colors">{internship.title}</h3>
                                <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1.5">
                                    <Building2 size={16} />
                                    {internship.company_name}
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span>{internship.location_type || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Clock size={16} className="text-slate-400" />
                                        <span>Full-time • 6 Months</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                                {appliedInternshipIds.has(internship.id) ? (
                                    <div className="w-full py-2.5 rounded-lg font-bold text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center gap-2">
                                        <CheckCircle2 size={16} /> Applied
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleApplyClick(internship)}
                                        className="w-full py-2.5 rounded-lg font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-christBlue hover:text-white hover:border-christBlue transition-all flex items-center justify-center gap-2 group-hover:bg-christBlue group-hover:text-white group-hover:border-christBlue"
                                    >
                                        Apply Now <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Apply Modal */}
            {showApplyModal && selectedInternship && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Apply for Internship</h3>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedInternship.title} at {selectedInternship.company_name}</p>
                            </div>
                            <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 flex justify-between">
                                        Resume (PDF) <span className="text-red-500 text-xs">*Required</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className={`w-full p-4 rounded-xl border-2 border-dashed transition-all flex items-center gap-4 ${resumeFile
                                            ? 'border-emerald-500 bg-emerald-50/50'
                                            : 'border-slate-200 bg-slate-50 hover:border-christBlue hover:bg-blue-50/50'
                                            }`}>
                                            <div className={`p-3 rounded-lg ${resumeFile ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'}`}>
                                                {resumeFile ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-bold ${resumeFile ? 'text-emerald-700' : 'text-slate-700'}`}>
                                                    {resumeFile ? resumeFile.name : 'Upload your resume'}
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium">
                                                    {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload` : 'PDF format only, max 5MB'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">GitHub (Optional)</label>
                                        <input
                                            type="url"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-christBlue transition-all"
                                            placeholder="https://github.com/..."
                                            value={githubLink}
                                            onChange={(e) => setGithubLink(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">LinkedIn (Optional)</label>
                                        <input
                                            type="url"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-christBlue transition-all"
                                            placeholder="https://linkedin.com/in/..."
                                            value={linkedinLink}
                                            onChange={(e) => setLinkedinLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApplication}
                                disabled={isSubmitting || !resumeFile}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-christBlue hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseOffers;
