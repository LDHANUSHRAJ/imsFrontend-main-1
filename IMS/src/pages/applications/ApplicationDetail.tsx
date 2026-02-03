import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApplicationService } from '../../services/mock/ApplicationService';
import { JobService } from '../../services/mock/JobService';
import { ArrowLeft, User, Briefcase, FileText, CheckCircle, XCircle, Download, GraduationCap } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { useNotifications } from '../../context/NotificationContext';

const ApplicationDetail = () => {
    const { id } = useParams();
    const { addNotification } = useNotifications();
    const [application, setApplication] = useState<any>(null);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadApplication();
    }, [id]);

    const loadApplication = async () => {
        try {
            const appData = await ApplicationService.getById(id!);
            setApplication(appData);
            const jobData = await JobService.getAll();
            const relatedJob = jobData.find(j => j.id === appData?.jobId);
            setJob(relatedJob || null);
        } catch (error) {
            console.error('Error loading application:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        await ApplicationService.updateStatus(id!, 'APPROVED');
        addNotification({
            title: 'Application Approved',
            message: `LOR generated for ${application?.studentName}. Status synced to Student App.`,
            type: 'success',
            category: 'APPROVAL'
        });
        setShowApproveModal(false);
        loadApplication();
    };

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2137]"></div></div>;

    return (
        <div className="max-w-5xl mx-auto">
            <Breadcrumbs items={[
                { label: 'Applications', path: '/applications' },
                { label: application.studentRegNo }
            ]} />

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-[#0F2137] p-3 rounded-xl">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F2137]">{application.studentName}</h1>
                        <p className="text-slate-500 font-medium">Register No: {application.studentRegNo}</p>
                    </div>
                </div>
                <Badge variant={application.status === 'APPROVED' ? 'success' : application.status === 'REJECTED' ? 'error' : 'warning'}>
                    {application.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Student Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[#0F2137] uppercase tracking-wider mb-6 flex items-center gap-2">
                            <User size={18} className="text-[#3B82F6]" />
                            Academic Profile
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase">Program</label>
                                <div className="text-sm font-semibold text-slate-700">Master of Computer Applications</div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase">Current Batch</label>
                                <div className="text-sm font-semibold text-slate-700">2024 - 2026</div>
                            </div>
                        </div>
                    </div>

                    {/* LOR Generation - Part C requirement */}
                    {application.status === 'APPROVED' && (
                        <div className="bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-200 p-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500 p-2 rounded-lg">
                                    <FileText className="text-white" size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-emerald-900 font-bold mb-1">Letter of Recommendation Generated</h3>
                                    <p className="text-emerald-700 text-sm mb-4 leading-relaxed">
                                        As per CHRIST University policy, an official LOR has been issued for this internship application.
                                    </p>
                                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 w-auto px-6 flex items-center gap-2">
                                        <Download size={16} />
                                        Download PDF Placeholder
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                        <h3 className="text-sm font-bold text-[#0F2137] uppercase tracking-wider mb-4">Faculty Review</h3>
                        {application.status === 'PENDING' ? (
                            <div className="space-y-3">
                                <Button onClick={() => setShowApproveModal(true)} variant="primary" className="w-full py-4">
                                    Approve & Issue LOR
                                </Button>
                                <Button onClick={() => setShowRejectModal(true)} variant="outline" className="w-full py-4 text-rose-600 hover:bg-rose-50 border-rose-100">
                                    Reject Application
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-slate-500 italic">Decision finalized on {application.appliedAt}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Confirm Internship Approval">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Approving this application will notify the student via the **Christ Student App** and automatically generate the necessary LOR for the recruiter.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Button onClick={() => setShowApproveModal(false)} variant="outline" className="flex-1">Cancel</Button>
                        <Button onClick={handleApprove} variant="primary" className="flex-1">Approve & Sync</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApplicationDetail;