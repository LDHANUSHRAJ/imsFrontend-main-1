import { useEffect, useState } from 'react';
import { ClosureService, type ClosureRecord } from '../../services/mock/ClosureService';
import { 
    FileCheck, Briefcase, User, UserCheck, 
    Star, Download, ClipboardCheck, Award 
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useNotifications } from '../../context/NotificationContext';

const ClosureEvaluation = () => {
    const { addNotification } = useNotifications();
    const [closures, setClosures] = useState<ClosureRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEvalModal, setShowEvalModal] = useState(false);
    const [selectedClosure, setSelectedClosure] = useState<ClosureRecord | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        loadClosures();
    }, []);

    const loadClosures = async () => {
        try {
            const data = await ClosureService.getAll();
            setClosures(data);
        } catch (error) {
            console.error('Error loading closures:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEvaluation = async () => {
        if (selectedClosure && rating > 0 && remarks.trim()) {
            await ClosureService.submitEvaluation(selectedClosure.id, rating, remarks);
            
            addNotification({
                title: 'Evaluation Submitted',
                message: `Final rating for ${selectedClosure.studentName} synced to ERP.`,
                type: 'success',
                category: 'SYSTEM'
            });

            setShowEvalModal(false);
            setRating(0);
            setRemarks('');
            setSelectedClosure(null);
            loadClosures();
        }
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2137]"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0F2137]">Closure & Final Evaluation</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">
                    Part F: Guide review of closure reports, certificates, and attendance
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {closures.map((closure) => (
                    <div key={closure.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        {/* Header Section */}
                        <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 p-2.5 rounded-xl">
                                    <ClipboardCheck className="text-emerald-600" size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0F2137] text-sm leading-tight">{closure.studentName}</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                                        {closure.studentRegNo}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={closure.status === 'CLOSED' ? 'success' : 'warning'}>
                                {closure.status.replace('_', ' ')}
                            </Badge>
                        </div>

                        {/* Details Section */}
                        <div className="p-5 space-y-4 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Internship</label>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                        <Briefcase size={14} className="text-[#3B82F6]" />
                                        <span className="truncate">{closure.internshipTitle}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Company</label>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                        <User size={14} className="text-[#3B82F6]" />
                                        <span className="truncate">{closure.companyName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Part F: Document Review UI */}
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Review Artifacts</p>
                                <div className="space-y-2">
                                    {closure.documents.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs bg-white border border-slate-100 p-2 rounded-lg">
                                            <span className="font-medium text-slate-600 truncate mr-2">{doc}</span>
                                            <Download size={14} className="text-[#3B82F6] cursor-pointer hover:scale-110 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {closure.evaluation && (
                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < closure.evaluation!.rating ? "#EAB308" : "none"} 
                                                      className={i < closure.evaluation!.rating ? "text-[#EAB308]" : "text-slate-300"} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-700">FINAL EVALUATION</span>
                                    </div>
                                    <p className="text-xs text-slate-600 italic leading-relaxed">"{closure.evaluation.remarks}"</p>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        {closure.status === 'PENDING_REVIEW' && (
                            <div className="p-4 bg-slate-50 border-t border-slate-100">
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="w-full font-bold"
                                    onClick={() => {
                                        setSelectedClosure(closure);
                                        setShowEvalModal(true);
                                    }}
                                >
                                    Grade Internship
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Part F: Final Rating & Remarks Modal */}
            <Modal
                isOpen={showEvalModal}
                onClose={() => setShowEvalModal(false)}
                title={`Final Evaluation: ${selectedClosure?.studentName}`}
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4">
                        <Award className="text-[#EAB308]" size={32} />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Assessment Criteria</p>
                            <p className="text-xs font-medium text-slate-600">Assign a final rating based on closure reports and performance metrics.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#0F2137] uppercase tracking-wider mb-3">Final Rating</label>
                        <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRating(r)}
                                    className={`flex-1 aspect-square rounded-xl border-2 font-bold text-lg transition-all active:scale-95 ${
                                        rating === r 
                                        ? 'bg-[#0F2137] border-[#0F2137] text-white shadow-lg shadow-blue-900/20' 
                                        : 'border-slate-100 text-slate-400 hover:border-[#EAB308]'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#0F2137] uppercase tracking-wider mb-2">Evaluation Remarks</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3B82F6]/20 min-h-[120px]"
                            placeholder="Provide feedback on reports, certificates, and overall attendance..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowEvalModal(false)}>Discard</Button>
                        <Button variant="primary" className="flex-1" onClick={handleSubmitEvaluation} disabled={rating === 0 || !remarks.trim()}>
                            Submit Grade
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ClosureEvaluation;