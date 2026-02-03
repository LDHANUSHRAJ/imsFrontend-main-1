import DashboardLayout from "../../components/layout/DashboardLayout";

export default function HODDashboard() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Head of Department Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card title="Total Students" value="312" />
                <Card title="Pending Approvals" value="18" />
                <Card title="Internships In Progress" value="96" />
                <Card title="Completed Internships" value="142" />
            </div>

            <Section title="Department Actions">
                <Action text="Approve Student Applications" />
                <Action text="View LOR Generated" />
                <Action text="Assign Internship Coordinator" />
                <Action text="View Department Reports" />
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
