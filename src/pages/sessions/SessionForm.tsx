import { useState, useEffect } from 'react';
import type { InternshipSession } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { PROGRAMS } from '../../data/programs';
import { Calendar, Layers } from 'lucide-react';

interface SessionFormProps {
    initialData?: InternshipSession;
    onSubmit: (data: Partial<InternshipSession>) => Promise<void>;
    onCancel: () => void;
}

const SessionForm = ({ initialData, onSubmit, onCancel }: SessionFormProps) => {
    const [formData, setFormData] = useState<Partial<InternshipSession>>({
        academicYear: '',
        program: '',
        subProgram: '',
        batch: '',
        startDate: '',
        endDate: '',
        mode: 'ONSITE',
        duration: '',
        stipend: '',
        isActive: true
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

        if (new Date(formData.endDate!) <= new Date(formData.startDate!)) {
            setError('End date must be after the start date.');
            return;
        }

        setIsLoading(true);
        await onSubmit(formData);
        setIsLoading(false);
    };

    const selectedProgram = PROGRAMS.find(p => p.name === formData.program);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Academic Year*"
                    placeholder="e.g. 2024-2025"
                    icon={<Calendar size={16} />}
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    required
                />
                <Select
                    label="Program Category*"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value, subProgram: '' })}
                    required
                    placeholder="Select Category"
                >
                    {PROGRAMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                    label="Sub Program"
                    value={formData.subProgram}
                    onChange={(e) => setFormData({ ...formData, subProgram: e.target.value })}
                    disabled={!formData.program}
                    placeholder="Select Sub-Program (Optional)"
                >
                    {selectedProgram?.subprograms.map(sp => (
                        <option key={sp} value={sp}>{sp}</option>
                    ))}
                </Select>
                <Input
                    label="Student Batch*"
                    placeholder="e.g. 2023-2025"
                    icon={<Layers size={16} />}
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Duration*"
                    placeholder="e.g. 6 Months"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                />
                <Input
                    label="Stipend (₹)"
                    placeholder="e.g. 15000"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                    label="Internship Mode*"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    required
                >
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                </Select>
                <Select
                    label="Status*"
                    value={formData.isActive ? 'active' : 'archived'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    required
                >
                    <option value="active">Live</option>
                    <option value="archived">Archived</option>
                </Select>
            </div>

            <div className={`bg-slate-50 p-4 rounded-xl border ${error ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recruitment Visibility Window</p>
                    {error && <p className="text-xs font-bold text-red-600">{error}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                    <Input
                        label="Internship Start Date*"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                    <Input
                        label="Internship End Date*"
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
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-auto px-10">
                    {initialData ? 'Update Session' : 'Create Session'}
                </Button>
            </div>
        </form>
    );
};

export default SessionForm;