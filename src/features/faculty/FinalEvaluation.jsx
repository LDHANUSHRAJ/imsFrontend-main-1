import DashboardLayout from "../../components/layout/DashboardLayout";
import { useParams } from "react-router-dom";

export default function FinalEvaluation() {
    const { id } = useParams();

    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Final Internship Evaluation
            </h1>

            <div className="bg-white p-6 rounded shadow max-w-xl">
                <h2 className="font-medium mb-4">Documents</h2>

                <ul className="text-sm mb-6 space-y-1">
                    <li>📄 Internship Report</li>
                    <li>📄 Completion Certificate</li>
                    <li>📄 Attendance Sheet</li>
                </ul>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Final Rating (1–5)
                    </label>
                    <select className="w-full border rounded px-3 py-2">
                        <option>5 - Excellent</option>
                        <option>4 - Very Good</option>
                        <option>3 - Good</option>
                        <option>2 - Satisfactory</option>
                        <option>1 - Poor</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Remarks
                    </label>
                    <textarea
                        rows="3"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Final remarks"
                    />
                </div>

                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Submit & Close Internship
                </button>
            </div>
        </DashboardLayout>
    );
}
