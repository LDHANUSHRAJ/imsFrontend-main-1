import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GuideService, type GuideAssignment as GuideAssignmentType } from '../../services/mock/GuideService';
import { UserCheck, Briefcase, User, MessageSquare, Plus, Activity } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useNotifications } from '../../context/NotificationContext';

const GuideAssignment = () => {
    const { addNotification } = useNotifications();
    const [assignments, setAssignments] = useState<GuideAssignmentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
    const [guideName, setGuideName] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const data = await GuideService.getAll();
            setAssignments(data);
        } catch (error) {
            console.error('Error loading assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignGuide = async () => {
        if (selectedAssignment && guideName.trim()) {
            await GuideService.assignGuide(selectedAssignment, guideName);
            
            addNotification({
                title: 'Guide Assigned',
                message: `${guideName} has been assigned as mentor. Status: IN PROGRESS.`,
                type: 'success',
                category: 'SYSTEM'
            });

            setShowAssignModal(false);
            setGuideName('');
            setSelectedAssignment(null);
            loadAssignments();
        }
    };

    const handleAddFeedback = async () => {
        if (selectedAssignment && feedback.trim()) {
            await GuideService.addFeedback(selectedAssignment, feedback);
            
            addNotification({
                title: 'Feedback Submitted',
                message: `Mentee feedback has been synced with the ERP / Viva API.`,
                type: 'info',
                category: 'LOG'
            });

            setShowFeedbackModal(false);
            setFeedback('');
            setSelectedAssignment(null);
            loadAssignments();
        }
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2137]"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0F2137]">Guide Assignment & Monitoring</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">
                    Part E: Assign faculty mentors and monitor real-time internship progress.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                        {/* Status Header */}
                        <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-[#3B82F6]" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress Tracker</span>
                            </div>
                            <Badge variant={assignment.status === 'COMPLETED' ? 'success' : assignment.status === 'IN_PROGRESS' ? 'info' : 'warning'}>
                                {assignment.status.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="p-6 flex-1">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-[#0F2137] p-2.5 rounded-xl">
                                    <User className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0F2137] text-sm leading-tight">{assignment.studentName}</h3>
                                    <p className="text-[11px] font-bold text-[#3B82F6] mt-0.5 tracking-tight">{assignment.studentRegNo}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                    <Briefcase size={14} className="text-slate-400" />
                                    <span className="truncate">{assignment.internshipTitle} @ {assignment.companyName}</span>
                                </div>
                                {assignment.guide ? (
                                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                        <UserCheck size={14} />
                                        <span>Guide: {assignment.guide}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs text-amber-700 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100 italic">
                                        <AlertCircle size={14} />
                                        <span>Awaiting Mentor Assignment</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {!assignment.guide ? (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="flex-1 font-bold"
                                        onClick={() => {
                                            setSelectedAssignment(assignment.id);
                                            setShowAssignModal(true);
                                        }}
                                    >
                                        <Plus size={16} className="mr-1" /> Assign Guide
                                    </Button>
                                ) : (
                                    <div className="w-full space-y-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full font-bold text-[#3B82F6] border-[#3B82F6]/20 hover:bg-blue-50"
                                            onClick={() => {
                                                setSelectedAssignment(assignment.id);
                                                setShowFeedbackModal(true);
                                            }}
                                        >
                                            <MessageSquare size={14} className="mr-2" /> Add Feedback
                                        </Button>
                                        {assignment.feedback.length > 0 && (
                                            <Link
                                                to={`/guides/${assignment.id}`}
                                                className="block text-center text-[10px] font-bold text-slate-400 hover:text-[#0F2137] uppercase tracking-tighter transition-colors"
                                            >
                                                View Activity Logs ({assignment.feedback.length})
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <Modal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                title="Mentor Assignment"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-500 italic">Assigning a guide will update the internship status to "IN PROGRESS" in the Student App.</p>
                    <Input
                        label="Faculty Name"
                        value={guideName}
                        onChange={(e) => setGuideName(e.target.value)}
                        placeholder="e.g., Dr. Rajesh Kumar"
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                        <Button variant="primary" className="flex-1" onClick={handleAssignGuide} disabled={!guideName.trim()}>Confirm Assignment</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                title="Add Progress Feedback"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-500">Your feedback will be visible to the student and synced with the academic logs.</p>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3B82F6]/20 min-h-[120px]"
                        placeholder="Enter monitoring notes or feedback..."
                    />
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
                        <Button variant="primary" className="flex-1" onClick={handleAddFeedback} disabled={!feedback.trim()}>Submit Feedback</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GuideAssignment;

// Local Alert Icon Helper for the awaiting state
const AlertCircle = ({ size, className }: { size: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);