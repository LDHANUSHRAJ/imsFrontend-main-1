import { useState } from "react";
import type { WeeklyLog } from "../../types";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { CheckCircle, XCircle, FileText, Download } from "lucide-react";

interface Props {
    logs: WeeklyLog[];
    onUpdateStatus?: (logId: string, status: 'APPROVED' | 'REJECTED', comment: string) => void;
    onUpdateContent?: (logId: string, data: Partial<WeeklyLog>) => void;
    onDeleteLog?: (logId: string) => void;
}

export default function StudentLogsList({ logs, onUpdateStatus, onUpdateContent, onDeleteLog }: Props) {
    const [actionLogId, setActionLogId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | 'DELETE' | null>(null);
    const [comment, setComment] = useState("");

    // Editing State
    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ guideComments: "" });

    const handleActionSearch = (id: string, type: 'APPROVED' | 'REJECTED' | 'DELETE') => {
        setActionLogId(id);
        setActionType(type);
        setComment("");
    };

    const confirmAction = () => {
        if (!actionLogId || !actionType) return;

        if (actionType === 'DELETE' && onDeleteLog) {
            onDeleteLog(actionLogId);
        } else if (onUpdateStatus && (actionType === 'APPROVED' || actionType === 'REJECTED')) {
            onUpdateStatus(actionLogId, actionType, comment);
        }

        setActionLogId(null);
        setActionType(null);
    };

    const startEditing = (log: WeeklyLog) => {
        setEditingLogId(log.id);
        setEditForm({
            guideComments: log.guideComments || ""
        });
    };

    const saveEdit = () => {
        if (editingLogId && onUpdateContent) {
            onUpdateContent(editingLogId, editForm);
            setEditingLogId(null);
        }
    };

    if (logs.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <FileText className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-slate-500 text-sm">No weekly logs submitted yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <div
                    key={log.id}
                    className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${log.status === 'PENDING' ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'}`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-[#0F2137]">Week {log.weekNumber}</h4>
                                <span className="text-xs text-slate-500">({log.startDate} - {log.endDate})</span>
                            </div>
                            <Badge
                                variant={
                                    log.status === 'APPROVED' ? 'success' :
                                        log.status === 'REJECTED' ? 'error' :
                                            log.status === 'SUBMITTED' ? 'info' : 'warning'
                                }
                            >
                                {log.status}
                            </Badge>
                        </div>
                        <span className="text-xs text-slate-400">Submitted: {log.submissionDate}</span>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Work Summary</h5>
                            <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                {log.workSummary}
                            </p>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Learning Outcomes</h5>
                            <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                {log.learningOutcomes}
                            </p>
                        </div>
                    </div>

                    {log.attachments && log.attachments.length > 0 && (
                        <div className="mb-4 flex gap-2">
                            {log.attachments.map((_att, idx) => (
                                <a key={idx} href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded">
                                    <Download size={12} /> Attachment {idx + 1}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Guide Comments / Feedback Editor */}
                    <div className="mb-4">
                        {editingLogId === log.id ? (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in duration-300">
                                <label className="text-xs font-bold text-blue-800 uppercase mb-2 block tracking-tight">Update Faculty Remarks</label>
                                <textarea
                                    className="w-full text-sm p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 shadow-inner"
                                    value={editForm.guideComments}
                                    onChange={(e) => setEditForm({ guideComments: e.target.value })}
                                    placeholder="Enter your feedback here..."
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <Button variant="ghost" size="sm" onClick={() => setEditingLogId(null)}>Cancel</Button>
                                    <Button variant="primary" size="sm" onClick={saveEdit}>Save Remarks</Button>
                                </div>
                            </div>
                        ) : (
                            log.guideComments && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <p className="text-xs font-bold text-blue-800 mb-1">Guide Remarks:</p>
                                    <p className="text-sm text-blue-900 italic">"{log.guideComments}"</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Action Area */}
                    <div className="pt-3 border-t border-slate-100">
                        {actionLogId === log.id ? (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm font-bold text-slate-700 mb-2">
                                    {actionType === 'APPROVED' ? 'Approve Log' :
                                        actionType === 'REJECTED' ? 'Reject Log - Reason Required' :
                                            'Are you sure you want to delete this log?'}
                                </p>
                                {(actionType === 'APPROVED' || actionType === 'REJECTED') && (
                                    <textarea
                                        className="w-full text-sm p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder={actionType === 'APPROVED' ? "Optional comments..." : "Reason for rejection..."}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        autoFocus
                                    />
                                )}
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setActionLogId(null)}>Cancel</Button>
                                    <Button
                                        size="sm"
                                        className={actionType === 'APPROVED' ? 'bg-green-600 hover:bg-green-700 text-white' :
                                            actionType === 'DELETE' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                                'bg-amber-600 hover:bg-amber-700 text-white'}
                                        onClick={confirmAction}
                                        disabled={actionType === 'REJECTED' && !comment.trim()}
                                    >
                                        {actionType === 'DELETE' ? 'Delete' :
                                            actionType === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2 justify-end">
                                {(log.status === 'PENDING' || log.status === 'SUBMITTED') && onUpdateStatus && (
                                    <>
                                        <button
                                            onClick={() => handleActionSearch(log.id, 'APPROVED')}
                                            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100 hover:border-emerald-200"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleActionSearch(log.id, 'REJECTED')}
                                            className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-rose-100 hover:border-rose-200"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </>
                                )}
                                {log.status === 'APPROVED' && (
                                    <>
                                        <button
                                            onClick={() => startEditing(log)}
                                            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 hover:border-blue-200"
                                        >
                                            Update Remarks
                                        </button>
                                        <button
                                            onClick={() => handleActionSearch(log.id, 'DELETE')}
                                            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-100 hover:border-slate-200"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
