import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApplicationService } from '../../services/application.service';
import { useAuth } from '../../context/AuthContext';
import {
    User, FileText, Download,
    GraduationCap, Mail, Phone,
    MapPin, Eye, ExternalLink,
    Calendar, Briefcase, ChevronLeft,
    CheckCircle2, ShieldCheck,
    ToggleLeft, ToggleRight, Loader2
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useNotifications } from '../../context/NotificationContext';
import { InternshipService } from '../../services/internship.service';

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isRecruiter = user?.role === 'RECRUITER';
    const { addNotification } = useNotifications();

    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showResumeDrawer, setShowResumeDrawer] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isActivating, setIsActivating] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const isIC = user?.role === 'INTERNSHIP_COORDINATOR';

    useEffect(() => {
        loadApplication();
    }, [id]);

    const loadApplication = async () => {
        try {
            const appData = await ApplicationService.getById(id!);
            if (!appData) {
                addNotification({
                    title: 'Not Found',
                    message: 'Application details could not be retrieved.',
                    type: 'error'
                });
                navigate('/applications');
                return;
            }
            setApplication(appData);
        } catch (error) {
            console.error('Error loading application:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        await ApplicationService.updateStatus(id!, 'APPROVED');
        addNotification({
            title: isRecruiter ? 'Applicant Shortlisted' : 'Application Approved',
            message: isRecruiter ? 'The student has been moved to the shortlisted phase.' : 'LOR generated successfully.',
            type: 'success',
            category: 'APPROVAL'
        });
        setShowApproveModal(false);
        await loadApplication();
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            addNotification({
                title: 'Reason Required',
                message: 'Please provide a reason for rejection.',
                type: 'warning'
            });
            return;
        }

        await ApplicationService.updateStatus(id!, 'REJECTED', rejectReason);
        addNotification({
            title: 'Decision Recorded',
            message: 'Application status updated and student notified.',
            type: 'error',
            category: 'APPROVAL'
        });
        setShowRejectModal(false);
        await loadApplication();
    };

    const handleActivate = async () => {
        setIsActivating(true);
        try {
            await InternshipService.activateInternship(id!);
            addNotification({
                title: 'Internship Activated',
                message: 'Application is now ACTIVE. Competing applications have been cancelled.',
                type: 'success',
                category: 'APPROVAL'
            });
            await loadApplication();
        } catch (error) {
            console.error('Activation failed:', error);
            addNotification({
                title: 'Activation Failed',
                message: 'Could not activate the internship. Please try again.',
                type: 'error'
            });
        } finally {
            setIsActivating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
            <p className="text-slate-500 animate-pulse">Loading application data...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button
                onClick={() => navigate('/applications')}
                className="flex items-center gap-2 text-slate-500 hover:text-[#3B82F6] transition-colors mb-6 group text-sm font-medium"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Applications
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-5">
                    <div className="bg-[#0F2137] p-4 rounded-2xl shadow-lg shadow-blue-900/10">
                        <GraduationCap className="text-white" size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-[#0F2137]">{application?.student?.name || 'Student Name'}</h1>
                            <Badge variant={application?.status === 'APPROVED' ? 'success' : application?.status === 'REJECTED' ? 'error' : 'warning'} className="text-xs py-1">
                                {application?.status}
                            </Badge>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            Reg No: <span className="text-[#3B82F6]">{application?.student_id || 'N/A'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowResumeDrawer(true)}
                        className="flex items-center gap-2 border-slate-200 hover:border-[#3B82F6] hover:text-[#3B82F6]"
                    >
                        <Eye size={18} />
                        Preview Resume
                    </Button>
                    <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Download size={18} />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Mail size={18} /></div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                <p className="text-sm font-semibold text-slate-700 truncate">{application?.student?.email}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Phone size={18} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</p>
                                <p className="text-sm font-semibold text-slate-700">+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg text-amber-600"><MapPin size={18} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Current City</p>
                                <p className="text-sm font-semibold text-slate-700">Bangalore, IN</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Sections */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-[#0F2137] flex items-center gap-2">
                                <User size={18} className="text-[#3B82F6]" />
                                Academic & Professional Profile
                            </h3>
                        </div>
                        <div className="p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Education Details</h4>
                                    <div className="space-y-4">
                                        <div className="relative pl-6 border-l-2 border-slate-100">
                                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                                            <p className="text-sm font-bold text-slate-700">Master of Computer Applications</p>
                                            <p className="text-xs text-slate-500 font-medium italic">Christ University • 2024 - 2026</p>
                                            <p className="text-xs text-blue-600 font-bold mt-1">GPA: 8.5/10.0</p>
                                        </div>
                                        <div className="relative pl-6 border-l-2 border-slate-100">
                                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-slate-200" />
                                            <p className="text-sm font-bold text-slate-700">Bachelor of Computer Applications</p>
                                            <p className="text-xs text-slate-500 font-medium italic">University of Mumbai • 2021 - 2024</p>
                                            <p className="text-xs text-slate-400 font-bold mt-1">Percentage: 78%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['React.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Next.js', 'PostgreSQL', 'AWS'].map(skill => (
                                            <span key={skill} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:border-[#3B82F6] transition-colors cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Professional Summary</h4>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "Dedicated computer applications student with a strong foundation in full-stack development. Recently built a multi-role management system using React and Node.js. Passionate about creating efficient, user-centric web applications and learning new cloud architectures."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                            <h3 className="font-bold text-[#0F2137] flex items-center gap-2">
                                <Briefcase size={18} className="text-[#3B82F6]" />
                                Application Context
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2.5 rounded-lg shadow-sm">
                                        <Briefcase className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Applying For</p>
                                        <p className="text-sm font-bold text-[#0F2137]">{application?.jobTitle || 'Product Design Intern'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Applied On</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(application?.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                        <h3 className="text-xs font-bold text-[#0F2137] uppercase tracking-wider mb-5 pb-3 border-b border-slate-50">Decision Panel</h3>

                        {application?.status === 'PENDING' || application?.status === 'APPLIED' ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-2">
                                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                        Review the application details and technical profile before making a decision.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowApproveModal(true)}
                                    variant="primary"
                                    className="w-full py-4 text-sm font-bold shadow-lg shadow-blue-500/20"
                                >
                                    {isRecruiter ? 'Shortlist Applicant' : 'Approve & Issue LOR'}
                                </Button>
                                <Button
                                    onClick={() => setShowRejectModal(true)}
                                    variant="outline"
                                    className="w-full py-4 text-sm font-bold text-rose-600 hover:bg-rose-50 border-rose-100 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Reject Application
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                <Badge variant={application?.status === 'APPROVED' ? 'success' : 'error'} className="mb-3 px-4 py-1.5">
                                    {application?.status}
                                </Badge>
                                <p className="text-xs text-slate-500 italic mt-2 px-2">Decision finalized on {new Date().toLocaleDateString()}</p>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Share Applicant</h4>
                            <div className="flex gap-2">
                                <button className="flex-1 h-10 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200">
                                    <Mail size={16} className="text-slate-600" />
                                </button>
                                <button className="flex-1 h-10 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200">
                                    <ExternalLink size={16} className="text-slate-600" />
                                </button>
                            </div>
                        </div>

                        {/* IC Specific Verification and Activation */}
                        {isIC && application?.status === 'APPROVED' && (
                            <div className="mt-8 pt-8 border-t border-slate-100 space-y-5">
                                <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-blue-600" />
                                    IC Verification
                                </h4>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Offer Letter</span>
                                        <button
                                            onClick={() => setIsVerified(!isVerified)}
                                            className={`transition-colors ${isVerified ? 'text-blue-600' : 'text-slate-300'}`}>
                                            {isVerified ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
                                        Toggle to verify that the uploaded offer letter matches Christ University standards.
                                    </p>
                                </div>

                                <Button
                                    disabled={!isVerified || isActivating}
                                    onClick={handleActivate}
                                    className={`w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all
                                        ${isVerified ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'}`}
                                >
                                    {isActivating ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Activating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            Activate Internship
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Resume Preview Drawer - Premium Modal style */}
            <Modal isOpen={showResumeDrawer} onClose={() => setShowResumeDrawer(false)} title="Resume Preview">
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                            <FileText className="text-blue-600" size={18} />
                            <span className="text-sm font-bold text-slate-700">{application?.student?.name?.replace(' ', '_')}_Resume.pdf</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 py-0 flex items-center gap-2 text-[#3B82F6]">
                            <Download size={14} /> Download
                        </Button>
                    </div>

                    {/* Visual Placeholder for Resume */}
                    <div className="bg-white border rounded-xl h-[600px] shadow-inner overflow-hidden flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                        <div className="z-10 text-center p-12 max-w-md">
                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                                <FileText size={40} className="text-[#3B82F6]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#0F2137] mb-3">PDF Resume Preview</h4>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                In a production environment, this frame would render the actual PDF document using **PDF.js** or a similar library.
                            </p>
                            <Button variant="primary" className="mx-auto flex items-center gap-2">
                                <ExternalLink size={16} /> Open in New Tab
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Decision modals remain same but with premium tweaks ... */}
            <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title={isRecruiter ? 'Shortlist Candidate' : 'Confirm Internship Approval'}>
                <div className="space-y-4 pt-2">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-4">
                        <Calendar size={20} className="text-emerald-600 shrink-0 mt-1" />
                        <p className="text-sm text-emerald-900 leading-relaxed">
                            {isRecruiter
                                ? "This will move the candidate to your shortlisted pool. They will be notified through the Christ University Portal."
                                : "Approving this application will notify the student and automatically generate the necessary LOR for the recruiter."}
                        </p>
                    </div>
                    <div className="flex gap-3 pt-6">
                        <Button onClick={() => setShowApproveModal(false)} variant="outline" className="flex-1">Cancel</Button>
                        <Button
                            onClick={handleApprove}
                            variant="primary"
                            className={`flex-1 ${isRecruiter ? 'bg-[#3B82F6]' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                        >
                            {isRecruiter ? 'Move to Shortlist' : 'Approve & Sync'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Application">
                <div className="space-y-4 pt-2">
                    <p className="text-sm text-slate-600 font-medium italic">
                        "Your feedback is valuable for the student's learning journey."
                    </p>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-rose-500 outline-none shadow-inner h-32"
                        placeholder="Reason for rejection (this will be shared with the student)..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        autoFocus
                    ></textarea>
                    <div className="flex gap-3 pt-4">
                        <Button onClick={() => setShowRejectModal(false)} variant="outline" className="flex-1 border-slate-200">Back</Button>
                        <Button onClick={handleReject} variant="primary" className="flex-1 bg-rose-600 hover:bg-rose-700 border-rose-600 shadow-lg shadow-rose-500/20">Confirm Rejection</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApplicationDetail;
