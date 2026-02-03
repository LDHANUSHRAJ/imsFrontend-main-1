import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'IC' | 'HOD' | 'FACULTY' | 'RECRUITER'>('FACULTY');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password, role);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error?.message || 'Login failed. Please verify your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F2540] to-[#1E3A5F] flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")', backgroundBlendMode: 'overlay' }}>
            {/* Login Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[500px] p-10 transform transition-all hover:scale-[1.005]">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img src="/christ-logo.png" alt="Christ University Logo" className="h-24 w-auto object-contain drop-shadow-md" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#0F2137] tracking-tight">
                        IMS Portal
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Secure Access Gateway</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Role Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Portal Role</label>
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg 
                                         text-slate-700 text-sm font-semibold focus:ring-2 focus:ring-[#0F2540] outline-none transition-all cursor-pointer appearance-none"
                            >
                                <option value="FACULTY">Faculty Guide / Mentor</option>
                                <option value="HOD">Head of Department (HOD)</option>
                                <option value="IC">Internship Coordinator</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F2540] transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@christ.in"
                                required
                                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-lg 
                                         text-slate-800 placeholder-slate-400 text-sm font-medium
                                         focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0F2540] focus:border-transparent
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F2540] transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-lg 
                                         text-slate-800 placeholder-slate-400 text-sm font-medium
                                         focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0F2540] focus:border-transparent
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#0F2540] border-[#0F2540]' : 'bg-white border-slate-300'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <span className="text-sm text-slate-600 font-medium group-hover:text-[#0F2540]">Remember me</span>
                        </label>
                        <button type="button" className="text-sm font-bold text-[#0F2540] hover:underline">
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#0F2540] text-white text-base font-bold rounded-lg
                                 hover:bg-[#1a314d] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                                 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            'Access Dashboard'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Technical support needed? <a href="#" className="text-[#0F2540] font-bold hover:underline">Contact IT Helpdesk</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;