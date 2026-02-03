import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApplicationService } from '../../services/mock/ApplicationService';
import { JobService } from '../../services/mock/JobService';
import type { StudentApplication, JobPosting } from '../../types';
import { User, Calendar, Briefcase, Building2 } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const ApplicationList = () => {
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [appData, jobData] = await Promise.all([
                ApplicationService.getAll(),
                JobService.getAll()
            ]);
            setApplications(appData);
            setJobs(jobData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getJobDetails = (jobId: string) => {
        return jobs.find(j => j.id === jobId);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge variant="success">Approved</Badge>;
            case 'REJECTED':
                return <Badge variant="error">Rejected</Badge>;
            default:
                return <Badge variant="warning">Pending</Badge>;
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-christ-navy">Student Applications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((application) => {
                    const job = getJobDetails(application.jobId);
                    return (
                        <Link
                            key={application.id}
                            to={`/applications/${application.id}`}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <User className="text-christ-blue" size={24} />
                                </div>
                                {getStatusBadge(application.status)}
                            </div>

                            <h3 className="font-bold text-lg text-gray-800 mb-1">{application.studentName}</h3>
                            <p className="text-gray-500 text-sm mb-4">USN: {application.studentRegNo}</p>

                            <div className="space-y-2 text-sm text-gray-600">
                                {job && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} />
                                            <span>{job.companyName || job.companyId}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={16} />
                                            <span>{job.title}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center gap-2 text-christ-blue font-medium mt-3 pt-3 border-t border-gray-100">
                                    <Calendar size={16} />
                                    <span>Applied: {application.appliedAt}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationList;
