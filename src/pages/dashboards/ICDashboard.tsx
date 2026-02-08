import { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { GuideService } from '../../services/guide.service';
import { useAuth } from '../../context/AuthContext';
// import { AdminService } from '../../services/admin.service'; // Not needed if GuideService handles it
// import type { User } from '../../types';

const ICDashboard = () => {
    const { user, logout } = useAuth(); // Get user to access department_id
    const [students, setStudents] = useState<any[]>([]);
    const [faculty, setFaculty] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching allocation data for Coordinator");

            // API: GET /coordinator/allocation-data
            const allocationData = await GuideService.getAllocationData();

            // Extract students and faculty from response
            const studentsData = allocationData.students || allocationData.data?.students || [];
            const facultyData = allocationData.faculty || allocationData.data?.faculty || [];

            setStudents(studentsData);
            setFaculty(facultyData);
        } catch (err: any) {
            console.error("Failed to load guide allocation data", err);
            const status = err.response?.status;
            let msg = err.response?.data?.detail || err.message || "Unknown error";

            if (status === 403) {
                msg = "Permission Denied. Ensure 'Programme Coordinator' role has access to /coordinator/allocation-data.";
            } else if (status === 404) {
                msg = "Coordinator endpoint not found. Ensure backend has /coordinator/allocation-data implemented.";
            }

            setError(`Failed to load data (Status: ${status}): ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuideChange = async (studentId: string, newFacultyId: string) => {
        if (!newFacultyId) return;

        setAssigningId(studentId);

        try {
            // API: PATCH /coordinator/allocate-guide
            await GuideService.allocateGuide(studentId, newFacultyId);
            await loadData();
        } catch (err: any) {
            console.error("Failed to assign guide", err);
            const msg = err.response?.data?.detail || err.message || "Unknown error";
            alert(`Unable to assign guide: ${msg}`);
        } finally {
            setAssigningId(null);
        }
    };

    const filteredStudents = students.filter(s =>
        (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.program?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 dashboard-enter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 dashboard-header">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Guide Allocation Management</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 text-sm font-medium">
                            Assign guides for Department:
                        </p>
                        <span className="font-bold text-blue-600">{user?.department_id || 'Checking...'}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={loadData} variant="outline" className="flex items-center gap-2" disabled={isLoading}>
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        {isLoading ? "Refreshing..." : "Refresh Data"}
                    </Button>
                    <Button onClick={logout} variant="danger" className="bg-red-600 hover:bg-red-700 text-white">
                        Logout
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                    <button onClick={loadData} className="ml-auto text-sm underline hover:text-red-800">Retry</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="relative w-full max-w-sm">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-slate-500">
                        Total Students: <span className="font-bold text-[#0F2137]">{filteredStudents.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Program / Class</th>
                                <th className="px-6 py-4">Internship Status</th>
                                <th className="px-6 py-4">Current Guide</th>
                                <th className="px-6 py-4">Assign New Guide</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading allocation data...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-400">
                                        {error ? 'Failed to load data.' : 'No students found.'}
                                        <br />
                                        <span className="text-xs text-red-400 mt-2 block">
                                            (Debug: {faculty.length} faculty loaded)
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#0F2137]">{student.name}</p>
                                                    <p className="text-xs text-slate-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-700 font-medium">
                                                {student.program || 'MCA'}
                                            </span>
                                            <p className="text-xs text-slate-400 mt-0.5">N/A</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${student.internship_status ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                                                {student.internship_status || 'Not Assigned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Logic to show current guide if available in student object */}
                                            {student.guide_name ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-700 font-medium text-sm">
                                                        {student.guide_name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-purple-600 font-medium text-xs">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                <select
                                                    className="w-full border border-slate-300 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
                                                    onChange={(e) => handleGuideChange(student.id, e.target.value)}
                                                    value=""
                                                    disabled={assigningId === student.id}
                                                >
                                                    <option value="" disabled>Change Guide...</option>
                                                    {faculty.map(f => (
                                                        <option key={f.id} value={f.id}>{f.name}</option>
                                                    ))}
                                                </select>
                                                {assigningId === student.id && (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
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
            {/* Debug showing loaded counts can stay for now */}
            <div className="text-xs text-slate-400 px-2">
                Debug: Loaded {students.length} students, {faculty.length} faculty. User Dept: {user?.department_id}
            </div>
        </div>
    );
};

export default ICDashboard;
