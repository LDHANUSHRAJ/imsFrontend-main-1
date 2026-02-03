import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { MapPin, IndianRupee, Briefcase, FileText } from 'lucide-react';
import { JobService } from '../../services/mock/JobService';
import { useNotifications } from '../../context/NotificationContext';

const JobForm = ({ onSubmit, onCancel }: { onSubmit?: any, onCancel?: any }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addNotification } = useNotifications();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        stipend: '',
        description: '',
        requirements: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const jobData = {
                ...formData,
                status: 'PENDING', // Requirement: Always starts as Pending for IC review
                postedAt: new Date().toLocaleDateString(),
            };

            if (onSubmit) {
                await onSubmit(jobData);
            } else {
                await JobService.create(jobData);
                addNotification({
                    title: 'Posting Submitted',
                    message: 'Your internship has been sent to the Placement Office for review.',
                    type: 'success',
                });
                navigate('/jobs');
            }
        } catch (error) {
            addNotification({ title: 'Submission Failed', message: 'Please check your connection.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Internship Role Title"
                    placeholder="e.g. Full Stack Developer Intern"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <Input
                    label="Work Location"
                    placeholder="e.g. Bengaluru (On-site)"
                    icon={<MapPin size={16} />}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Monthly Stipend (INR)"
                    type="number"
                    placeholder="e.g. 25000"
                    icon={<IndianRupee size={16} />}
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0F2137] uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} className="text-[#3B82F6]" /> Role Description
                </label>
                <textarea
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3B82F6]/20 min-h-[120px] outline-none transition-all"
                    placeholder="Describe the day-to-day responsibilities and learning outcomes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onCancel || (() => navigate('/jobs'))}>
                    Discard
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-auto px-10">
                    Submit for Approval
                </Button>
            </div>
        </form>
    );
};

export default JobForm;