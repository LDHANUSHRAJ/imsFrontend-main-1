import { useState, useEffect } from 'react';
import { InternshipService } from '../../services/internship.service';
import { Search, Calendar } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const ApprovedInternships = () => {
    const [internships, setInternships] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const data = await InternshipService.getApprovedInternships();
                setInternships(data || []);
            } catch (error) {
                console.error("Failed to fetch approved internships", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInternships();
    }, []);

    const filtered = internships.filter(i =>
        i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0F2137] tracking-tight">Approved Internships</h1>
                    <p className="text-slate-500 font-bold mt-2">Monitor all active internships across the batch.</p>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by role or company..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-slate-400 animate-pulse">Loading internships...</div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role / Company</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Timeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">No active internships found.</td>
                                    </tr>
                                ) : (
                                    filtered.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                        {item.company_name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#0F2137]">{item.title || item.position}</p> {/* Handle both title and position */}
                                                        <p className="text-xs text-slate-500 font-medium">{item.company_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline">{item.location_type || 'Unknown'}</Badge> {/* Use location_type from API */}
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="success">Active</Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-slate-400" />
                                                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Active'}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Start Date</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovedInternships;
