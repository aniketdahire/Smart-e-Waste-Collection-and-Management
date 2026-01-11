import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Upload, User, Edit2, Save } from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });
  const [files, setFiles] = useState({
    idProof: null,
    addressProof: null
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || ''
      });
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error(error.response?.data?.message || "Failed to load profile. Please log in again.", 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.id]: e.target.files[0] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    const jsonPart = new Blob([JSON.stringify(profile)], { type: 'application/json' }); 
    formData.append('data', jsonPart);

    if (files.idProof) formData.append('idProof', files.idProof);
    if (files.addressProof) formData.append('addressProof', files.addressProof);

    try {
      await userService.updateProfile(formData);
      toast.success("Profile updated successfully!", 3000, "bottom-center");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile", 3000, "bottom-center");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500">Manage your personal information and documents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - FORM */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                           <User className="text-emerald-500 w-5 h-5" />
                           Personal Details
                        </h2>
                        {!isEditing && (
                            <button 
                              onClick={() => setIsEditing(true)} 
                              className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1"
                            > 
                              <Edit2 className="w-3 h-3" /> Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                id="fullName" 
                                label="Full Name" 
                                value={profile.fullName} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                            />
                            <Input 
                                id="email" 
                                label="Email" 
                                value={profile.email} 
                                readOnly= {true}                                 
                            />
                            <Input 
                                id="phone" 
                                label="Phone Number" 
                                value={profile.phone} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                            />
                            <Input 
                                id="city" 
                                label="City" 
                                placeholder="Enter your city"
                                value={profile.city} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                            />
                        </div>
                        
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                             <textarea 
                                id="address"
                                className={`w-full px-4 py-3 rounded-xl border ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-green-500'} focus:outline-none transition-all resize-none h-32`}
                                value={profile.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter your full pickup address..."
                             />
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    onClick={() => {
                                        setIsEditing(false);
                                        fetchProfile(); 
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* RIGHT COLUMN - DOCUMENTS */}
            <div className="space-y-6">
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Upload className="text-emerald-500 w-5 h-5" />
                        Documents
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Upload proof of identity and address to get certified for higher-tier recycling requests.
                    </p>

                    <div className="space-y-4">
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isEditing ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-gray-50'}`}>
                             <p className="text-sm font-medium text-gray-700 mb-2">ID Proof</p>
                             {isEditing ? (
                                <input id="idProof" type="file" onChange={handleFileChange} className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                             ) : (
                                <p className="text-xs text-gray-400 italic">No file uploaded</p>
                             )}
                        </div>
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isEditing ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-gray-50'}`}>
                             <p className="text-sm font-medium text-gray-700 mb-2">Address Proof</p>
                             {isEditing ? (
                                <input id="addressProof" type="file" onChange={handleFileChange} className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                             ) : (
                                <p className="text-xs text-gray-400 italic">No file uploaded</p>
                             )}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </>
  );
};

export default UserProfile;
