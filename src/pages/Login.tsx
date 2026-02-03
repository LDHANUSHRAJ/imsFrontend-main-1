import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        website: '',
        industry: '',
        companySize: '',
        location: '',
        recruiterName: '',
        phone: '',
        password: '',
        confirmPassword: ''
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            setIsLoading(false);
            return;
        }

        // Simulate registration & Store for Mock Login
        const newUser = {
            ...formData,
            role: 'RECRUITER'
        };

        // Save to local storage mock DB
        const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
        existingUsers.push(newUser);
        localStorage.setItem("mock_users", JSON.stringify(existingUsers));

        setTimeout(() => {
            setIsLoading(false);
            // Auto login or redirect
            navigate('/login/staff'); // Redirect to main login where they can select Recruiter
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center py-12 px-6">
            <div className="max-w-[1100px] w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[#0F2137] mb-3">
                        Create a Company Account
                    </h1>
                    <p className="text-lg text-gray-600">
                        Fill out the form below to register your company.
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Row 1: Company Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="e.g. Christ University"
                                required
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Official Company Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g. rahul@company.com"
                                required
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 2: Website & Industry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Company Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Industry / Domain
                            </label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="e.g. Education, IT"
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 3: Company Size & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Company Size
                            </label>
                            <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 text-base appearance-none cursor-pointer
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '1.5rem'
                                }}
                            >
                                <option value="">Select Size</option>
                                <option value="1-50">1-50</option>
                                <option value="50-200">50-200</option>
                                <option value="200+">200+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Company Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Bangalore"
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 4: Recruiter Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                HR / Recruiter Name
                            </label>
                            <input
                                type="text"
                                name="recruiterName"
                                value={formData.recruiterName}
                                onChange={handleChange}
                                placeholder="Your Full Name"
                                required
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91..."
                                required
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 5: Password & Confirm Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-[#0F2137] mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full h-[56px] px-5 bg-[#F5F7FA] border-none rounded-xl 
                                         text-gray-700 placeholder-gray-400 text-base
                                         focus:outline-none focus:ring-2 focus:ring-[#0F2137]
                                         transition-all"
                            />
                        </div>
                    </div>

                    {/* Register Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[56px] bg-[#0F2137] text-white text-lg font-bold rounded-xl
                                     hover:bg-[#1a2f4d] active:scale-[0.98] disabled:opacity-50
                                     transition-all duration-200"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>

                    {/* Already Have Account Link */}
                    <div className="text-center text-base text-gray-600 pt-2">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login-page')}
                            className="text-[#0F2137] font-bold hover:underline"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;