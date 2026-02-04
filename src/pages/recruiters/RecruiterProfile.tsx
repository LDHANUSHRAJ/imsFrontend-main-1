import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/auth.service';
import { Building2, User, Mail, Shield, Edit2, Save, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useNotifications } from '../../context/NotificationContext';

const RecruiterProfile = () => {
    const { user, updateUser } = useAuth(); // In a real app, we'd also need a setUser or updateProfile method from context
    const { addNotification } = useNotifications();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company_name: user?.company_name || '',
        hr_name: user?.hr_name || ''
    });

    if (!user) return <div className="p-8">Loading...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            // Simulate Backend Update
            await AuthService.updateProfile(formData);

            // Update global state immediately
            if (updateUser) {
                updateUser(formData);
            }

            addNotification({
                title: 'Profile Updated',
                message: 'Your profile changes have been saved.',
                type: 'success',
                category: 'PROFILE'
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Profile update failed:", error);
            addNotification({
                title: 'Update Failed',
                message: 'Could not update profile. Please try again.',
                type: 'error',
                category: 'PROFILE'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137] mb-2">My Profile</h1>
                    <p className="text-slate-500 text-sm">Manage your account information and preferences.</p>
                </div>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit2 size={16} /> Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2 text-slate-500">
                            <X size={16} /> Cancel
                        </Button>
                        <Button onClick={handleSave} className="gap-2 bg-[#3B82F6]">
                            <Save size={16} /> Save Changes
                        </Button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0F2137] h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
                            <div className="h-full w-full bg-slate-100 rounded-full flex items-center justify-center text-[#0F2137] font-bold text-3xl">
                                {user.name?.charAt(0) || 'C'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-[#0F2137] border-b pb-2">Profile Information</h2>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Full Name</p>
                                    {isEditing ? (
                                        <Input name="name" value={formData.name} onChange={handleChange} />
                                    ) : (
                                        <p className="font-medium text-[#0F2137]">{user.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email Address</p>
                                    <p className="font-medium text-[#0F2137]">{user.email}</p>
                                    {/* Usually email is not editable */}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-[#0F2137] border-b pb-2">Company Details</h2>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Building2 size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Company Name</p>
                                    {isEditing ? (
                                        <Input name="company_name" value={formData.company_name} onChange={handleChange} />
                                    ) : (
                                        <p className="font-medium text-[#0F2137]">{user.company_name || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Shield size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">HR Representative</p>
                                    {isEditing ? (
                                        <Input name="hr_name" value={formData.hr_name} onChange={handleChange} />
                                    ) : (
                                        <p className="font-medium text-[#0F2137]">{user.hr_name || user.name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterProfile;
