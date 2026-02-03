import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'IC' | 'HOD' | 'FACULTY'>('FACULTY'); // Default to Faculty
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password, role);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#E8EEF3] flex items-center justify-center p-4">
            {/* Login Card */}
            <div className="bg-white rounded-[24px] shadow-lg w-full max-w-[520px] p-12">
                {/* Title */}
                <h1 className="text-[32px] font-bold text-[#0F2137] text-center mb-2">
                    Staff Portal Login
                </h1>
                <p className="text-gray-500 text-center mb-10">Access for Faculty, HODs, and Admin</p>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Role Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as any)}
                            className="w-full h-[56px] px-4 bg-white border border-gray-200 rounded-xl 
                                     text-gray-700 text-base focus:ring-2 focus:ring-[#0F2137] outline-none transition-all cursor-pointer"
                        >
                            <option value="FACULTY">Faculty / Guide</option>
                            <option value="HOD">Head of Department (HOD)</option>
                            <option value="IC">Internship Coordinator (Admin)</option>
                        </select>
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            className="w-full h-[56px] pl-12 pr-4 bg-white border border-gray-200 rounded-xl 
                                     text-gray-700 placeholder-gray-400 text-base
                                     focus:outline-none focus:ring-2 focus:ring-[#0F2137] focus:border-transparent
                                     transition-all"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full h-[56px] pl-12 pr-4 bg-white border border-gray-200 rounded-xl 
                                     text-gray-700 placeholder-gray-400 text-base
                                     focus:outline-none focus:ring-2 focus:ring-[#0F2137] focus:border-transparent
                                     transition-all"
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <button
                            type="button"
                            className="text-sm font-semibold text-[#0F2137] hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[56px] bg-[#0F2137] text-white text-lg font-bold rounded-xl
                                 hover:bg-[#1a2f4d] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Create Account Link */}
                <div className="mt-8 text-center text-base text-gray-600">
                    New User?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#0F2137] font-bold hover:underline"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;