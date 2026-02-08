import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Building2, CheckCircle, Shield,
    Globe, Linkedin, Mail, MapPin,
    Activity, ArrowUpRight, CheckCircle2,
    Search, Filter
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { RecruiterService } from '../../services/recruiter.service';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const PlacementOfficeDashboard = () => {
    const [pendingInternships, setPendingInternships] = useState<Internship[]>([]);
    const [approvedInternshipsCount, setApprovedInternshipsCount] = useState<number>(0);
    const [pendingRecruiters, setPendingRecruiters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [pending, approved, recruiters] = await Promise.all([
                    InternshipService.getPendingInternships(),
                    InternshipService.getApprovedInternships(),
                    RecruiterService.getPendingRecruiters()
                ]);

                setPendingInternships(Array.isArray(pending) ? pending : []);
                setApprovedInternshipsCount(Array.isArray(approved) ? approved.length : 0);
                setPendingRecruiters(Array.isArray(recruiters) ? recruiters : []);
            } catch (error) {
                console.error("Dashboard data fetch failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleApprove = async (id: string) => {
        // Implementation for approval
        console.log("Approving internship:", id);
    };

    return (
        <div className="space-y-10 dashboard-enter max-w-[1600px] mx-auto">
            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Placement Head Portal</h1>
                    <p className="text-slate-500 text-sm font-bold mt-1 tracking-wide opacity-70 italic">Final authorization & institutional governance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-64 transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Approved History" value={approvedInternshipsCount.toString()} icon={CheckCircle2} color="green" />
                <StatCard label="Pending Recruiters" value={pendingRecruiters.length.toString()} icon={Users} color="orange" />
                <StatCard label="Internal Requests" value={pendingInternships.length.toString()} icon={Shield} color="blue" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* PRIMARY: PENDING INTERNSHIP APPROVALS */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" />
                            Pending Internship Approvals
                        </h3>
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {pendingInternships.length} Requests
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {isLoading ? (
                            <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 italic text-slate-400 font-bold uppercase tracking-widest text-xs">
                                Synchronizing ESPro Database...
                            </div>
                        ) : pendingInternships.length > 0 ? (
                            pendingInternships.map((internship) => (
                                <div key={internship.id} className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                                    <div className="p-8 md:p-10 space-y-8">
                                        {/* Row 1: Title & Status */}
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{internship.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Private Limited</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className="text-xs font-bold text-slate-400 italic capitalize">{internship.location_type || 'Onsite'} • {internship.department?.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant="warning" className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-amber-200/50">
                                                    Pending
                                                </Badge>
                                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Request ID: #{internship.id.substring(0, 8)}</p>
                                            </div>
                                        </div>

                                        {/* Row 2: Detailed Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Users size={16} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">HR Name</p>
                                                        <p className="text-sm font-bold text-slate-700">Sundar Pichai</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Globe size={16} />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Website</p>
                                                        <a href="#" className="text-sm font-bold text-blue-600 truncate block hover:underline">https://careers.google.com</a>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <MapPin size={16} />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Address</p>
                                                        <p className="text-sm font-bold text-slate-700 truncate">N/A</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Mail size={16} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email</p>
                                                        <p className="text-sm font-bold text-slate-700">hr@google.com</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Linkedin size={16} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">LinkedIn</p>
                                                        <a href="#" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View Profile <ArrowUpRight size={12} /></a>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Shield size={16} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">CIN</p>
                                                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tighter">N/A</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Analysis Section */}
                                        <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group/ai">
                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-emerald-100 p-1.5 rounded-lg">
                                                        <Activity size={14} className="text-emerald-600" />
                                                    </div>
                                                    <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">AI Analysis</h5>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tighter leading-none">Trust Score</p>
                                                        <p className="text-xl font-black text-emerald-700 leading-none">98.8/100</p>
                                                    </div>
                                                    <div className="w-px h-8 bg-emerald-100"></div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tighter leading-none">Tier</p>
                                                        <p className="text-xl font-black text-emerald-700 leading-none">TIER_1</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleApprove(internship.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/10 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest relative z-10"
                                            >
                                                Verify & Approve
                                            </Button>
                                            {/* AI Wave flair */}
                                            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-emerald-100/50 to-transparent translate-x-32 group-hover/ai:translate-x-0 transition-transform duration-1000"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <CheckCircle size={32} />
                                </div>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic leading-none">Queue is currently clear.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SIDEBAR: RECENT ACTIVITIES & SYSTEM ALERTS */}
                <div className="xl:col-span-4 space-y-10">
                    <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 space-y-8 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Recruiter Queue</h3>
                            <Link to="/company-approvals" className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600/20 hover:border-blue-600 transition-all">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {pendingRecruiters.slice(0, 4).map((recruiter) => (
                                <div key={recruiter.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-500/20 transition-all group">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-slate-800 truncate leading-none mb-1">{recruiter.company_name || recruiter.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold truncate leading-none tracking-tight">{recruiter.email}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                        <CheckCircle size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1A1C1E] rounded-[2.5rem] p-8 text-white space-y-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                        <div className="relative z-10 space-y-6 text-center">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight leading-tight">Authorize Academic Credits?</h3>
                                <p className="text-slate-400 text-xs font-medium px-4">Student records are awaiting final semester authorization.</p>
                            </div>
                            <Button className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-[10px]">
                                Final Authorization Window
                            </Button>
                        </div>
                        {/* Background Flair */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementOfficeDashboard;
