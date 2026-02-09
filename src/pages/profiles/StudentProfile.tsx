
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/auth.service';
import { UserCircle, Mail, BookOpen, GraduationCap, Building2, User } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await AuthService.getCurrentUser();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
    }

    const displayUser = profile || user;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">Student Profile</h1>
            <p className="text-slate-500 font-bold mb-8">Manage your academic and personal details</p>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="h-32 w-32 rounded-[2rem] bg-white p-1 shadow-lg">
                            <div className="h-full w-full bg-slate-100 rounded-[1.8rem] flex items-center justify-center text-4xl font-black text-slate-300">
                                {displayUser?.name?.charAt(0).toUpperCase() || <User size={40} />}
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                                Student
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-[#0F172A] mb-1">{displayUser?.name}</h2>
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                            <Mail size={16} />
                            <span>{displayUser?.email}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <BookOpen size={14} /> Program
                            </div>
                            <p className="text-lg font-black text-slate-700">{displayUser?.program || 'Not Assigned'}</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <GraduationCap size={14} /> Class
                            </div>
                            <p className="text-lg font-black text-slate-700">{displayUser?.class_name || 'Not Assigned'}</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <UserCircle size={14} /> Faculty Guide
                            </div>
                            <p className="text-lg font-black text-slate-700">{displayUser?.faculty_guide_name || 'No Guide Assigned Yet'}</p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Contact your department if this information is incorrect.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
