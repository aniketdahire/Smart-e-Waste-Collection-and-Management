import React, { useEffect, useState } from 'react';
import { 
    Phone, 
    Trash2, 
    PlusCircle,
    XCircle,
    Mail,
    MapPin,
    User
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const PersonnelManagement = () => {
    const [personnel, setPersonnel] = useState([]);
    const [personnelLoading, setPersonnelLoading] = useState(false);
    const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);
    const [newPersonnel, setNewPersonnel] = useState({ 
        name: '', 
        role: '', 
        phone: '', 
        email: '', 
        address: '', 
        pincode: '' 
    });
    const toast = useToast();

    useEffect(() => {
        fetchPersonnel();
    }, []);

    const fetchPersonnel = async () => {
        setPersonnelLoading(true);
        try {
            const data = await adminService.getAllPersonnel();
            setPersonnel(data);
        } catch (error) {
            toast.error("Failed to fetch personnel", 3000, "bottom-center");
        } finally {
            setPersonnelLoading(false);
        }
    };

    const handleAddPersonnelSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminService.addPersonnel(newPersonnel);
            toast.success("Personnel added successfully", 3000, "bottom-center");
            setIsAddPersonnelModalOpen(false);
            setNewPersonnel({ name: '', role: '', phone: '', email: '', address: '', pincode: '' });
            fetchPersonnel();
        } catch (error) {
            toast.error("Failed to add personnel", 3000, "bottom-center");
        }
    };

    const handleDeletePersonnel = async (id) => {
        if (!window.confirm("Are you sure you want to delete this personnel?")) return;
        try {
            await adminService.deletePersonnel(id);
            toast.success("Personnel deleted", 3000, "bottom-center");
            fetchPersonnel();
        } catch (error) {
            toast.error("Failed to delete personnel", 3000, "bottom-center");
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Personnel Management</h3>
                    <button 
                        onClick={() => setIsAddPersonnelModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 font-medium text-sm"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Personnel
                    </button>
                </div>
                <div className="overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personnelLoading ? (
                        <div className="col-span-full flex justify-center py-10 text-gray-400">Loading personnel...</div>
                    ) : personnel.length > 0 ? (
                        personnel.map(p => (
                            <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group relative">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                            {p.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{p.name}</h4>
                                            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">{p.role || 'Staff'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeletePersonnel(p.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-4 space-y-1">
                                     <div className="flex items-center text-xs text-gray-500 gap-2">
                                        <Phone className="w-3 h-3" /> {p.phone || 'No phone'}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 gap-2">
                                        <Mail className="w-3 h-3" /> {p.email || 'No email'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">No personnel found. Add one to get started.</div>
                    )}
                </div>
            </div>

            {/* ADD PERSONNEL MODAL */}
            {isAddPersonnelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <div className="bg-emerald-600 p-6 text-white">
                             <h3 className="text-lg font-bold">Add New Personnel</h3>
                             <p className="text-emerald-100 text-xs">Register new staff member</p>
                        </div>
                        <form onSubmit={handleAddPersonnelSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500" 
                                        value={newPersonnel.name} onChange={e => setNewPersonnel({...newPersonnel, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                                    <input required type="text" placeholder="e.g. Driver" className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500" 
                                        value={newPersonnel.role} onChange={e => setNewPersonnel({...newPersonnel, role: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500" 
                                        value={newPersonnel.phone} onChange={e => setNewPersonnel({...newPersonnel, phone: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                                    <input required type="email" className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500" 
                                        value={newPersonnel.email} onChange={e => setNewPersonnel({...newPersonnel, email: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                                <textarea required rows="2" className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                                    value={newPersonnel.address} onChange={e => setNewPersonnel({...newPersonnel, address: e.target.value})} />
                            </div>

                             <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Pincode</label>
                                <input required type="text" maxLength="6" className="w-full p-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500" 
                                    value={newPersonnel.pincode} onChange={e => setNewPersonnel({...newPersonnel, pincode: e.target.value})} />
                                <p className="text-[10px] text-gray-400 mt-1">Password will be generated from Name + Pincode</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsAddPersonnelModalOpen(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-3 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md">Add Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PersonnelManagement;
