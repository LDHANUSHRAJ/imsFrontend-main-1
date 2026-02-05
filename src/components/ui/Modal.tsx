import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                {/* Backdrop with Christ Navy tint */}
                <div
                    className="fixed inset-0 bg-[#0F2137]/60 backdrop-blur-sm transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <div className={cn(
                    "relative flex flex-col w-full bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 animate-in fade-in zoom-in duration-300",
                    maxWidth
                )}>
                    <div className="bg-white px-6 pt-6 pb-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-[#0F2137]" id="modal-title">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;