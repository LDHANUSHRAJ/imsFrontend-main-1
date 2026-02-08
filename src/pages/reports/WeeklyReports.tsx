import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Calendar, CheckCircle2, Clock,
    Plus, ChevronDown, ChevronUp, TrendingUp,
    Target, AlertCircle, Lightbulb, ArrowLeft, Briefcase
} from 'lucide-react';
import { ReportService, type WeeklyReport, type ActiveInternship, type WeeklyReportCreate } from '../../services/report.service';

const WeeklyReports = () => {
    const navigate = useNavigate();
    const [activeInternships, setActiveInternships] = useState<ActiveInternship[]>([]);
    const [selectedInternship, setSelectedInternship] = useState<ActiveInternship | null>(null);
    const [reports, setReports] = useState<WeeklyReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<WeeklyReportCreate>({
        title: '',
        description: '',
        week_number: 1,
        achievements: '',
        challenges: '',
        plans: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [internships, myReports] = await Promise.all([
                ReportService.getActiveInternships(),
                ReportService.getMyReports()
            ]);
            setActiveInternships(internships);
            if (internships.length > 0) {
                setSelectedInternship(internships[0]);
            }
            setReports(myReports);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInternship) return;

        try {
            const payload: WeeklyReportCreate = {
                ...formData,
                internship_id: selectedInternship.type === 'INTERNAL' ? selectedInternship.id : undefined,
                external_internship_id: selectedInternship.type === 'EXTERNAL' ? selectedInternship.id : undefined,
            };

            await ReportService.submitReport(payload);
            alert('Weekly report submitted successfully!');
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                week_number: 1,
                achievements: '',
                challenges: '',
                plans: '',
            });
            fetchData(); // Refresh reports
        } catch (error) {
            console.error('Failed to submit report:', error);
            alert('Failed to submit report. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Clock className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (activeInternships.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold mb-6"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText size={40} className="text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-3">No Active Internship</h2>
                    <p className="text-slate-500 font-bold mb-6">
                        You need an active internship to submit weekly reports.
                    </p>
                    <button
                        onClick={() => navigate('/internships')}
                        className="bg-blue-600 text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        Browse Internships
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold mb-4"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-black text-[#0F2137] tracking-tight">My Weekly Reports</h1>
                    <p className="text-slate-500 font-bold mt-2">Track your internship progress</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white font-black text-sm uppercase tracking-widest px-6 py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
                >
                    <Plus size={20} /> Submit Report
                </button>
            </div>

            {/* Active Internship Selector */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-3xl">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4">Active Internship</h3>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900">{selectedInternship?.title}</h4>
                        <p className="text-sm text-slate-600 font-bold">
                            {selectedInternship?.company_name} • {selectedInternship?.type}
                        </p>
                    </div>
                </div>
            </div>

            {/* Submit Report Form */}
            {showForm && (
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">Submit Weekly Report</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                                    Report Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-bold"
                                    placeholder="e.g., Week 3 Progress Report"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                                    Week Number *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.week_number}
                                    onChange={(e) => setFormData({ ...formData, week_number: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                                Description *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-bold resize-none"
                                placeholder="Describe your work this week..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <TrendingUp size={16} /> Achievements
                            </label>
                            <textarea
                                rows={3}
                                value={formData.achievements}
                                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-none font-bold resize-none"
                                placeholder="What did you accomplish this week?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <AlertCircle size={16} /> Challenges
                            </label>
                            <textarea
                                rows={3}
                                value={formData.challenges}
                                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-600 focus:outline-none font-bold resize-none"
                                placeholder="What challenges did you face?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Target size={16} /> Next Week's Plans
                            </label>
                            <textarea
                                rows={3}
                                value={formData.plans}
                                onChange={(e) => setFormData({ ...formData, plans: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-bold resize-none"
                                placeholder="What are your plans for next week?"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-blue-700 transition-all"
                            >
                                Submit Report
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Submitted Reports */}
            <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Submitted Reports ({reports.length})</h3>
                {reports.length === 0 ? (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">No reports submitted yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => {
                            const isExpanded = expandedReportId === report.id;
                            return (
                                <div
                                    key={report.id}
                                    className="bg-white border-2 border-slate-200 rounded-3xl p-6 hover:border-blue-300 transition-all"
                                >
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black">
                                                W{report.week_number}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900">{report.title}</h4>
                                                <p className="text-sm text-slate-500 font-bold">
                                                    <Calendar size={14} className="inline mr-1" />
                                                    {new Date(report.submitted_at).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div>
                                                <h5 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                                                    Description
                                                </h5>
                                                <p className="text-slate-600 font-bold">{report.description}</p>
                                            </div>

                                            {report.achievements && (
                                                <div>
                                                    <h5 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <TrendingUp size={14} /> Achievements
                                                    </h5>
                                                    <p className="text-slate-600 font-bold">{report.achievements}</p>
                                                </div>
                                            )}

                                            {report.challenges && (
                                                <div>
                                                    <h5 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <AlertCircle size={14} /> Challenges
                                                    </h5>
                                                    <p className="text-slate-600 font-bold">{report.challenges}</p>
                                                </div>
                                            )}

                                            {report.plans && (
                                                <div>
                                                    <h5 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <Target size={14} /> Plans
                                                    </h5>
                                                    <p className="text-slate-600 font-bold">{report.plans}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeeklyReports;
