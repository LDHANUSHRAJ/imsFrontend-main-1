import { useState } from 'react';
import { Star, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { GuideFeedback } from '../../types';

interface FeedbackFormProps {
    onSubmit: (feedback: GuideFeedback) => void;
    initialData?: GuideFeedback;
    isReadOnly?: boolean;
}

const RatingInput = ({ label, value, onChange, readonly }: { label: string, value: number, onChange: (val: number) => void, readonly?: boolean }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => onChange(star)}
                        className={`p-1 transition-colors ${readonly ? 'cursor-default' : 'hover:scale-110'}`}
                    >
                        <Star
                            size={20}
                            className={`${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm text-gray-500 font-medium">
                    {value > 0 ? `${value}/5` : 'Not rated'}
                </span>
            </div>
        </div>
    );
};

export default function FeedbackForm({ onSubmit, initialData, isReadOnly = false }: FeedbackFormProps) {
    const [formData, setFormData] = useState<GuideFeedback>(initialData || {
        attendanceRating: 0,
        technicalSkillsRating: 0,
        communicationRating: 0,
        punctualityRating: 0,
        performanceRating: 0,
        comments: '',
        submittedDate: new Date().toISOString()
    });

    const handleChange = (field: keyof GuideFeedback, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-[#0F2137] mb-6 flex items-center gap-2">
                <Star className="text-yellow-500" /> Performance Evaluation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <RatingInput
                    label="Attendance & Regularity"
                    value={formData.attendanceRating}
                    onChange={(val) => handleChange('attendanceRating', val)}
                    readonly={isReadOnly}
                />
                <RatingInput
                    label="Technical Skills & Knowledge"
                    value={formData.technicalSkillsRating}
                    onChange={(val) => handleChange('technicalSkillsRating', val)}
                    readonly={isReadOnly}
                />
                <RatingInput
                    label="Communication Skills"
                    value={formData.communicationRating}
                    onChange={(val) => handleChange('communicationRating', val)}
                    readonly={isReadOnly}
                />
                <RatingInput
                    label="Punctuality"
                    value={formData.punctualityRating}
                    onChange={(val) => handleChange('punctualityRating', val)}
                    readonly={isReadOnly}
                />
                <RatingInput
                    label="Overall Performance"
                    value={formData.performanceRating}
                    onChange={(val) => handleChange('performanceRating', val)}
                    readonly={isReadOnly}
                />
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Comments & Feedback</label>
                <textarea
                    value={formData.comments}
                    onChange={(e) => handleChange('comments', e.target.value)}
                    disabled={isReadOnly}
                    rows={4}
                    placeholder="Provide specific feedback on the student's strengths and areas for improvement..."
                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
            </div>

            {!isReadOnly && (
                <div className="mt-8 flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                        <Save size={16} /> Submit Evaluation
                    </Button>
                </div>
            )}
        </form>
    );
}
