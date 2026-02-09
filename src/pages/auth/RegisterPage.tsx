import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';
import { useNotifications } from '../../context/NotificationContext';
import { Building2, User, Mail, Globe, Linkedin, Lock, School } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        companyType: 'CORPORATE',
        industry: '',
        hrName: '',
        hrEmail: '',
        email: '', // Using same for login
        password: '',
        confirmPassword: '',
        registeredAddress: '',
        websiteUrl: '',
        linkedinUrl: ''
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
            // Strictly following API Payload: name, email, password, company_name, hr_name
            const apiPayload = {
                name: formData.hrName, // User name is HR name
                email: formData.hrEmail, // Login email
                password: formData.password,
                company_name: formData.companyName,
                hr_name: formData.hrName
                // Additional fields might need strict checking if API rejects unknown fields.
                // Assuming standard AuthService handles this, or we clean it here.
            };

            await AuthService.registerCorporate(apiPayload);

            addNotification({
                title: 'Registration Successful',
                message: "Your account has been created. Please wait for approval from the Placement Office.",
                type: 'success'
            });

            navigate('/login');

        } catch (error: any) {
            console.error("Registration failed", error);
            const msg = error.response?.data?.detail || 'Registration failed. Please check your inputs.';
            addNotification({ title: 'Registration Failed', message: msg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-christGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="bg-christBlue px-8 py-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <School className="text-christGold" size={32} />
                        <div>
                            <h2 className="text-xl font-bold font-serif">CHRIST (Deemed to be University)</h2>
                            <p className="text-blue-200 text-sm">Corporate Registration Portal</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10">
                    <div className="mb-8 border-b border-slate-100 pb-4">
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="text-christBlue" />
                            Partner Registration
                        </h1>
                        <p className="text-slate-500 mt-1">Join our network of top-tier recruiters.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">

                        {/* Company Info */}
                        <div>
                            <h3 className="text-sm font-bold text-christBlue uppercase tracking-wider mb-4 border-l-2 border-christGold pl-2">Company Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                                    <input name="companyName" required value={formData.companyName} onChange={handleChange} className="input" placeholder="Legal Entity Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry / Sector *</label>
                                    <input name="industry" required value={formData.industry} onChange={handleChange} className="input" placeholder="e.g. Fintech, Healthcare" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address</label>
                                    <input name="registeredAddress" value={formData.registeredAddress} onChange={handleChange} className="input" placeholder="Full HQ Address" />
                                </div>
                            </div>
                        </div>

                        {/* HR Contact */}
                        <div>
                            <h3 className="text-sm font-bold text-christBlue uppercase tracking-wider mb-4 border-l-2 border-christGold pl-2">HR Representative</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">HR Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input name="hrName" required value={formData.hrName} onChange={handleChange} className="input pl-10" placeholder="Contact Person Name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Official Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input type="email" name="hrEmail" required value={formData.hrEmail} onChange={handleChange} className="input pl-10" placeholder="hr@company.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="input pl-10" placeholder="https://..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="input pl-10" placeholder="https://linkedin.com/..." />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div>
                            <h3 className="text-sm font-bold text-christBlue uppercase tracking-wider mb-4 border-l-2 border-christGold pl-2">Account Security</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input pl-10" placeholder="Min 8 characters" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="input pl-10" placeholder="Confirm Password" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-3 text-lg font-bold shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : 'Submit Registration'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account? <Link to="/login" className="text-christBlue font-bold hover:underline">Sign In here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
