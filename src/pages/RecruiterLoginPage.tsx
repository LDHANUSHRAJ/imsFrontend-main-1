import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Building2, ArrowRight } from 'lucide-react';

const RecruiterLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Force strict Recruiter role
            await login(email, password, 'RECRUITER');
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero / Branding (Use Navy Blue) */}
            <div className="hidden lg:flex w-1/2 bg-[#0F2540] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0F2540] opacity-90 pattern-grid-lg"></div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="mb-6 flex items-center gap-3">
                        <Building2 size={40} className="text-[#D4AF37]" />
                        <h1 className="text-3xl font-bold font-serif">Christ University</h1>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        Connect with Future Leaders
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Welcome to the Corporate Recruitment Portal. Manage your job postings,
                        review applications, and hire top talent from Christ University.
                    </p>
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                        <span>Don't have an account?</span>
                        <Link to="/register" className="hover:underline flex items-center gap-1">
                            Register Company <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1E3A5F] rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37] rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* Right Side - Login Form (White) */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-[480px]">
                    <div className="mb-10">
                        <span className="bg-blue-50 text-[#0F2540] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Recruiter Portal
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Please login to access your dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full h-[52px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl 
                                             text-gray-900 focus:ring-2 focus:ring-[#0F2540] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <button type="button" className="text-sm font-semibold text-[#0F2540] hover:underline">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-[52px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl 
                                             text-gray-900 focus:ring-2 focus:ring-[#0F2540] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[52px] bg-[#0F2540] text-white font-bold rounded-xl text-md
                                     hover:bg-[#1a2f4d] shadow-lg shadow-[#0F2540]/20 active:scale-[0.98] 
                                     disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Not registered with Christ University?
                        <Link to="/register" className="ml-1 text-[#0F2540] font-bold hover:underline">
                            Partner with us
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecruiterLoginPage;
