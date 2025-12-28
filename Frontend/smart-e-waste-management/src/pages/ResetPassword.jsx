import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    
    // We expect state from the login redirect: { username, tempPassword }
    // Ideally, tempPassword might not be passed if we want them to re-enter it,
    // but the user requirement implies "immediately new set password window".
    // Let's allow them to enter it or pre-fill if passed.
    const [formData, setFormData] = useState({
        username: location.state?.username || '',
        tempPassword: location.state?.tempPassword || '', // Optional if we want them to re-enter
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // If no username passed, they shouldn't be here (or came directly). 
        // Redirect to login or let them type it if they know what they're doing.
        if (!location.state?.username) {
             // You can uncomment this to force login flow first
             // navigate('/login');
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Submitting Password Reset:", formData); // ✅ DEBUG LOG

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match", 3000, "bottom-center");
            return;
        }

        // Strong Password Validation
        // At least 8 chars, 1 number, 1 special char
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        
        if (!passwordRegex.test(formData.newPassword)) {
            toast.error("Password must be 8+ chars, with at least 1 number and 1 special char (!@#$%^&*)", 3000, "bottom-center");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(
                formData.username, 
                formData.tempPassword, 
                formData.newPassword
            );
            toast.success("Password updated! Please login with your new password.", 3000, "bottom-center");
            navigate('/login');
        } catch (error) {
            console.error("Reset Password Error:", error); // ✅ DEBUG LOG
            // Handle specific backend error messages
            const msg = error.response?.data?.message || "Failed to reset password";
            toast.error(typeof msg === 'string' ? msg : "Failed to reset password", 3000, "bottom-center");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                    <p className="text-gray-500 mt-2">
                        You are required to change your temporary password before continuing.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Read-only Username for context */}
                    <Input
                        id="username"
                        label="Email / Username"
                        value={formData.username}
                        disabled={!!location.state?.username} // ✅ Enable if no state passed
                        onChange={handleChange} // ✅ Allow editing if enabled
                        className="bg-gray-50"
                        required
                    />

                    <Input
                        id="tempPassword"
                        label="Temporary Password"
                        type="password"
                        placeholder="Enter the password you received"
                        value={formData.tempPassword}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="newPassword"
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        disabled={loading}
                        className="w-full py-3 rounded-xl shadow-lg shadow-green-200"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                        {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
