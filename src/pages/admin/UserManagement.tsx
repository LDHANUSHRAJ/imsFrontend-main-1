import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Filter, Trash2, Ban, CheckCircle } from 'lucide-react';
import { AdminService } from '../../services/admin.service';
import { FacultyService } from '../../services/faculty.service';
import { fetchApplications } from '../../services/application.service';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import type { User } from '../../types';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterRole, setFilterRole] = useState<string>('ALL');
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        let debugLog: string[] = [];
        let fetchedUsers: User[] = [];

        try {
            debugLog.push("Attempting to fetch all users via Admin API...");
            // 1. Try standard Admin API
            const data = await AdminService.getUsers();

            if (Array.isArray(data)) {
                fetchedUsers = data;
            } else if (data && (data as any).users && Array.isArray((data as any).users)) {
                fetchedUsers = (data as any).users;
            } else if (data && (data as any).data && Array.isArray((data as any).data)) {
                fetchedUsers = (data as any).data;
            }
            debugLog.push(`Success: Admin API returned ${fetchedUsers.length} users.`);

        } catch (error: any) {
            debugLog.push(`Admin API failed: ${error.message || error}`);

            // 2. Fallback for Placement Coordinators (403 Forbidden)
            if (currentUser && (currentUser.role === 'PLACEMENT' || currentUser.role === 'PLACEMENT_HEAD')) {
                debugLog.push("Activating Fallback Strategy for Placement Coordinator...");

                try {
                    // A. Fetch Faculty from Same Department
                    if (currentUser.department_id) {
                        debugLog.push(`Fetching faculty for department: ${currentUser.department_id}`);
                        const faculty = await FacultyService.getByDepartment(currentUser.department_id);
                        const facultyUsers: User[] = faculty.map(f => ({
                            id: f.id,
                            name: f.name,
                            email: f.email,
                            role: 'FACULTY',
                            department_id: f.department
                        }));
                        fetchedUsers = [...fetchedUsers, ...facultyUsers];
                        debugLog.push(`Fetched ${facultyUsers.length} faculty.`);
                    }

                    // B. Fetch Students via Applications (Workaround for lacking Student API)
                    debugLog.push("Fetching students via applications...");
                    const applications = await fetchApplications();
                    const studentMap = new Map<string, User>();

                    if (Array.isArray(applications)) {
                        applications.forEach((app: any) => {
                            if (app.student && !studentMap.has(app.student_id)) {
                                studentMap.set(app.student_id, {
                                    id: app.student_id,
                                    name: app.student.name,
                                    email: app.student.email,
                                    role: 'STUDENT',
                                    department_id: currentUser.department_id // Assumption: Coordinator sees their own dept apps
                                });
                            }
                        });
                    }
                    fetchedUsers = [...fetchedUsers, ...Array.from(studentMap.values())];
                    debugLog.push(`Fetched ${studentMap.size} unique students from applications.`);

                } catch (fallbackError: any) {
                    debugLog.push(`Fallback failed: ${fallbackError.message}`);
                }
            }
        } finally {
            setUsers(fetchedUsers);
            setDebugInfo(debugLog.join('\n'));
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await AdminService.deleteUser(id);
            loadUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(u => {
        if (filterRole === 'ALL') return true;
        return u.role === filterRole;
    });

    return (
        <div className="animate-in fade-in duration-500">
            <Breadcrumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'User Management' }]} />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">User Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage system users and access roles.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20" placeholder="Search users by name or email..." />
                </div>

                <div className="flex gap-2">
                    {/* Removed PLACEMENT as requested */}
                    {['ALL', 'STUDENT', 'FACULTY', 'CORPORATE'].map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${filterRole === role
                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <Table headers={['User', 'Role', 'Department', 'Actions']}>
                {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-12">Loading users...</TableCell></TableRow>
                ) : filteredUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-12">No users found.</TableCell></TableRow>
                ) : (
                    filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#0F2137]">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-slate-600">
                                    {user.department_id || '-'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {/* Only Admins can delete usually, or enable for Coordinators if backend allows */}
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(user.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </Table>

            {/* Debug Info */}
            <div className="mt-8 bg-gray-100 p-4 rounded text-xs font-mono text-gray-600 whitespace-pre-wrap">
                <p className="font-bold">Debug Info:</p>
                {debugInfo}
                <p className="mt-2 text-blue-600">Current User Role: {currentUser?.role}, Dept: {currentUser?.department_id}</p>
            </div>
        </div>
    );
};

export default UserManagement;
