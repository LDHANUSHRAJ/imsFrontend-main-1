import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

const StudentLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = 'STUDENT';
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
            setError(err.response?.data?.error?.message || 'Login failed. Please verify your student credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[500px] p-10 transform transition-all hover:shadow-3xl relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                {/* Header */}
                <div className="text-center mb-10 relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="h-40 w-40 rounded-full overflow-hidden flex items-center justify-center p-1 bg-white shadow-lg border border-slate-100">
                            <img src="/christ-logo.png" alt="Christ University Logo" className="h-full w-full object-contain" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-[#0F2137] tracking-tight">
                        Student Portal
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Christ University Internship Gateway</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6 relative z-10">

                    {/* Email Input */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Student University ID / Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@christ.in"
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl 
                                         text-slate-800 placeholder-slate-400 text-sm font-bold
                                         focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Portal Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl 
                                         text-slate-800 placeholder-slate-400 text-sm font-bold
                                         focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between pb-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <span className="text-xs text-slate-600 font-bold group-hover:text-blue-700">Stay signed in</span>
                        </label>
                        <button type="button" className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter">
                            Forgot Access?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-blue-600 text-white text-base font-black rounded-2xl
                                 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                                 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <span>Access My Dashboard</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Quick Demo Button (Kept but refined for Students) */}
                    <button
                        type="button"
                        onClick={() => {
                            setEmail('student@christ.in');
                            setPassword('student123');
                        }}
                        className="w-full h-12 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl
                                 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all duration-200"
                    >
                        Use Demo Credentials
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        Don't have an account? <Link to="/register-student" className="text-blue-600 hover:underline">Register Now</Link>
                    </p>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-4">
                        Technical problem? <a href="#" className="text-blue-600 hover:underline">Helpdesk</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentLoginPage;
