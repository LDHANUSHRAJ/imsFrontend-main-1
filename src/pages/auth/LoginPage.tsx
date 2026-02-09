import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Building2, UserCircle2, Lock, School } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    // const location = useLocation(); // Unused
    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    // Check if we are in specific role login mode based on URL or state
    // Default to generic login that handles all
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(username, password);
            addNotification({
                title: 'Welcome Back',
                message: 'Successfully logged in to Christ University Internship Portal',
                type: 'success'
            });

            // Redirect happens in AuthContext or here if needed, but context usually handles state
            // Explicit redirect check:
            // The AuthContext login function usually doesn't return the role directly if void, 
            // but if it does or if we check user state.
            // For now, relying on AuthContext to set user and redirect via ProtectedRoute or useEffect there.
            // If manual redirect needed:
            // navigate('/dashboard'); 
        } catch (error: any) {
            console.error('Login Error:', error);
            addNotification({
                title: 'Login Failed',
                message: error.response?.data?.detail || 'Invalid credentials. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-christGray flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row animate-scale-in">

                {/* Left Side - Branding */}
                <div className="md:w-1/2 bg-christBlue text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <Building2 size={400} className="absolute -bottom-20 -left-20" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <School size={40} className="text-christGold" />
                            <div>
                                <h1 className="text-2xl font-bold font-serif tracking-wide">CHRIST</h1>
                                <p className="text-xs tracking-widest uppercase text-christGold">Deemed to be University</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">Internship Management Portal</h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Streamlining the bridge between academic excellence and corporate opportunities.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-blue-200 mt-12">
                        <p>© {new Date().getFullYear()} Christ University. All rights reserved.</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                        <p className="text-slate-500 mt-2">Access your portal dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address / Username</label>
                            <div className="relative">
                                <UserCircle2 className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input pl-10 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all py-3"
                                    placeholder="Enter your email or username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <a href="#" className="text-xs font-semibold text-christBlue hover:underline">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pl-10 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all py-3"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 text-lg shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm mb-4">New Corporate Partner?</p>
                        <Link
                            to="/auth/register"
                            className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all hover:border-christBlue hover:text-christBlue"
                        >
                            <Building2 size={16} />
                            Register Company
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
