import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { RecruiterService } from '../services/mock/RecruiterService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Building2, User, Mail, Globe, MapPin, Linkedin, Hash } from 'lucide-react';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const { login, updateUser } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Mandatory
        companyName: '',
        country: '',
        industry: '',
        hrName: '',
        hrEmail: '',
        password: '',
        confirmPassword: '',
        companyType: 'CORPORATE', // Default
        // Optional
        registeredAddress: '',
        registeredId: '',
        linkedinUrl: '',
        websiteUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            addNotification({ title: 'Password Mismatch', message: 'Passwords do not match!', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            // 1. Separate Strict API Payload (Backend only accepts these)
            const apiPayload = {
                name: formData.hrName,
                email: formData.hrEmail,
                password: formData.password,
                company_name: formData.companyName,
                hr_name: formData.hrName
            };

            // 2. Register via Auth Service (validates logic/backend)
            await AuthService.registerCorporate(apiPayload);

            // 2b. Sync with Mock Recruiter Service (so Admin sees it immediately)
            await RecruiterService.create({
                companyName: formData.companyName,
                name: formData.hrName,
                email: formData.hrEmail,
                industry: formData.industry,
                address: formData.registeredAddress || 'Not Provided',
            });

            /* 
            // 3. Auto Login REMOVED to enforce Approval Flow
            const authData = await login(formData.hrEmail, formData.password, 'RECRUITER');
            */

            // Just navigate to login page with message
            addNotification({
                title: 'Registration Successful',
                message: "Your account is created and pending approval. You will be notified once the Placement Office approves it.",
                type: 'success', // Using success, but could be 'info'
                category: 'SYSTEM'
            });

            navigate('/login/recruiter');

        } catch (error: any) {
            console.error("Registration failed", error);
            let msg = "Registration failed. Please check your inputs.";

            if (error.response?.data?.detail) {
                if (typeof error.response.data.detail === 'string') {
                    msg = error.response.data.detail;
                } else if (Array.isArray(error.response.data.detail)) {
                    msg = error.response.data.detail[0]?.msg || msg;
                }
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }

            addNotification({
                title: 'Registration Failed',
                message: msg,
                type: 'error',
                category: 'SYSTEM'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center py-12 px-6">
            <div className="max-w-[900px] w-full bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="mb-8 text-center border-b border-gray-100 pb-6">
                    <h1 className="text-3xl font-bold text-[#0F2137] mb-2 flex items-center justify-center gap-3">
                        <Building2 className="text-blue-600" />
                        Company Registration
                    </h1>
                    <p className="text-gray-500">Partner with Christ University for Campus Recruitment</p>
                </div>

                <form onSubmit={handleRegister} className="max-w-3xl mx-auto space-y-6">

                    {/* Section 1: Company Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Company Legal Name*</label>
                                <input name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Official Legal Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Company Type*</label>
                                <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none">
                                    <option value="STARTUP">Startup</option>
                                    <option value="CORPORATE">Corporate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Industry*</label>
                                <input name="industry" value={formData.industry} onChange={handleChange} required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="e.g. Technology, Fintech" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Country of Registration*</label>
                                <input name="country" value={formData.country} onChange={handleChange} required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="e.g. India, USA" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">HR Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">HR Name*</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input name="hrName" value={formData.hrName} onChange={handleChange} required className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Full Name" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">HR Email ID*</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input type="email" name="hrEmail" value={formData.hrEmail} onChange={handleChange} required className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="hr@company.com" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Optional Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-gray-300 pl-3">Additional Details (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input name="registeredAddress" value={formData.registeredAddress} onChange={handleChange} className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Full Office Address" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="https://company.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="https://linkedin.com/company/..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registered ID / CIN</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input name="registeredId" value={formData.registeredId} onChange={handleChange} className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Registration Number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Security</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password*</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password*</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#0F2137] text-white text-lg font-bold rounded-xl hover:bg-[#1a2f4d] shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing Registration...' : 'Register Company'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-500 pt-2">
                        Already registered?{' '}
                        <button type="button" onClick={() => navigate('/login/recruiter')} className="text-[#0F2137] font-bold hover:underline">
                            Login Restricted to Corporate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
