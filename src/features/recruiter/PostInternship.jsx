import DashboardLayout from "../../components/layout/DashboardLayout";

export default function PostInternship() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-4">Post Internship</h1>

            <div className="bg-white p-6 rounded shadow space-y-4">
                <input className="border p-2 w-full rounded" placeholder="Company Name" />
                <input className="border p-2 w-full rounded" placeholder="Role" />
                <input className="border p-2 w-full rounded" placeholder="Duration" />
                <textarea className="border p-2 w-full rounded" placeholder="Description" />
                <button className="bg-christBlue text-white px-6 py-2 rounded">
                    Submit for Approval
                </button>
            </div>
        </DashboardLayout>
    );
}
