import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, Building2, User, Send } from 'lucide-react';

interface RecruiterFormProps {
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

const RecruiterForm = ({ onSubmit, onCancel }: RecruiterFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        industry: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Requirement: IC creating an account for corporate user
        await onSubmit(formData);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                <Send className="text-[#3B82F6] shrink-0 mt-0.5" size={18} />
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    This action will register the corporate partner in the Christ IMS. An invitation with login credentials will be dispatched to the provided email.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Company Name"
                    placeholder="e.g. Microsoft India"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    icon={<Building2 size={16} />}
                />
                <Input
                    label="Industry / Domain"
                    placeholder="e.g. IT, FinTech"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                />
            </div>

            <Input
                label="Primary HR / Recruiter Name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                icon={<User size={16} />}
            />

            <Input
                label="Official Corporate Email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                icon={<Mail size={16} />}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Discard
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-auto px-8">
                    Create Recruiter Account
                </Button>
            </div>
        </form>
    );
};

export default RecruiterForm;