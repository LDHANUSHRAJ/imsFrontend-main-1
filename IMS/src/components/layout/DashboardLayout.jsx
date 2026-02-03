import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * TEMP ROLE:
 * Later this comes from auth context / ERP
 */
const MOCK_ROLE = "IC"; // change to HOD | FACULTY | RECRUITER

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar role={MOCK_ROLE} />

            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
