import { Button } from "@/components/ui/Button";

const mockLogs = [
    { week: "Week 1", content: "Onboarding and environment setup." },
    { week: "Week 2", content: "Worked on frontend components." },
];

export default function StudentLogsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#0F2137]">
                    Student Logs
                </h1>
                <p className="text-sm text-gray-500">
                    Read-only weekly progress submissions
                </p>
            </div>

            <div className="space-y-4">
                {mockLogs.map((log, i) => (
                    <div
                        key={i}
                        className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-christBlue">{log.week}</h4>
                            <span className="text-xs text-gray-400">Submission: Pending Review</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{log.content}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Feedback</label>
                <textarea
                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm min-h-[100px]"
                    placeholder="Enter your feedback for the student here..."
                />
            </div>

            <Button>Save Feedback</Button>
        </div>
    );
}
