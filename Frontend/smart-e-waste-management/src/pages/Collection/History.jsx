import React, { useEffect, useState } from 'react';
import collectionService from '../../services/collectionService';
import { History, Calendar, MapPin, Clock, ArrowRight, Filter, Search } from 'lucide-react';
import UserLayout from '../../components/layout/UserLayout';

const HistoryPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, COMPLETED, CANCELLED, REJECTED
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await collectionService.getMyRequests();
            // Filter initially for historical statuses only
            const historyData = data.filter(req => 
                ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(req.status)
            );
            setRequests(historyData);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusBadge = (status) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
            {status}
        </span>
    );

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
        const matchesSearch = 
            req.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(req.id).includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    return (
        <UserLayout>
            <div className="max-w-6xl mx-auto px-4 md:px-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <History className="w-8 h-8 text-emerald-600" />
                            Request History
                        </h1>
                        <p className="text-gray-500 mt-1">View your past collection requests and their outcomes.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between">
                         <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by device, brand, or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select 
                                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="ALL">All History</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading history...</div>
                    ) : filteredRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Device Details</th>
                                        <th className="px-6 py-3">Date Requested</th>
                                        <th className="px-6 py-3">Pickup Date</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                        <img 
                                                            src={`http://localhost:8080/uploads/${req.imagePath}`} 
                                                            alt={req.deviceType}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null; 
                                                                e.target.src = "https://via.placeholder.com/100?text=IMG";
                                                            }} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{req.deviceType}</div>
                                                        <div className="text-xs text-gray-500">{req.brand} {req.model}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.pickupDate ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900">{req.pickupDate}</span>
                                                        <span className="text-xs text-gray-500">{req.pickupTime}</span>
                                                    </div>
                                                ) : <span className="text-gray-400 italic">--</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(req.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline inline-flex items-center gap-1"
                                                >
                                                    View <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                <History className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No History Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-1">
                                You don't have any completed or past requests yet. Active requests appear in "My Requests".
                            </p>
                        </div>
                    )}
                </div>

                {/* DETAILS MODAL - Reusing structure from MyRequests for consistency */}
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedRequest(null)}>
                        <div 
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div className="relative h-48 bg-gray-100">
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
                                <div className="absolute bottom-4 right-4">
                                    {getStatusBadge(selectedRequest.status)}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.deviceType}</h2>
                                    <p className="text-gray-500">{selectedRequest.brand} • {selectedRequest.model}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Condition</p>
                                        <p className="font-semibold text-gray-700">{selectedRequest.condition}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Quantity</p>
                                        <p className="font-semibold text-gray-700">{selectedRequest.quantity}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>{selectedRequest.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>Picked up on: {selectedRequest.pickupDate ? `${selectedRequest.pickupDate} at ${selectedRequest.pickupTime}` : 'N/A'}</span>
                                    </div>
                                    {selectedRequest.remarks && (
                                        <div className="bg-gray-50 p-3 rounded-lg text-gray-500 italic border border-gray-100">
                                            "{selectedRequest.remarks}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </UserLayout>
    );
};

export default HistoryPage;
