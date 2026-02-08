import { useState, useEffect } from 'react';
import {
    Search, Filter, Briefcase,
    MapPin, Clock, ExternalLink,
    X, CheckCircle2, ArrowRight, ChevronLeft,
    LayoutGrid, ListChecks
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';
import { useAuth } from '../../context/AuthContext';

const BrowseOffers = () => {
    const { user } = useAuth();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [appliedIds, setAppliedIds] = useState<string[]>([]);
    const [placementStatus, setPlacementStatus] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [applyStep, setApplyStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [githubLink, setGithubLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [data, applications, status] = await Promise.all([
                    InternshipService.getAll(),
                    InternshipService.getStudentApplications(),
                    InternshipService.getPlacementStatus()
                ]);
                setInternships(data);
                setFilteredInternships(data);
                setAppliedIds(applications.map((app) => app.internship_id));
                setPlacementStatus(status);
            } catch (error) {
                console.error('Failed to fetch internships:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = internships;
        if (searchQuery) {
            result = result.filter(i =>
                i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (i.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                i.location_type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory !== 'All') {
            result = result.filter(i => i.department.name === selectedCategory);
        }
        setFilteredInternships(result);
    }, [searchQuery, selectedCategory, internships]);

    const handleApply = (internship: Internship) => {
        // Prevent applying if student is already placed
        if (placementStatus?.is_placed) {
            return;
        }
        setSelectedInternship(internship);
        setShowApplyModal(true);
        setApplyStep(1);
        setResumeFile(null); // Reset file
        setGithubLink('');
        setLinkedinLink('');
    };

    const confirmApplication = async () => {
        if (!selectedInternship) return;
        if (!resumeFile) {
            alert("Please upload a resume.");
            return;
        }

        setIsSubmitting(true);
        try {
            await InternshipService.apply(selectedInternship.id, {
                resume: resumeFile,
                github_link: githubLink || undefined,
                linkedin_link: linkedinLink || undefined
            });
            setAppliedIds([...appliedIds, selectedInternship.id]);
            setShowApplyModal(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert('Application failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['All', 'Software Development', 'Data Science', 'UI/UX Design', 'Marketing', 'Finance'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter">Explore Opportunities</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-60">Verified internships from top-tier companies</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <ListChecks size={20} />
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-grow group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by role, company, or location..."
                        className="w-full h-16 bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-16 px-8 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all border
                        ${showFilters ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Browse by Industry</h3>
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border
                                    ${selectedCategory === cat ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Listings Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : filteredInternships.length > 0 ? (
                    filteredInternships.map((intern) => (
                        <div key={intern.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                                    <Briefcase size={28} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <Badge variant={intern.status === 'APPROVED' ? 'navy' : 'neutral'}>
                                    {intern.status === 'APPROVED' ? 'ACTIVE' : intern.status}
                                </Badge>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter mb-2 italic uppercase group-hover:text-blue-600 transition-colors leading-tight">{intern.title}</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-6">{intern.company_name}</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-slate-500 font-medium text-xs">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                        {intern.location_type}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-medium text-xs">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Clock size={14} /></div>
                                        {intern.duration}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-medium text-xs">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Briefcase size={14} /></div>
                                        {intern.department.name}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                                <span className="text-lg font-black text-slate-900 tracking-tighter italic">₹{intern.stipend?.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/mo</span></span>
                                {appliedIds.includes(intern.id) ? (
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <CheckCircle2 size={16} /> Applied
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleApply(intern)}
                                        className="bg-[#0F172A] text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-xl shadow-blue-900/10 hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95">
                                        Apply Now <ExternalLink size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-300 italic uppercase">No matches found</h3>
                        <p className="text-slate-400 max-w-xs mt-2 font-bold opacity-60">Adjust your search or filters to find more opportunities.</p>
                        <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-8 text-blue-600 font-black uppercase text-xs hover:underline decoration-2 underline-offset-4 tracking-widest">Clear All Filters</button>
                    </div>
                )}
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 duration-500">
                    <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-emerald-400/30 backdrop-blur-md">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <p className="font-black italic text-lg leading-tight uppercase tracking-tighter">Application Sent!</p>
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">We'll notify you of any updates.</p>
                        </div>
                        <button onClick={() => setShowSuccess(false)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Apply Modal */}
            {showApplyModal && selectedInternship && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase italic">{selectedInternship.title}</h2>
                                    <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-1">{selectedInternship.company_name} • Application Submission</p>
                                </div>
                                <button onClick={() => setShowApplyModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {applyStep === 1 ? (
                                    <>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Application Profile</h4>
                                            <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100">
                                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-300">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-700 italic">{user?.name || 'Student'}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Resume Upload *</label>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                                            className="w-full text-sm text-slate-500
                                                                file:mr-4 file:py-2 file:px-4
                                                                file:rounded-full file:border-0
                                                                file:text-xs file:font-semibold
                                                                file:bg-blue-50 file:text-blue-700
                                                                hover:file:bg-blue-100
                                                                cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Github Profile</label>
                                                    <input
                                                        type="text"
                                                        placeholder="https://github.com/..."
                                                        value={githubLink}
                                                        onChange={(e) => setGithubLink(e.target.value)}
                                                        className="w-full h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">LinkedIn Profile</label>
                                                    <input
                                                        type="text"
                                                        placeholder="https://linkedin.com/in/..."
                                                        value={linkedinLink}
                                                        onChange={(e) => setLinkedinLink(e.target.value)}
                                                        className="w-full h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                                <div className="mt-1"><CheckCircle2 size={14} className="text-blue-600" /></div>
                                                <p className="text-[10px] font-bold text-blue-600 leading-relaxed uppercase tracking-wide">By applying, your placement trust score and academic performance will be visible to the recruiter.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!resumeFile) {
                                                    alert("Please upload a resume first");
                                                    return;
                                                }
                                                setApplyStep(2);
                                            }}
                                            className="w-full py-5 bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3">
                                            Review & Submit <ArrowRight size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center space-y-4">
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">Please confirm your application for the <span className="font-black text-slate-900 italic uppercase">"{selectedInternship.title}"</span> position. This action cannot be undone.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setApplyStep(1)}
                                                className="flex-grow py-5 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                                <ChevronLeft size={18} /> Back
                                            </button>
                                            <button
                                                onClick={confirmApplication}
                                                disabled={isSubmitting}
                                                className="flex-grow py-5 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:grayscale">
                                                {isSubmitting ? 'Processing...' : <>Confirm Apply <CheckCircle2 size={18} /></>}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseOffers;
