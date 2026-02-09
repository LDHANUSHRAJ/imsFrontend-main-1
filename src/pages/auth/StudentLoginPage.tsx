import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { GraduationCap, UserCircle2, Lock, School, ArrowLeft } from 'lucide-react';

const StudentLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Pass 'STUDENT' - only STUDENT role is allowed
            await login(username, password, 'STUDENT');
            addNotification({
                title: 'Welcome Back',
                message: 'Successfully logged in to Christ University Internship Portal',
                type: 'success'
            });
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login Error:', error);
            // Show the exact error message
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-christBlue mb-6 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-christBlue text-white p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <GraduationCap size={200} className="absolute -bottom-10 -right-10" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <School size={32} className="text-christGold" />
                            </div>
                            <h1 className="text-2xl font-bold mb-1">Student Portal</h1>
                            <p className="text-blue-200 text-sm">Christ University Internship Management</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                            <p className="text-xs text-blue-700 text-center font-medium">
                                🎓 This portal is <strong>exclusively for students</strong>. Staff and corporate users will not be able to login here.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Student Email / Register Number</label>
                                <div className="relative">
                                    <UserCircle2 className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-christBlue focus:border-transparent outline-none transition-all"
                                        placeholder="student@christuniversity.in"
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
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-christBlue focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-christBlue text-white font-bold rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <GraduationCap size={18} />
                                        Sign In as Student
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">
                                Not a student?{' '}
                                <Link to="/login/corporate" className="text-christBlue font-semibold hover:underline">Corporate Login</Link>
                                {' '}or{' '}
                                <Link to="/login/staff" className="text-christBlue font-semibold hover:underline">Staff Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLoginPage;
