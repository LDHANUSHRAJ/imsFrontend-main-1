import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';
import { useNotifications } from '../context/NotificationContext';
import { User, Mail, Lock, Building2, GraduationCap, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Department, Program, Campus } from '../types';

const StudentRegisterPage = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    // Data for dropdowns
    const [departments, setDepartments] = useState<Department[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department_id: '',
        program_id: '',
        campus_id: ''
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [depts, progs, camps] = await Promise.all([
                    AdminService.getDepartments(),
                    AdminService.getPrograms(),
                    AdminService.getCampuses()
                ]);
                setDepartments(depts);
                setPrograms(progs);
                setCampuses(camps);
            } catch (error) {
                console.error("Failed to fetch registration metadata", error);
            }
        };
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (formData.department_id) {
            setFilteredPrograms(programs.filter(p => p.department_id === formData.department_id));
        } else {
            setFilteredPrograms([]);
        }
    }, [formData.department_id, programs]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            addNotification({ title: 'Password Mismatch', message: 'Passwords do not match!', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const apiPayload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                department_id: formData.department_id,
                program_id: formData.program_id,
                campus_id: formData.campus_id
            };

            await AuthService.registerStudent(apiPayload);

            addNotification({
                title: 'Registration Successful',
                message: "Your student account has been created. You can now login.",
                type: 'success',
                category: 'SYSTEM'
            });

            navigate('/login/student');

        } catch (error: any) {
            console.error("Registration failed", error);
            addNotification({
                title: 'Registration Failed',
                message: error.response?.data?.detail || "Could not complete registration. Please try again.",
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6 py-12">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[600px] p-10 relative overflow-hidden">

                <Link to="/login/student" className="absolute top-8 left-8 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>

                <div className="text-center mb-10 pt-4">
                    <h1 className="text-3xl font-black text-[#0F2137] tracking-tight">Create Student Account</h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Join the Christ University Internship Portal</p>
                </div>

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">University Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@christ.in"
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Campus */}
                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Campus</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <select
                                name="campus_id"
                                value={formData.campus_id}
                                onChange={handleChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                            >
                                <option value="">Select Campus</option>
                                {campuses.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Department</label>
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                            >
                                <option value="">Select Dept</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Program */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Program</label>
                        <div className="relative group">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <select
                                name="program_id"
                                value={formData.program_id}
                                onChange={handleChange}
                                required
                                disabled={!formData.department_id}
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none disabled:opacity-50"
                            >
                                <option value="">Select Program</option>
                                {filteredPrograms.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="md:col-span-2 w-full h-14 bg-blue-600 text-white text-base font-black rounded-2xl hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-70 transition-all duration-300 flex items-center justify-center gap-2 mt-4 group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                        Already have an account? <Link to="/login/student" className="text-blue-600 hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentRegisterPage;
