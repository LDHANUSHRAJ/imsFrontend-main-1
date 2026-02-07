import { Link } from 'react-router-dom';
import { Users, Building2, GraduationCap, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-10 w-full max-w-4xl animate-fade-in-up">

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="h-56 w-56 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <img
                                src="/christ-logo.png"
                                alt="Christ University Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#0F2137] tracking-tight mb-3 leading-tight">
                        Internship Management
                    </h1>

                    {/* Subtitle */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                        <p className="text-lg font-semibold text-[#D4AF37] uppercase tracking-widest">
                            Christ University
                        </p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                    </div>

                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Streamline your internship journey with our comprehensive management platform
                    </p>
                </div>

                {/* Login Cards Section */}
                <div className="w-full max-w-5xl animate-fade-in-up animation-delay-200">

                    <h2 className="text-2xl font-bold text-center text-[#0F2137] mb-8">
                        Select Your Portal
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Student Card */}
                        <Link
                            to="/login/student"
                            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-600 overflow-hidden hover-lift"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="mb-6 flex justify-center">
                                    <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <GraduationCap className="text-white" size={40} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F2137] mb-3 text-center">
                                    Student Portal
                                </h3>
                                <p className="text-slate-600 text-center mb-6 leading-relaxed">
                                    Track applications, manage your internship progress, and discover AI-matched premium opportunities
                                </p>
                                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                                    <span>Login</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Faculty/Admin Card */}
                        <Link
                            to="/login/staff"
                            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#0F2137] overflow-hidden hover-lift"
                        >
                            {/* Background gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0F2137]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6 flex justify-center">
                                    <div className="h-20 w-20 bg-gradient-to-br from-[#0F2137] to-[#1a3a5f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Users className="text-white" size={40} />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-[#0F2137] mb-3 text-center">
                                    Faculty & Admin
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 text-center mb-6 leading-relaxed">
                                    Access coordinator, HOD, and faculty dashboards to manage sessions, approvals, and student guidance
                                </p>

                                {/* Button */}
                                <div className="flex items-center justify-center gap-2 text-[#0F2137] font-semibold group-hover:gap-4 transition-all">
                                    <span>Login</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Recruiter Card */}
                        <Link
                            to="/login/recruiter"
                            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37] overflow-hidden hover-lift"
                        >
                            {/* Background gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6 flex justify-center">
                                    <div className="h-20 w-20 bg-gradient-to-br from-[#D4AF37] to-[#c9a030] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="text-white" size={40} />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-[#0F2137] mb-3 text-center">
                                    Corporate Recruiter
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 text-center mb-6 leading-relaxed">
                                    Post internship opportunities and connect with talented students from Christ University
                                </p>

                                {/* Button */}
                                <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-semibold group-hover:gap-4 transition-all">
                                    <span>Login</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg p-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
                            Platform Capabilities
                        </h3>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-100 text-blue-600 rounded-xl mb-3">
                                    <Users size={24} />
                                </div>
                                <h4 className="font-bold text-[#0F2137] mb-2">Session Management</h4>
                                <p className="text-sm text-slate-600">Create and manage internship sessions with filters and actions</p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-12 w-12 bg-amber-100 text-amber-600 rounded-xl mb-3">
                                    <Building2 size={24} />
                                </div>
                                <h4 className="font-bold text-[#0F2137] mb-2">Job Postings</h4>
                                <p className="text-sm text-slate-600">Status tracking, approvals, and application management</p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl mb-3">
                                    <GraduationCap size={24} />
                                </div>
                                <h4 className="font-bold text-[#0F2137] mb-2">Guide & Evaluation</h4>
                                <p className="text-sm text-slate-600">Monitor progress, logs, and closure evaluations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center border-t border-white/50 bg-white/30 backdrop-blur-sm">
                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} CHRIST (Deemed to be University) • All Rights Reserved
                </p>
            </footer>

        </div>
    );
};

export default LandingPage;
