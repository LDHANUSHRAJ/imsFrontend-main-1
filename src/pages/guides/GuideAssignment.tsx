import { useEffect, useState } from 'react';
import { GuideService } from '../../services/guide.service';
import { FacultyService } from '../../services/faculty.service';
import type { GuideAssignment as GuideAssignmentType, AssignmentRecommendation, Faculty, AssignmentStats } from '../../types';
import { UserCheck, Briefcase, GraduationCap, Sparkles, Filter, Search, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useNotifications } from '../../context/NotificationContext';

const GuideAssignment = () => {
    const { addNotification } = useNotifications();
    const [assignments, setAssignments] = useState<GuideAssignmentType[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [stats, setStats] = useState<AssignmentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Filters
    const [departmentFilter, setDepartmentFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [showAIPreview, setShowAIPreview] = useState(false);
    const [showManualAssign, setShowManualAssign] = useState(false);
    const [showReassign, setShowReassign] = useState(false);
    const [recommendations, setRecommendations] = useState<AssignmentRecommendation[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<GuideAssignmentType | null>(null);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [reassignReason, setReassignReason] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [assignmentsData, facultyData, statsData] = await Promise.all([
                GuideService.getAll(),
                FacultyService.getAll(),
                GuideService.getAssignmentStats()
            ]);
            setAssignments(assignmentsData || []);
            setFaculty(facultyData || []);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoAssign = async () => {
        setProcessing(true);
        try {
            const recs = await GuideService.autoAssignGuides();
            setRecommendations(recs);
            setShowAIPreview(true);
        } catch (error) {
            console.error('Error generating recommendations:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to generate AI recommendations',
                type: 'error',
                category: 'SYSTEM'
            });
        } finally {
            setProcessing(false);
        }
    };

    const applyAIRecommendations = async () => {
        setProcessing(true);
        try {
            await GuideService.applyRecommendations(recommendations);
            addNotification({
                title: 'AI Assignment Complete',
                message: `Successfully assigned ${recommendations.length} students to faculty guides`,
                type: 'success',
                category: 'SYSTEM'
            });
            setShowAIPreview(false);
            loadData();
        } catch (error) {
            console.error('Error applying recommendations:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleManualAssign = async () => {
        if (!selectedStudent || !selectedFacultyId) return;

        setProcessing(true);
        try {
            const selectedFac = faculty.find(f => f.id === selectedFacultyId);
            if (selectedFac) {
                await GuideService.assignGuide(selectedStudent.id, selectedFac.name);
                await FacultyService.updateLoad(selectedFacultyId, 1);

                addNotification({
                    title: 'Guide Assigned',
                    message: `${selectedFac.name} assigned to ${selectedStudent.studentName}`,
                    type: 'success',
                    category: 'SYSTEM'
                });

                setShowManualAssign(false);
                setSelectedStudent(null);
                setSelectedFacultyId('');
                loadData();
            }
        } catch (error) {
            console.error('Error assigning guide:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleReassign = async () => {
        if (!selectedStudent || !selectedFacultyId || !reassignReason.trim()) return;

        setProcessing(true);
        try {
            const selectedFac = faculty.find(f => f.id === selectedFacultyId);
            if (selectedFac) {
                await GuideService.reassignGuide(
                    selectedStudent.id,
                    selectedFacultyId,
                    selectedFac.name,
                    reassignReason
                );

                addNotification({
                    title: 'Guide Reassigned',
                    message: `${selectedStudent.studentName} reassigned to ${selectedFac.name}`,
                    type: 'info',
                    category: 'SYSTEM'
                });

                setShowReassign(false);
                setSelectedStudent(null);
                setSelectedFacultyId('');
                setReassignReason('');
                loadData();
            }
        } catch (error) {
            console.error('Error reassigning guide:', error);
        } finally {
            setProcessing(false);
        }
    };

    // Filter assignments
    const filteredAssignments = assignments.filter(a => {
        const matchesDept = departmentFilter === 'All' || a.department === departmentFilter;
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Assigned' && a.guide) ||
            (statusFilter === 'Unassigned' && !a.guide);
        const matchesSearch = searchQuery === '' ||
            a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesDept && matchesStatus && matchesSearch;
    });

    const departments = ['All', ...new Set(assignments.map(a => a.department))];

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2137]"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F2137] flex items-center gap-2">
                            <Sparkles className="text-[#3B82F6]" size={28} />
                            AI-Powered Guide Assignment
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Intelligent faculty assignment based on expertise, department, and workload
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleAutoAssign}
                        disabled={processing || stats?.unassignedStudents === 0}
                        className="flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        {processing ? 'Processing...' : 'Auto-Assign All'}
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
                                <p className="text-2xl font-bold text-[#0F2137] mt-1">{stats.totalStudents}</p>
                            </div>
                            <Users className="text-slate-300" size={32} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Assigned</p>
                                <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.assignedStudents}</p>
                            </div>
                            <UserCheck className="text-emerald-400" size={32} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Unassigned</p>
                                <p className="text-2xl font-bold text-amber-900 mt-1">{stats.unassignedStudents}</p>
                            </div>
                            <AlertCircle className="text-amber-400" size={32} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Departments</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">{Object.keys(stats.byDepartment).length}</p>
                            </div>
                            <TrendingUp className="text-blue-400" size={32} />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">Filters:</span>
                    </div>

                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#3B82F6] outline-none"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#3B82F6] outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Unassigned">Unassigned</option>
                    </select>

                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search student name or reg no..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Internship</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Company</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Assigned Guide</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAssignments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                        No students found matching your filters
                                    </td>
                                </tr>
                            ) : (
                                filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-[#0F2137] p-1.5 rounded-lg">
                                                    <GraduationCap className="text-white" size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#0F2137] text-sm">{assignment.studentName}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{assignment.studentRegNo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-700">{assignment.department}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase size={14} className="text-slate-400" />
                                                <span className="text-sm text-slate-700">{assignment.internshipTitle}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-600">{assignment.companyName}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {assignment.guide ? (
                                                <div className="group relative">
                                                    <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                                        <UserCheck size={14} className="text-emerald-700" />
                                                        <span className="text-sm font-bold text-emerald-700">{assignment.guide}</span>
                                                    </div>
                                                    {assignment.assignmentReasoning && (
                                                        <div className="absolute z-10 invisible group-hover:visible bg-slate-900 text-white text-xs rounded-lg px-3 py-2 -top-2 left-0 transform -translate-y-full w-64 shadow-lg">
                                                            {assignment.assignmentReasoning}
                                                            <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                    <AlertCircle size={14} className="text-amber-700" />
                                                    <span className="text-sm font-bold text-amber-700 italic">Not Assigned</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={
                                                assignment.status === 'COMPLETED' ? 'success' :
                                                    assignment.status === 'IN_PROGRESS' ? 'info' :
                                                        assignment.status === 'CLOSURE_SUBMITTED' ? 'success' :
                                                            'warning'
                                            }>
                                                {assignment.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {!assignment.guide ? (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedStudent(assignment);
                                                            setShowManualAssign(true);
                                                        }}
                                                    >
                                                        Assign
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedStudent(assignment);
                                                            setShowReassign(true);
                                                        }}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <RefreshCw size={12} />
                                                        Reassign
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Preview Modal */}
            <Modal
                isOpen={showAIPreview}
                onClose={() => setShowAIPreview(false)}
                title="AI Assignment Recommendations"
                maxWidth="max-w-3xl"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <strong>AI Analysis Complete:</strong> Found {recommendations.length} optimal faculty matches based on department alignment, expertise, and workload balance.
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3">
                        {recommendations.map((rec) => {
                            const student = assignments.find(a => a.id === rec.studentId);
                            return (
                                <div key={rec.studentId} className="bg-white border border-slate-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-bold text-[#0F2137]">{student?.studentName}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{student?.internshipTitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-700">{rec.facultyName}</p>
                                            <p className="text-xs text-slate-500">Match: {Math.round(rec.matchScore)}%</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 bg-slate-50 rounded px-3 py-2 flex flex-col gap-2">
                                        <p className="text-xs text-slate-600 italic">{rec.reasoning}</p>
                                        {rec.matchedSpecializations && rec.matchedSpecializations.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {rec.matchedSpecializations.map(spec => (
                                                    <span key={spec} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold uppercase tracking-wider">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowAIPreview(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={applyAIRecommendations}
                            disabled={processing}
                        >
                            {processing ? 'Applying...' : 'Apply All Assignments'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Manual Assignment Modal */}
            <Modal
                isOpen={showManualAssign}
                onClose={() => {
                    setShowManualAssign(false);
                    setSelectedStudent(null);
                    setSelectedFacultyId('');
                }}
                title="Manual Guide Assignment"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    {selectedStudent && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-sm font-bold text-[#0F2137]">{selectedStudent.studentName}</p>
                            <p className="text-xs text-slate-500">{selectedStudent.internshipTitle} @ {selectedStudent.companyName}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Faculty Guide</label>
                        <select
                            value={selectedFacultyId}
                            onChange={(e) => setSelectedFacultyId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                        >
                            <option value="">-- Select Faculty --</option>
                            {faculty
                                .filter(f => selectedStudent ? f.department === selectedStudent.department : true)
                                .map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.name} ({f.department}) - Load: {f.currentLoad}/{f.maxCapacity}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowManualAssign(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={handleManualAssign}
                            disabled={!selectedFacultyId || processing}
                        >
                            {processing ? 'Assigning...' : 'Assign Guide'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Reassignment Modal */}
            <Modal
                isOpen={showReassign}
                onClose={() => {
                    setShowReassign(false);
                    setSelectedStudent(null);
                    setSelectedFacultyId('');
                    setReassignReason('');
                }}
                title="Reassign Faculty Guide"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    {selectedStudent && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-sm font-bold text-[#0F2137]">{selectedStudent.studentName}</p>
                            <p className="text-xs text-slate-500">Current Guide: <span className="font-bold text-emerald-700">{selectedStudent.guide}</span></p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Faculty Guide</label>
                        <select
                            value={selectedFacultyId}
                            onChange={(e) => setSelectedFacultyId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                        >
                            <option value="">-- Select New Faculty --</option>
                            {faculty
                                .filter(f => selectedStudent ? f.id !== selectedStudent.guideId : true)
                                .map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.name} ({f.department}) - Load: {f.currentLoad}/{f.maxCapacity}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Reassignment</label>
                        <textarea
                            value={reassignReason}
                            onChange={(e) => setReassignReason(e.target.value)}
                            placeholder="Enter reason for reassignment..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none min-h-[80px]"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowReassign(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={handleReassign}
                            disabled={!selectedFacultyId || !reassignReason.trim() || processing}
                        >
                            {processing ? 'Reassigning...' : 'Confirm Reassignment'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GuideAssignment;