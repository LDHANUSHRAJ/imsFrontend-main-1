import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ICDashboard() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Internship Coordinator Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Active Internship Sessions" value="4" />
                <Card title="Pending Recruiter Approvals" value="7" />
                <Card title="Students Applied" value="128" />
            </div>

            <Section title="Quick Actions">
                <Action text="Open Internship Session" />
                <Action text="Approve Internship Postings" />
                <Action text="Assign Guides / Mentors" />
                <Action text="Generate Internship Reports" />
            </Section>
        </DashboardLayout>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-5 rounded shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mt-8">
            <h2 className="font-medium mb-4">{title}</h2>
            <div className="grid md:grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function Action({ text }) {
    return (
        <div className="bg-white p-4 rounded shadow text-sm cursor-pointer hover:border hover:border-christBlue">
            {text}
        </div>
    );
}
