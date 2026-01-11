import React, { useState } from 'react';
import { Upload, MapPin, Truck, AlertCircle, Info, CheckCircle, Calendar, Clock } from 'lucide-react';
import collectionService from '../../services/collectionService';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import UserLayout from '../../components/layout/UserLayout';

const RequestCollection = () => {
  // ... (state and hooks remain same)
  const [formData, setFormData] = useState({
    deviceType: 'Mobile',
    brand: '',
    model: '',
    condition: 'Working',
    quantity: 1,
    address: '',
    remarks: '',
    pickupDate: null,
    pickupTime: null
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB Limit
        toast.error("Please upload a smaller image (max 10MB)", 4000, "bottom-center");
        e.target.value = null; // Reset input
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'pickupDate' && formData[key]) {
             // Format Date to YYYY-MM-DD
            const date = formData[key];
            const formattedDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            data.append(key, formattedDate);
        } else if (key === 'pickupTime' && formData[key]) {
            // Format Time to HH:mm
            const time = formData[key];
             const formattedTime = String(time.getHours()).padStart(2, '0') + ':' + String(time.getMinutes()).padStart(2, '0');
            data.append(key, formattedTime);
        } else {
            data.append(key, formData[key]);
        }
      });
      if (image) {
        data.append('image', image);
      }

      await collectionService.createRequest(data);
      toast.success("Request Submitted Successfully!", 3000, "bottom-center");
      navigate('/my-requests');
    } catch (error) {
      toast.error("Failed to submit request", 3000, "bottom-center");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Schedule Pickup</h1>
          <p className="text-gray-500 mt-2">Enter details about your e-waste for collection.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: DETAILS */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-emerald-500" /> Device Info
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Device Type</label>
                <select 
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  <option>Mobile</option>
                  <option>Laptop</option>
                  <option>Tablet</option>
                  <option>TV / Monitor</option>
                  <option>Refrigerator</option>
                  <option>Washing Machine</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                  <input 
                    type="text" 
                    name="brand" 
                    required
                    placeholder="e.g. Samsung"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Model</label>
                  <input 
                    type="text" 
                    name="model" 
                    required
                    placeholder="e.g. Galaxy S10"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Condition</label>
                  <select 
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option>Working</option>
                    <option>Damaged</option>
                    <option>Dead</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

               <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Remarks (Optional)</label>
                  <textarea 
                    name="remarks" 
                    rows="2"
                    placeholder="Any extra info..."
                    value={formData.remarks}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>

            </div>

            {/* RIGHT COLUMN: LOCATION & IMAGE */}
            <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-500" /> Pickup Details
                  </h3>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pickup Date</label>
                        <DatePicker
                            label="Select Date"
                            value={formData.pickupDate}
                            onChange={(date) => setFormData(prev => ({ ...prev, pickupDate: date }))}
                            className="w-full"
                            slotProps={{ 
                                textField: { 
                                    fullWidth: true,
                                    required: true,
                                    size: 'small',
                                    sx: { 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.5rem',
                                            '& fieldset': { borderColor: '#e5e7eb' },
                                            '&:hover fieldset': { borderColor: '#10b981' }, // emerald-500
                                            '&.Mui-focused fieldset': { borderColor: '#10b981', borderWidth: '2px' },
                                        }
                                    }
                                } 
                            }}
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pickup Time</label>
                        <TimePicker
                            label="Select Time"
                            value={formData.pickupTime}
                            onChange={(time) => setFormData(prev => ({ ...prev, pickupTime: time }))}
                            className="w-full"
                            slotProps={{ 
                                textField: { 
                                    fullWidth: true,
                                    required: true,
                                    size: 'small',
                                    sx: { 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.5rem',
                                            '& fieldset': { borderColor: '#e5e7eb' },
                                            '&:hover fieldset': { borderColor: '#10b981' }, // emerald-500
                                            '&.Mui-focused fieldset': { borderColor: '#10b981', borderWidth: '2px' },
                                        }
                                    }
                                } 
                            }}
                        />
                        </div>
                    </LocalizationProvider>
                  </div>
               </div>

               <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-emerald-500" /> Location & Image
              </h3>

               <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Pickup Address</label>
                  <textarea 
                    name="address" 
                    required
                    rows="3"
                    placeholder="Full pickup address..."
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                      <div className="relative">
                         <img src={imagePreview} alt="Preview" className="h-40 mx-auto object-cover rounded-lg shadow-sm" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <span className="text-white font-medium">Change Image</span>
                         </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <Upload className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                   <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting...' : <><Truck className="w-5 h-5" /> Submit Request</>}
                  </button>
                </div>

            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default RequestCollection;
