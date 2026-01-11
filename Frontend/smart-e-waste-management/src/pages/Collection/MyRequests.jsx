import React, { useEffect, useState } from 'react';
import collectionService from '../../services/collectionService';
import { Package, Calendar, MapPin, Clock } from 'lucide-react';

import UserLayout from '../../components/layout/UserLayout';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await collectionService.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (status) => ( // Helper for consistent badges
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
        {status}
      </span>
  );

  return (
    <UserLayout>
      <div className="max-w-8xl mx-auto px-4 md:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Requests</h1>
            <p className="text-gray-500 mt-1">Track and manage your e-waste pickups.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm text-gray-600">
             Total Requests: <span className="font-bold text-emerald-600">{requests.length}</span>
          </div>
        </div>

        {loading ? (
           <div className="text-center py-20 text-gray-400">Loading your requests...</div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                 <div className="p-2">
                    <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                        <img 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                            src={`http://localhost:8080/uploads/${req.imagePath}`} 
                            alt={req.deviceType} 
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                    </div>
                 </div>
                 
                 <div className="px-5 pb-5 pt-2">
                  <div className="flex justify-between items-start mb-2">
                       <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                              <h3 className="font-bold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors line-clamp-1 mr-2">{req.deviceType}</h3>
                              <div className="shrink-0">{getStatusBadge(req.status)}</div>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">{req.brand} {req.model}</p>
                       </div>
                    </div>

                    <div className="space-y-2 mt-4">
                       <div className="flex items-start gap-3 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{req.address}</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                           <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
             <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <h3 className="text-xl font-medium text-gray-600">No Requests Yet</h3>
             <p className="text-gray-400 mb-6">Start by scheduling your first pickup.</p>
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedRequest(null)}>
                <div 
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                >
                    {/* Modal Image Header */}
                    <div className="relative h-64 bg-gray-100">
                        <img 
                            className="w-full h-full object-contain" 
                            src={`http://localhost:8080/uploads/${selectedRequest.imagePath}`} 
                            alt={selectedRequest.deviceType}
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                            }}
                        />
                        <button 
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full backdrop-blur-md transition-all shadow-sm"
                        >
                            <span className="font-bold text-gray-600">✕</span>
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-8">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedRequest.deviceType}</h2>
                                <p className="text-gray-500 text-lg">{selectedRequest.brand} • {selectedRequest.model}</p>
                            </div>
                            <div className="mt-1 shrink-0">
                                {getStatusBadge(selectedRequest.status)}
                            </div>
                        </div>
                        

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Condition</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.condition || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Quantity</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.quantity}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pickup Date</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.pickupDate || 'Not Scheduled'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pickup Time</p>
                                <p className="font-semibold text-gray-700">{selectedRequest.pickupTime || 'Not Scheduled'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-5 h-5 text-emerald-500" /> Pickup Location
                                </h4>
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedRequest.address}
                                </p>
                            </div>
                            
                            {selectedRequest.remarks && (
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                                        <Package className="w-5 h-5 text-emerald-500" /> Remarks
                                    </h4>
                                    <p className="text-gray-600 italic">
                                        "{selectedRequest.remarks}"
                                    </p>
                                </div>
                            )}

                             <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
                                <span>Request ID: {selectedRequest.id}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(selectedRequest.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </UserLayout>
  );
};

export default MyRequests;
