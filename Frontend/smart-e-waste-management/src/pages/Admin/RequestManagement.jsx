import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Truck 
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduleData, setScheduleData] = useState({
      pickupDate: null,
      pickupTime: null,
      pickupPersonnel: ''
  });
  const [personnel, setPersonnel] = useState([]); // Fetch for dropdown
  
  const toast = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch personnel when modal opens
  useEffect(() => {
      if (isScheduleModalOpen) {
          fetchPersonnel();
      }
  }, [isScheduleModalOpen]);

  const fetchRequests = async () => {
      setRequestLoading(true);
      try {
          const data = await adminService.getAllRequests();
          setRequests(data);
      } catch (error) {
          toast.error("Failed to fetch requests", 3000, "bottom-center");
      } finally {
          setRequestLoading(false);
      }
  };

  const fetchPersonnel = async () => {
      try {
          const data = await adminService.getAllPersonnel();
          setPersonnel(data);
      } catch (error) {
          // Silent fail or toast
          // toast.error("Failed to fetch personnel", 3000, "bottom-center"); 
      }
  };

  const handleRejectRequest = async (e, requestId) => {
      e.stopPropagation();
      const reason = window.prompt("Enter rejection reason:");
      if (!reason) return;

      try {
          await adminService.rejectRequest(requestId, reason);
          toast.success("Request rejected", 3000, "bottom-center");
          fetchRequests();
      } catch (error) {
          toast.error("Failed to reject request", 3000, "bottom-center");
      }
  };

  const handleOpenSchedule = (e, request) => {
      e.stopPropagation();
      setSelectedRequest(request);
      setIsScheduleModalOpen(true);
  };

  const submitSchedule = async (e) => {
      e.preventDefault();
      try {
           const formattedData = {
              ...scheduleData,
              pickupDate: scheduleData.pickupDate ? scheduleData.pickupDate.getFullYear() + '-' + String(scheduleData.pickupDate.getMonth() + 1).padStart(2, '0') + '-' + String(scheduleData.pickupDate.getDate()).padStart(2, '0') : null,
              pickupTime: scheduleData.pickupTime ? String(scheduleData.pickupTime.getHours()).padStart(2, '0') + ':' + String(scheduleData.pickupTime.getMinutes()).padStart(2, '0') : null
          };

          await adminService.schedulePickup(selectedRequest.id, formattedData);
          toast.success("Pickup scheduled successfully!", 3000, "bottom-center");
          setIsScheduleModalOpen(false);
          setScheduleData({ pickupDate: null, pickupTime: null, pickupPersonnel: '' });
          fetchRequests();
      } catch (error) {
          toast.error("Failed to schedule pickup", 3000, "bottom-center");
      }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
           <div className="p-6 border-b border-gray-100 bg-white">
            <h3 className="text-xl font-bold text-gray-800">Request Management</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {requestLoading ? (
               <div className="h-full flex items-center justify-center text-gray-400 animate-pulse">Loading requests...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                      <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {requests.length > 0 ? (
                          requests.map((req) => (
                              <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                                  <td className="px-6 py-4">
                                      <div className="text-sm font-semibold text-gray-900">{req.user?.fullName || 'Unknown'}</div>
                                      <div className="text-xs text-gray-400">{req.user?.email}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="text-sm text-gray-800">{req.deviceType} - {req.quantity} qty</div>
                                      <div className="text-xs text-gray-500">{req.condition}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                          {req.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                      {new Date(req.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      {req.status === 'PENDING' && (
                                          <div className="flex justify-end gap-2">
                                              <button onClick={(e) => handleRejectRequest(e, req.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                                                  <XCircle className="w-4 h-4" />
                                              </button>
                                              <button onClick={(e) => handleOpenSchedule(e, req)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Schedule Pickup">
                                                  <CheckCircle className="w-4 h-4" />
                                              </button>
                                          </div>
                                      )}
                                      {req.status === 'IN_PROGRESS' && (
                                          <div className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
                                              <Calendar className="w-3 h-3"/> Scheduled
                                          </div>
                                      )}
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No requests found.</td></tr>
                      )}
                  </tbody>
              </table>
            )}
          </div>
      </div>

      {/* SCHEDULE MODAL */}
      {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
                  <div className="bg-slate-900 p-6 text-white relative">
                       <button onClick={() => setIsScheduleModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors">
                           <XCircle className="w-6 h-6 text-white/70 hover:text-white" />
                       </button>
                       <h3 className="text-xl font-bold">Schedule Pickup</h3>
                       <p className="text-slate-400 text-sm">Assign date, time & personnel</p>
                  </div>
                  <form onSubmit={submitSchedule} className="p-6 space-y-4">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
                                  <DatePicker
                                      value={scheduleData.pickupDate}
                                      onChange={(date) => setScheduleData({...scheduleData, pickupDate: date})}
                                      slotProps={{ 
                                          textField: { 
                                              fullWidth: true,
                                              required: true,
                                              size: 'small',
                                              sx: { 
                                                  '& .MuiOutlinedInput-root': {
                                                      borderRadius: '0.5rem',
                                                      '& fieldset': { borderColor: '#e5e7eb' },
                                                      '&:hover fieldset': { borderColor: '#10b981' }, 
                                                      '&.Mui-focused fieldset': { borderColor: '#10b981', borderWidth: '2px' },
                                                  }
                                              }
                                          } 
                                      }}
                                  />
                              </div>
                              <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Time</label>
                                  <TimePicker
                                      value={scheduleData.pickupTime}
                                      onChange={(time) => setScheduleData({...scheduleData, pickupTime: time})}
                                      slotProps={{ 
                                          textField: { 
                                              fullWidth: true,
                                              required: true,
                                              size: 'small',
                                              sx: { 
                                                  '& .MuiOutlinedInput-root': {
                                                      borderRadius: '0.5rem',
                                                      '& fieldset': { borderColor: '#e5e7eb' },
                                                      '&:hover fieldset': { borderColor: '#10b981' }, 
                                                      '&.Mui-focused fieldset': { borderColor: '#10b981', borderWidth: '2px' },
                                                  }
                                              }
                                          } 
                                      }}
                                  />
                              </div>
                              <div className="flex flex-col col-span-2">
                                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Pickup Personnel</label>
                                  <select 
                                      required 
                                      className="p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                                      value={scheduleData.pickupPersonnel} 
                                      onChange={e => setScheduleData({...scheduleData, pickupPersonnel: e.target.value})}
                                  >
                                      <option value="">Select Personnel</option>
                                      {personnel.map(p => (
                                          <option key={p.id} value={p.name}>{p.name} ({p.role})</option>
                                      ))}
                                  </select>
                              </div>
                          </div>
                      </LocalizationProvider>
                      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                          <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                          <button type="submit" className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-500/30">Confirm Schedule</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'VERIFIED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
    case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-100';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default RequestManagement;
