import React, { useEffect, useState } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    MapPin, 
    Calendar, 
    Package,
    Clock, 
    X
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const PersonnelDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toast = useToast();

    const API_URL = 'http://localhost:8080/api/collection';

    useEffect(() => {
        fetchAssignedRequests();
    }, []);

    const fetchAssignedRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/assigned`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load assigned tasks", 3000, "bottom-center");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/${id}/status?status=${status}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Request marked as ${status}`, 3000, "bottom-center");
            setIsModalOpen(false); // Close modal if open
            fetchAssignedRequests();
        } catch (error) {
            toast.error("Failed to update status", 3000, "bottom-center");
        }
    };

    const handleViewDetails = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    const pendingRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS');
    const historyRequests = requests.filter(r => r.status === 'COMPLETED' || r.status === 'REJECTED');

    if (loading) return <div className="flex justify-center items-center h-full text-gray-500">Loading tasks...</div>;

    return (
        <div className="space-y-8">
            
            {/* PENDING TASKS SECTION */}
            <div>
                 <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" /> 
                    Assigned Pickups <span className="text-sm font-normal text-gray-500 ml-2">({pendingRequests.length} pending)</span>
                 </h2>
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map(req => (
                            <TaskCard 
                                key={req.id} 
                                req={req} 
                                onClick={() => handleViewDetails(req)}
                                onAction={handleStatusUpdate} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
                            No pending pickups assigned. Good job!
                        </div>
                    )}
                 </div>
            </div>

            {/* COMPACT HISTORY SECTION */}
            <div>
                 <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 mt-8">
                    <Clock className="w-5 h-5 text-gray-400" /> 
                    Completed History <span className="text-sm font-normal text-gray-500 ml-2">({historyRequests.length} total)</span>
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historyRequests.map(req => (
                        <CompactHistoryCard key={req.id} req={req} onClick={() => handleViewDetails(req)} />
                    ))}
                 </div>
            </div>

            {/* DETAILS MODAL */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="relative h-48 bg-gray-100">
                            {selectedRequest.imagePath ? (
                                <img src={`http://localhost:8080/uploads/${selectedRequest.imagePath}`} alt="Device" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="text-2xl font-bold">{selectedRequest.brand} {selectedRequest.model}</h3>
                                <p className="text-sm opacity-90">{selectedRequest.deviceType}</p>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Quantity</p>
                                    <p className="font-semibold text-gray-800">{selectedRequest.quantity} Unit(s)</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Condition</p>
                                    <p className="font-semibold text-gray-800">{selectedRequest.condition}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Pickup Address</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Scheduled Time</p>
                                        <p className="text-sm text-gray-600">{selectedRequest.pickupDate} at {selectedRequest.pickupTime}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.remarks && (
                                <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-sm">
                                    <span className="font-bold">Remarks:</span> {selectedRequest.remarks}
                                </div>
                            )}

                            {/* Actions (Only if Pending) */}
                            {(selectedRequest.status === 'PENDING' || selectedRequest.status === 'IN_PROGRESS') && (
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'REJECTED')}
                                        className="py-3 px-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" /> Reject
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'COMPLETED')}
                                        className="py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Mark Collected
                                    </button>
                                </div>
                            )}

                             {/* Status Badge (If History) */}
                             {(selectedRequest.status === 'COMPLETED' || selectedRequest.status === 'REJECTED') && (
                                <div className="pt-4 border-t border-gray-100 text-center">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${selectedRequest.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        Request is {selectedRequest.status}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Task Card
const TaskCard = ({ req, onClick, onAction }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" onClick={onClick}>
            <div className="relative h-40 overflow-hidden">
                {req.imagePath ? (
                    <img src={`http://localhost:8080/uploads/${req.imagePath}`} alt="Device" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-medium">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm uppercase tracking-wider text-gray-800">
                    {req.deviceType}
                </div>
            </div>
            
            <div className="p-5">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{req.brand} {req.model}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{req.address}</span>
                    </div>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                         onClick={() => onAction(req.id, 'COMPLETED')}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
                    >
                        Collect
                    </button>
                    <button 
                        onClick={() => onAction(req.id, 'REJECTED')}
                        className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Compact History Card (Small Detail)
const CompactHistoryCard = ({ req, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all flex items-center cursor-pointer"
        >
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                 {req.imagePath ? (
                    <img src={`http://localhost:8080/uploads/${req.imagePath}`} alt="Device" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-[10px] text-gray-400">N/A</div>
                )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 truncate">{req.brand} {req.model}</h4>
                <p className="text-xs text-gray-500 truncate">{req.deviceType} • {new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="ml-2">
                {req.status === 'COMPLETED' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                )}
            </div>
        </div>
    );
};

export default PersonnelDashboard;
