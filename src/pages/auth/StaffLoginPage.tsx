import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Users, UserCircle2, Lock, School, ArrowLeft, ChevronDown } from 'lucide-react';

// All available staff roles with display labels
const STAFF_ROLE_OPTIONS = [
    { value: '', label: 'Select Your Role' },
    { value: 'FACULTY', label: 'Faculty Guide' },
    { value: 'PLACEMENT_OFFICE', label: 'Placement Coordinator' },
    { value: 'PLACEMENT_HEAD', label: 'Placement Head' },
    { value: 'HOD', label: 'Head of Department (HOD)' },
    { value: 'PROGRAMME_COORDINATOR', label: 'Programme Coordinator (IC)' },
    { value: 'ADMIN', label: 'System Administrator' },
];

const StaffLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            addNotification({
                title: 'Role Required',
                message: 'Please select your role before logging in.',
                type: 'warning'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Pass the selected role - AuthContext will validate it matches backend role
            await login(username, password, selectedRole);

            const roleLabel = STAFF_ROLE_OPTIONS.find(r => r.value === selectedRole)?.label || selectedRole;
            addNotification({
                title: 'Welcome Back',
                message: `Successfully logged in as ${roleLabel}`,
                type: 'success'
            });
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login Error:', error);
            // Show the exact error message (includes role mismatch info)
            const errorMessage = error.message || error.response?.data?.detail || 'Invalid credentials. Please try again.';
            addNotification({
                title: 'Login Failed',
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-christBlue mb-6 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <Users size={200} className="absolute -bottom-10 -right-10" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <School size={32} className="text-christGold" />
                            </div>
                            <h1 className="text-2xl font-bold mb-1">Staff Portal</h1>
                            <p className="text-emerald-200 text-sm">Christ University Faculty & Administration</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                            <p className="text-xs text-amber-700 text-center font-medium">
                                ⚠️ Select your exact role. You can only login if your account matches the selected role.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Role Selector - Required */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Your Role *</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full h-12 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        {STAFF_ROLE_OPTIONS.map((role) => (
                                            <option key={role.value} value={role.value}>{role.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <UserCircle2 className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                                        placeholder="faculty@christuniversity.in"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !selectedRole}
                                className="w-full h-12 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Users size={18} />
                                        Sign In as {selectedRole ? STAFF_ROLE_OPTIONS.find(r => r.value === selectedRole)?.label : 'Staff'}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">
                                <Link to="/login/student" className="text-christBlue font-semibold hover:underline">Student Login</Link>
                                {' '}or{' '}
                                <Link to="/login/corporate" className="text-christBlue font-semibold hover:underline">Corporate Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLoginPage;
