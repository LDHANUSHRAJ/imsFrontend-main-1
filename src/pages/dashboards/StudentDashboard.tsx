
import React, { useState, useEffect } from 'react';
import { InternshipService } from '../../services/internship.service';
import { DepartmentService } from '../../services/department.service';
import { Internship, Department } from '../../types';
import { Briefcase, MapPin, DollarSign, Building, Search, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useNotifications } from '../../context/NotificationContext';
// Assuming you have a Modal and ApplicationForm or similar
import Modal from '../../components/ui/Modal';
import ApplicationModal from '../../components/jobs/ApplicationModal';

const StudentDashboard = () => {
    const { addNotification } = useNotifications();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const [selectedLocation, setSelectedLocation] = useState<string>('All');
    const [paidOnly, setPaidOnly] = useState(false);

    // Application Modal
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [internshipsData, departmentsData] = await Promise.all([
                InternshipService.getApprovedInternships(),
                DepartmentService.getAll()
            ]);
            setInternships(Array.isArray(internshipsData) ? internshipsData : []);
            setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyClick = (internship: Internship) => {
        setSelectedInternship(internship);
        setIsApplyModalOpen(true);
    };

    const submitApplication = async (data: any) => {
        if (!selectedInternship) return;
        try {
            await InternshipService.apply(selectedInternship.id, data);
            addNotification({
                title: 'Success',
                message: 'Application submitted successfully!',
                type: 'success'
            });
            setIsApplyModalOpen(false);
            fetchData(); // Refresh to update "has_applied" status if backend reflects it
        } catch (error: any) {
            console.error("Apply failed", error);
            addNotification({
                title: 'Error',
                message: error.response?.data?.detail?.[0]?.msg || 'Failed to submit application',
                type: 'error'
            });
        }
    };

    const filteredInternships = internships.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.department.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDept === 'All' || item.department.id === selectedDept;
        const matchesLocation = selectedLocation === 'All' || item.location_type === selectedLocation;
        const matchesPaid = !paidOnly || item.is_paid;

        return matchesSearch && matchesDept && matchesLocation && matchesPaid;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Student Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Explore and apply for latest internship opportunities.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by role, company, or skills..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                        <option value="All">All Locations</option>
                        <option value="REMOTE">Remote</option>
                        <option value="ONSITE">Onsite</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>

                    <button
                        onClick={() => setPaidOnly(!paidOnly)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${paidOnly ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        <DollarSign size={16} /> Paid Only
                    </button>
                </div>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="text-center py-20 text-slate-400">Loading internships...</div>
            ) : filteredInternships.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-slate-600 font-bold">No internships found</h3>
                    <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInternships.map(internship => (
                        <div key={internship.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Building size={24} />
                                </div>
                                <Badge variant={internship.location_type === 'REMOTE' ? 'success' : 'default'}>
                                    {internship.location_type}
                                </Badge>
                            </div>

                            <h3 className="font-bold text-lg text-[#0F2137] mb-1 line-clamp-1">{internship.title}</h3>
                            <p className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-1">
                                <Building size={14} /> {internship.department.name}
                            </p>

                            <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">{internship.description}</p>

                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6">
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <DollarSign size={12} /> {internship.is_paid ? internship.stipend : 'Unpaid'}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Briefcase size={12} /> {internship.duration}
                                </span>
                            </div>

                            <Button
                                className="w-full mt-auto"
                                onClick={() => handleApplyClick(internship)}
                                disabled={Boolean(internship.has_applied)}
                                variant={internship.has_applied ? 'secondary' : 'primary'}
                            >
                                {internship.has_applied ? 'Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <ApplicationModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                onSubmit={submitApplication}
                jobTitle={selectedInternship?.title || ''}
            />
        </div>
    );
};

export default StudentDashboard;
