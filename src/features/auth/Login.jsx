import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo/christ-logo.png"; // Removed in favor of public folder
import { roleRedirect } from "../../utils/roleRedirect";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth.service";

export default function Login() {
    const [type, setType] = useState(null);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const data = await loginUser({
                email: formData.email,
                password: formData.password,
                role: type
            });

            login(data);

            // Determine role from response or fallback to selected type
            const role = data.user?.role || data.role || type;
            navigate(roleRedirect(role));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-christGray">
            <div className="grid md:grid-cols-2 bg-white rounded-xl shadow-lg w-full max-w-5xl">
                <div className="hidden md:flex flex-col items-center justify-center bg-christBlue text-white p-10">
                    <img src="/christ-logo.png" className="w-28 mb-6" alt="Logo" />
                    <h1 className="text-xl font-semibold">Internship Management System</h1>
                    <p className="text-sm opacity-90">CHRIST University</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-semibold">Login</h2>

                    {!type && (
                        <div className="mt-6 space-y-4">
                            <button onClick={() => setType("FACULTY")} className="border p-4 rounded w-full text-left hover:bg-gray-50">
                                Faculty / Admin Login
                            </button>
                            <button onClick={() => setType("RECRUITER")} className="border p-4 rounded w-full text-left hover:bg-gray-50">
                                Corporate Recruiter Login
                            </button>
                        </div>
                    )}

                    {type && (
                        <div className="mt-6 space-y-4">
                            {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border p-2 w-full rounded focus:ring-2 focus:ring-christBlue outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border p-2 w-full rounded focus:ring-2 focus:ring-christBlue outline-none"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="bg-christBlue text-white w-full py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <button onClick={() => { setType(null); setError(""); setFormData({ email: "", password: "" }); }} className="text-sm text-gray-500 w-full hover:underline">
                                ← Change Role
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
