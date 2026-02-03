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

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Internship Timeline</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Discard
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-auto px-10">
                    {initialData ? 'Update Session' : 'Launch Session'}
                </Button>
            </div>
        </form>
    );
};

export default SessionForm;