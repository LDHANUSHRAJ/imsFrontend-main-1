
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Mail, Phone, Building, Save, UserCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const PlacementProfile = () => {
    const { user, updateUser } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);

    // Initial state from auth user
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: user?.department || 'Placement Cell'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Simulate API call
            await AuthService.updateProfile(formData);

            // 2. Update Local Context immediately
            updateUser({
                name: formData.name,
                phone: formData.phone,
                department: formData.department
            });

            addNotification({
                title: 'Success',
                message: 'Profile updated successfully',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            addNotification({
                title: 'Error',
                message: 'Failed to update profile',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-[#0F2137] mb-8 flex items-center gap-2">
                <UserCircle className="h-8 w-8 text-[#D4AF37]" />
                My Profile
            </h1>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-[#0F2137] text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
                        {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#0F2137]">{formData.name}</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Placement Coordinator
                        </span>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={<User className="h-5 w-5" />}
                                placeholder="Enter your full name"
                                required
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={<Mail className="h-5 w-5" />}
                                disabled
                                className="opacity-70 bg-slate-50 cursor-not-allowed"
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={<Phone className="h-5 w-5" />}
                                placeholder="+91 98765 43210"
                            />

                            <Input
                                label="Department / Office"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                icon={<Building className="h-5 w-5" />}
                                placeholder="e.g. Central Placement Cell"
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="bg-[#0F2137] hover:bg-[#1a3a5f]"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlacementProfile;
