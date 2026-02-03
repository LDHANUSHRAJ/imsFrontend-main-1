import React from 'react';
import { Briefcase, Users, MessageSquare, PlusCircle, Search } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

const RecruiterDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Corporate Recruiter Portal</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Post opportunities and manage CHRIST University talent applications.</p>
                </div>
                <Button variant="secondary" className="w-auto gap-2 bg-[#3B82F6]">
                    <PlusCircle size={18} /> NEW POSTING
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Active Postings" value="02" icon={Briefcase} color="navy" />
                <StatCard label="New Applications" value="48" icon={Users} color="purple" trend="+12 today" trendUp />
                <StatCard label="Unread Queries" value="01" icon={MessageSquare} color="amber" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Search className="text-slate-300 h-12 w-12" />
                </div>
                <h3 className="text-lg font-bold text-[#0F2137] mb-2">No active recruitment drives</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
                    Your previous drive for "Full Stack Intern" is currently closed. Post a new vacancy to start receiving student dossiers.
                </p>
                <Button variant="primary" className="w-auto px-8">CREATE JOB POSTING</Button>
            </div>
        </div>
    );
};

export default RecruiterDashboard;