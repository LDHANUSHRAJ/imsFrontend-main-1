import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Github } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    jobTitle: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSubmit, jobTitle }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        resume: null as File | null,
        github_link: '',
        linkedin_link: ''
    });

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, resume: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.resume) {
            alert("Please upload your resume.");
            return;
        }
        setIsLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Apply for Internship</h2>
                        <p className="text-sm text-gray-500 mt-1">Position: <span className="font-semibold text-[#0F2137]">{jobTitle}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Upload Resume (PDF)*</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors bg-gray-50 text-center group">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-blue-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-600">
                                    {formData.resume ? (
                                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                                            {formData.resume.name}
                                        </span>
                                    ) : (
                                        <>Click to upload or drag and drop<br /><span className="text-xs text-gray-400">PDF, DOC up to 5MB</span></>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                <Github size={16} /> GitHub Profile
                            </label>
                            <input
                                type="url"
                                placeholder="https://github.com/username"
                                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F2137] text-sm"
                                value={formData.github_link}
                                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                <LinkIcon size={16} /> LinkedIn Profile
                            </label>
                            <input
                                type="url"
                                placeholder="https://linkedin.com/in/username"
                                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F2137] text-sm"
                                value={formData.linkedin_link}
                                onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={isLoading} className="w-full bg-[#0F2540] hover:bg-[#1a2f4d]">
                            Submit Application
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
