import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { createJob } from '../../services/job.service';
import { useNotifications } from '../../context/NotificationContext';

import { useAuth } from '../../context/AuthContext';

const JobForm = ({ onSubmit, onCancel }: { onSubmit?: any, onCancel?: any }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Company Info (Pre-filled from Recruiter Profile)
        companyName: user?.role === 'RECRUITER' ? (user.name || 'Your Company') : '',
        sector: '',
        address: '',
        website: '',
        contactInfo: '',
        email: user?.email || '',
        hrContact: user?.role === 'RECRUITER' ? (user.name || '') : '',

        // Internship Info
        title: '',
        applicationDate: new Date().toISOString().split('T')[0],
        joiningDate: '',
        completionDate: '',
        remuneration: '',
        creditsEligible: 'No',
        credits: '',
        totalWorkingDays: '',
        minAttendance: '',
        description: '',
        academicProgram: 'Yes'
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const jobData = {
                ...formData,
                status: 'PENDING',
                postedAt: new Date().toLocaleDateString(),
            };

            if (onSubmit) {
                await onSubmit(jobData);
            } else {
                await createJob(jobData);
                addNotification({
                    title: 'Posting Submitted',
                    message: 'Internship opportunity published successfully.',
                    type: 'success',
                });
                navigate('/jobs');
            }
        } catch (error) {
            console.error("Submit error", error);
            addNotification({ title: 'Submission Failed', message: 'Please check your connection.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
            <h1 className="text-xl font-bold text-[#0F2137] mb-6">Publish Internship</h1>

            {/* Company Information Section */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-[#0F2137] mb-4">Company information</h3>
                <div className="space-y-4">
                    <Input label="Name*" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} required />
                    <Input label="Sector*" value={formData.sector} onChange={(e) => handleChange('sector', e.target.value)} required />
                    <Input label="Address*" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} required />
                    <Input label="Website*" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} required />
                    <Input label="Contact information*" value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} required />
                    <Input label="E-mail*" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                    <Input label="HR Contact*" value={formData.hrContact} onChange={(e) => handleChange('hrContact', e.target.value)} required />
                </div>
            </section>

            <hr className="my-8 border-slate-200" />

            {/* Internship Information Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#0F2137] mb-4">Internship information</h3>

                <Input label="Title*" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />

                <Input label="Application Date*" type="date" value={formData.applicationDate} onChange={(e) => handleChange('applicationDate', e.target.value)} required />
                <Input label="Date of Joining*" type="date" value={formData.joiningDate} onChange={(e) => handleChange('joiningDate', e.target.value)} required />
                <Input label="Date of Completion*" type="date" value={formData.completionDate} onChange={(e) => handleChange('completionDate', e.target.value)} required />
                <Input label="Remuneration for Internship*" value={formData.remuneration} onChange={(e) => handleChange('remuneration', e.target.value)} required />

                {/* Credits Row */}
                <div className="flex items-center gap-8 py-2">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Eligible for Credits</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className={`font-bold ${formData.creditsEligible === 'Yes' ? 'text-blue-600' : 'text-slate-500'}`}>Yes</span>
                                /
                                <span className={`font-bold ${formData.creditsEligible === 'No' ? 'text-blue-600' : 'text-slate-500'}`}>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-slate-700">Credits:</label>
                        <input
                            className="border-b-2 border-slate-300 w-16 focus:outline-none focus:border-blue-500 text-center font-bold"
                            value={formData.credits}
                            onChange={(e) => handleChange('credits', e.target.value)}
                        />
                    </div>
                </div>

                <Input label="Total working days" value={formData.totalWorkingDays} onChange={(e) => handleChange('totalWorkingDays', e.target.value)} />
                <Input label="Minimum attendance requirement" value={formData.minAttendance} onChange={(e) => handleChange('minAttendance', e.target.value)} />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Internship Description</label>
                    <textarea
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px]"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 py-2">
                    <label className="text-sm font-bold text-slate-700 w-48">Part of Academic program</label>
                    <div className="flex gap-2">
                        <span className="font-bold">Yes/No</span>
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-8">
                <Button type="submit" isLoading={isLoading} className="w-auto px-10 bg-[#4285F4] hover:bg-[#3367d6]">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default JobForm;