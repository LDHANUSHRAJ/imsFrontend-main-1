import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, ChevronRight, GraduationCap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
            {/* Header */}
            <header className="bg-[#0F2540] text-white py-6 px-8 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Building2 size={32} className="text-[#D4AF37]" />
                        <div>
                            <h1 className="text-2xl font-bold font-serif tracking-wide">Christ University</h1>
                            <p className="text-xs text-gray-300 uppercase tracking-widest">Internship Management System</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#0F2137] mb-4">Select Your Portal</h2>
                        <p className="text-xl text-gray-600">Please choose your role to proceed to the login dashboard.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Staff Portal Card */}
                        <Link
                            to="/login/staff"
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#0F2137]/20 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <GraduationCap size={150} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#0F2137] group-hover:scale-110 transition-transform">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F2137] mb-3">Staff & Faculty Portal</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    Login for Internship Coordinators (IC), Head of Departments (HOD), and Faculty Guides. Manage students and approvals.
                                </p>
                                <div className="flex items-center text-[#0F2137] font-bold group-hover:translate-x-2 transition-transform">
                                    Continue to Staff Login <ChevronRight className="ml-2" size={20} />
                                </div>
                            </div>
                        </Link>

                        {/* Recruiter Portal Card */}
                        <Link
                            to="/login/recruiter"
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Building2 size={150} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                                    <Building2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F2137] mb-3">Corporate Recruiter Portal</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    Login for Corporate Partners and HR Managers. Post internships, review applications, and hire students.
                                </p>
                                <div className="flex items-center text-[#D4AF37] font-bold group-hover:translate-x-2 transition-transform">
                                    Continue to Recruiter Login <ChevronRight className="ml-2" size={20} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Christ University. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
