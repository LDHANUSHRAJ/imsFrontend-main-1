import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useNotifications } from '../../context/NotificationContext';
import DepartmentSelector from '../../components/ui/DepartmentSelector';
import { InternshipService } from '../../services/internship.service';

const JobForm = ({ onSubmit, onCancel }: { onSubmit?: any, onCancel?: any }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        departments: [] as string[],
        department_id: "0", // Fallback ID
        location_type: 'REMOTE',
        is_paid: true,
        stipend: '',
        duration: '',
    });

    // Detect Edit Mode from URL
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const isEdit = pathParts.includes('edit');
        const idIndex = pathParts.indexOf('jobs') + 1;

        if (isEdit && pathParts[idIndex]) {
            const jobId = pathParts[idIndex];
            loadJobDetails(jobId);
        }
    }, [location.pathname]);

    const loadJobDetails = async (id: string) => {
        setIsLoading(true);
        try {
            const job = await InternshipService.getById(id);
            if (job) {
                const deptName = (job as any).department?.name || '';
                setFormData({
                    title: job.title,
                    description: job.description,
                    departments: (job as any).target_departments || (deptName ? [deptName] : []),
                    department_id: job.department?.id || "0",
                    location_type: (job as any).location_type || 'REMOTE',
                    is_paid: job.is_paid,
                    stipend: job.stipend?.toString() || '',
                    duration: job.duration,
                });
            }
        } catch (error) {
            console.error("Failed to load job", error);
            addNotification({ title: 'Error', message: 'Failed to load job details.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        if (formData.departments.length === 0) {
            addNotification({ title: 'Validation Error', message: 'Please select at least one target department.', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const jobData: any = {
                title: formData.title,
                description: formData.description,
                target_departments: formData.departments,
                department_id: formData.department_id,
                location_type: formData.location_type,
                is_paid: String(formData.is_paid) === 'true',
                stipend: formData.stipend,
                duration: formData.duration
            };

            const pathParts = location.pathname.split('/');
            const isEdit = pathParts.includes('edit');

            if (onSubmit) {
                await onSubmit(jobData);
            } else if (isEdit) {
                const idIndex = pathParts.indexOf('jobs') + 1;
                const jobId = pathParts[idIndex];
                await InternshipService.update(jobId, jobData);
                addNotification({ title: 'Update Successful', message: 'Job posting updated successfully.', type: 'success', category: 'JOB' });
                navigate('/jobs');
            } else {
                await InternshipService.create(jobData);
                addNotification({ title: 'Posting Submitted', message: 'Internship opportunity published successfully.', type: 'success', category: 'JOB' });
                navigate('/jobs');
            }
        } catch (error: any) {
            console.error("Submit error", error);
            addNotification({ title: 'Submission Failed', message: error.response?.data?.detail?.[0]?.msg || 'Please check your inputs.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300 max-w-4xl mx-auto my-8">
            <h1 className="text-xl font-bold text-[#0F2137] mb-6">
                {location.pathname.includes('edit') ? 'Edit Internship' : 'Post New Internship'}
            </h1>

            <section className="space-y-4">
                <Input label="Title*" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />

                {/* Department Selection */}
                <div>
                    <DepartmentSelector
                        selected={formData.departments}
                        onChange={(selected) => handleChange('departments', selected)}
                        label="Target Departments / Programs*"
                        placeholder="Select target audience..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Select all programs eligible for this internship.</p>
                </div>

                {/* Location Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Type*</label>
                    <select
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.location_type}
                        onChange={(e) => handleChange('location_type', e.target.value)}
                    >
                        <option value="REMOTE">Remote</option>
                        <option value="ONSITE">On Site</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>

                {/* Is Paid */}
                <div className="flex items-center gap-4 py-2">
                    <label className="text-sm font-medium text-gray-700">Is Paid?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="is_paid"
                                checked={formData.is_paid === true}
                                onChange={() => handleChange('is_paid', true)}
                            /> Yes
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="is_paid"
                                checked={formData.is_paid === false}
                                onChange={() => handleChange('is_paid', false)}
                            /> No
                        </label>
                    </div>
                </div>

                {formData.is_paid && (
                    <Input label="Stipend Amount*" value={formData.stipend} onChange={(e) => handleChange('stipend', e.target.value)} required />
                )}

                <Input label="Duration*" placeholder="e.g. 6 Months" value={formData.duration} onChange={(e) => handleChange('duration', e.target.value)} required />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <textarea
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px]"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        required
                    />
                </div>
            </section>

            <div className="flex justify-end pt-8 gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" isLoading={isLoading} className="bg-[#4285F4] hover:bg-[#3367d6]">
                    {location.pathname.includes('edit') ? 'Update Posting' : 'Publish Internship'}
                </Button>
            </div>
        </form>
    );
};

export default JobForm;