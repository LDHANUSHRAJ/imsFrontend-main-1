import DashboardLayout from "../../components/layout/DashboardLayout";

export default function FacultyDashboard() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Faculty / Guide Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Assigned Students" value="24" />
                <Card title="Pending Reviews" value="9" />
                <Card title="Completed Evaluations" value="31" />
            </div>

            <Section title="Guide Responsibilities">
                <Action text="Review Weekly Logs" />
                <Action text="Provide Feedback & Ratings" />
                <Action text="Review Closure Reports" />
                <Action text="Submit Final Evaluation" />
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
