import { useState } from "react";
import Button from "../../components/ui/Button"; // Changed to relative path to avoid index error
import Modal from "../../components/ui/Modal"; // Changed to relative path

interface Props {
    onClose: () => void;
}

export default function EvaluationModal({ onClose }: Props) {
    const [rating, setRating] = useState(3);
    const [remarks, setRemarks] = useState("");

    return (
        <Modal isOpen={true} onClose={onClose} title="Final rating (by the Guide/Mentor)" maxWidth="max-w-xl">
            <div className="space-y-6">
                {/* Header text from the image context if any, but modal title covers it */}
                <p className="text-sm text-gray-600">
                    After the final report is updated, the guide/mentor provides a final mark/rating, officially closing the internship.
                </p>

                <div className="border-2 border-slate-800 rounded-lg p-6 bg-white shadow-sm">
                    {/* Remarks Section */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-900 mb-2">Remarks</label>
                        <textarea
                            className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px] resize-none"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>

                    {/* Rating Section */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-900">Rating:</span>
                        <div className="relative flex-1 flex items-center">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="absolute w-full flex justify-between text-xs text-gray-900 -bottom-6 font-medium">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end mt-12">
                        <Button
                            className="bg-[#4285F4] hover:bg-[#3367d6] text-white rounded px-8 py-2 font-medium w-auto"
                            onClick={() => {
                                // Handle submission logic here
                                onClose();
                            }}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
