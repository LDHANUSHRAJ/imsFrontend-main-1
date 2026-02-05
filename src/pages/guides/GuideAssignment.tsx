import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GuideService } from '../../services/guide.service';
import type { GuideAssignment as GuideAssignmentType } from '../../types';
import { UserCheck, Briefcase, GraduationCap, MessageSquare, Plus, Activity } from 'lucide-react';
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
    const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const data = await GuideService.getAll();
            setAssignments(data || []);
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
            if (editingFeedbackId) {
                // Edit Mode
                await GuideService.updateFeedback(selectedAssignment, editingFeedbackId, feedback);
                addNotification({
                    title: 'Feedback Updated',
                    message: `Feedback has been successfully updated.`,
                    type: 'success',
                    category: 'LOG'
                });
            } else {
                // Create Mode
                await GuideService.addFeedback(selectedAssignment, feedback);
                addNotification({
                    title: 'Feedback Submitted',
                    message: `Mentee feedback has been synced with the ERP / Viva API.`,
                    type: 'info',
                    category: 'LOG'
                });
            }

            setShowFeedbackModal(false);
            setFeedback('');
            setEditingFeedbackId(null);
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
                                    <GraduationCap className="text-white" size={20} />
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
                                        <UserCheck size={14} className="text-emerald-700" />
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
                                        {assignment.feedback && assignment.feedback.length > 0 && (
                                            <Link
                                                to={`/guide/student/${assignment.id}`}
                                                className="block text-center text-[10px] font-bold text-slate-400 hover:text-[#0F2137] uppercase tracking-tighter transition-colors"
                                            >
                                                View Activity Logs
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Allocations Table */}
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-4xl">
                <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-4">Recent Allocations (HOD & IC View)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Student</th>
                                <th className="px-4 py-3">Register No</th>
                                <th className="px-4 py-3">Assigned Guide</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Allocated By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { student: 'Rahul Sharma', reg: '2347201', guide: 'Dr. Rajesh Kumar', by: 'HOD' },
                                { student: 'Sneha Kapoor', reg: '2347205', guide: 'Prof. Anita Singh', by: 'Coordinator' },
                                { student: 'Vikram Singh', reg: '2347212', guide: 'Dr. John Doe', by: 'HOD' },
                            ].map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-bold text-[#0F2137]">{item.student}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.reg}</td>
                                    <td className="px-4 py-3 font-medium text-emerald-700">{item.guide}</td>
                                    <td className="px-4 py-3 text-right text-xs font-bold text-slate-400">{item.by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                onClose={() => {
                    setShowFeedbackModal(false);
                    setEditingFeedbackId(null);
                    setFeedback('');
                }}
                title="Mentorship Feedback & Monitoring"
                maxWidth="max-w-xl"
            >
                <div className="space-y-6">
                    {/* Previous Feedback List */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-h-60 overflow-y-auto space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Previous Feedback</h4>
                        {assignments.find(a => a.id === selectedAssignment)?.feedback?.length === 0 ? (
                            <p className="text-sm text-slate-400 italic text-center py-4">No feedback given yet.</p>
                        ) : (
                            assignments.find(a => a.id === selectedAssignment)?.feedback?.map((f) => (
                                <div key={f.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-[#0F2137]">{f.guideName || 'Guide'}</span>
                                        <span className="text-[10px] text-slate-400">{f.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-700">{f.message}</p>
                                    <button
                                        onClick={() => {
                                            setFeedback(f.message);
                                            setEditingFeedbackId(f.id);
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded transition-opacity"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700">
                                {editingFeedbackId ? "Edit Feedback" : "Add New Feedback"}
                            </label>
                            {editingFeedbackId && (
                                <button
                                    onClick={() => {
                                        setEditingFeedbackId(null);
                                        setFeedback('');
                                    }}
                                    className="text-xs text-slate-500 hover:text-red-500"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className={`w-full bg-white border rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none min-h-[100px] ${editingFeedbackId ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'}`}
                            placeholder="Enter specific feedback for the student..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowFeedbackModal(false)}>Close</Button>
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={handleAddFeedback}
                            disabled={!feedback.trim()}
                        >
                            {editingFeedbackId ? "Update Feedback" : "Submit Feedback"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GuideAssignment;

// Local Alert Icon Helper for the awaiting state
const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);