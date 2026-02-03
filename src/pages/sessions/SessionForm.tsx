import { useState, useEffect } from 'react';
import type { InternshipSession } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Calendar, GraduationCap, Layers } from 'lucide-react';

interface SessionFormProps {
    initialData?: InternshipSession;
    onSubmit: (data: Partial<InternshipSession>) => Promise<void>;
    onCancel: () => void;
}

const SessionForm = ({ initialData, onSubmit, onCancel }: SessionFormProps) => {
    const [formData, setFormData] = useState<Partial<InternshipSession>>({
        academicYear: '',
        program: '',
        batch: '',
        startDate: '',
        endDate: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (new Date(formData.endDate!) <= new Date(formData.startDate!)) {
            setError('End date must be after the start date.');
            return;
        }

        setIsLoading(true);
        // IC/HOD opens Internship Session
        await onSubmit(formData);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Academic Year"
                    placeholder="e.g. 2024-2025"
                    icon={<Calendar size={16} />}
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    required
                />
                <Input
                    label="Program"
                    placeholder="e.g. MCA, BTech IT"
                    icon={<GraduationCap size={16} />}
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    required
                />
            </div>

            <Input
                label="Student Batch"
                placeholder="e.g. 2023-2025"
                icon={<Layers size={16} />}
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                required
            />

            <div className={`bg-slate-50 p-4 rounded-xl border ${error ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recruitment Visibility Window</p>
                    {error && <p className="text-xs font-bold text-red-600">{error}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                    <Input
                        label="Internship Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                    <Input
                        label="Internship End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                    />
                </div>
                <p className="text-xs text-slate-500 italic mt-2">
                    * This session will be visible to corporate recruiters and active for students only between these dates.
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Discard
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-auto px-10">
                    {initialData ? 'Update Session' : 'Create Session'}
                </Button>
            </div>
        </form>
    );
};

export default SessionForm;