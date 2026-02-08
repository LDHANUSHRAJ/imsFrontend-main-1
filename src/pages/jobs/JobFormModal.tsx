import { X } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

interface Props {
    onClose: () => void;
}

export default function JobFormModal({ onClose }: Props) {
    return (
        <Modal isOpen={true} title="Create Internship Posting" onClose={onClose}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create Internship Posting</h2>
                <button onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="space-y-4">
                <input className="input" placeholder="Job Title" />
                <textarea
                    className="input min-h-[100px]"
                    placeholder="Job Description"
                />

                <select className="input">
                    <option>Eligible Program</option>
                    <option>MCA</option>
                    <option>MBA</option>
                </select>

                <input className="input" placeholder="Location (Remote / City)" />
                <input className="input" placeholder="Duration (e.g. 6 Months)" />
                <input className="input" placeholder="Stipend (Optional)" />

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Save as Draft
                    </Button>
                    <Button>Submit for Approval</Button>
                </div>
            </div>
        </Modal>
    );
}
