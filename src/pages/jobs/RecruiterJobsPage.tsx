import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { FilterBar } from "../../components/filters/FilterBar";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import JobFormModal from "./JobFormModal";

const mockJobs = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        program: "MCA",
        location: "Bangalore",
        status: "Draft",
    },
    {
        id: 2,
        title: "Data Analyst Intern",
        program: "MBA",
        location: "Remote",
        status: "Pending",
    },
    {
        id: 3,
        title: "Backend Intern",
        program: "MCA",
        location: "Hyderabad",
        status: "Rejected",
        feedback: "Please specify stipend and duration clearly.",
    },
];

export default function RecruiterJobsPage() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0F2137]">
                        Internship Postings
                    </h1>
                    <p className="text-sm text-gray-500">
                        Create and manage internship opportunities
                    </p>
                </div>

                <Button onClick={() => setOpenModal(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Job
                </Button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Jobs" value={5} />
                <StatCard title="Draft" value={2} />
                <StatCard title="Pending Approval" value={1} />
                <StatCard title="Approved" value={2} />
            </div>

            {/* FILTERS */}
            <FilterBar>
                <select className="input">
                    <option>Status</option>
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>

                <select className="input">
                    <option>Program</option>
                    <option>MCA</option>
                    <option>MBA</option>
                </select>
            </FilterBar>

            {/* TABLE */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-6 py-3 text-left">Title</th>
                            <th className="px-6 py-3 text-left">Program</th>
                            <th className="px-6 py-3 text-left">Location</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockJobs.map((job) => (
                            <tr key={job.id} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{job.title}</td>
                                <td className="px-6 py-4">{job.program}</td>
                                <td className="px-6 py-4">{job.location}</td>
                                <td className="px-6 py-4 min-w-[200px]">
                                    <div className="flex items-center space-x-1 text-xs">
                                        {/* Status: Draft */}
                                        <div className={`flex flex-col items-center flex-1 ${["Draft", "Pending", "Approved", "Rejected"].includes(job.status) ? "text-christBlue font-medium" : "text-gray-300"}`}>
                                            <div className={`w-3 h-3 rounded-full mb-1 ${["Draft", "Pending", "Approved", "Rejected"].includes(job.status) ? "bg-christBlue" : "bg-gray-200"}`}></div>
                                            Draft
                                        </div>
                                        <div className={`h-[2px] flex-1 ${["Pending", "Approved", "Rejected"].includes(job.status) ? "bg-christBlue" : "bg-gray-200"}`}></div>

                                        {/* Status: Pending */}
                                        <div className={`flex flex-col items-center flex-1 ${["Pending", "Approved", "Rejected"].includes(job.status) ? "text-christBlue font-medium" : "text-gray-300"}`}>
                                            <div className={`w-3 h-3 rounded-full mb-1 ${["Pending", "Approved", "Rejected"].includes(job.status) ? "bg-christBlue" : "bg-gray-200"}`}></div>
                                            Pending
                                        </div>
                                        <div className={`h-[2px] flex-1 ${["Approved", "Rejected"].includes(job.status) ? "bg-christBlue" : "bg-gray-200"}`}></div>

                                        {/* Status: Final */}
                                        <div className={`flex flex-col items-center flex-1 ${["Approved", "Rejected"].includes(job.status) ? (job.status === "Rejected" ? "text-red-600 font-medium" : "text-green-600 font-medium") : "text-gray-300"}`}>
                                            <div className={`w-3 h-3 rounded-full mb-1 ${["Approved", "Rejected"].includes(job.status) ? (job.status === "Rejected" ? "bg-red-600" : "bg-green-600") : "bg-gray-200"}`}></div>
                                            {job.status === "Rejected" ? "Rejected" : "Approved"}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {job.status === "Draft" && (
                                        <Button variant="ghost">Edit</Button>
                                    )}
                                    {job.status === "Draft" && (
                                        <Button>Submit</Button>
                                    )}
                                    {job.status === "Rejected" && (
                                        <Button variant="ghost">
                                            <MessageSquare size={14} className="mr-1" />
                                            View Feedback
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {openModal && (
                <JobFormModal onClose={() => setOpenModal(false)} />
            )}
        </div>
    );
}
