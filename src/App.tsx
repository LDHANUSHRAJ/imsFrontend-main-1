import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Briefcase, FileText, UserCheck, CheckCircle, Shield, Building2 } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import NotificationDropdown from './components/notifications/NotificationDropdown';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import StudentLoginPage from './pages/auth/StudentLoginPage';
import CorporateLoginPage from './pages/auth/CorporateLoginPage';
import StaffLoginPage from './pages/auth/StaffLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

import JobPostingList from './pages/jobs/JobPostingList';
import JobForm from './pages/jobs/JobForm';
import ApplicationList from './pages/applications/ApplicationList';
import ApplicationDetail from './pages/applications/ApplicationDetail';
import StudentApplications from './pages/applications/StudentApplications';
import BrowseOffers from './pages/internship/BrowseOffers';
import MyInternshipPortal from './pages/internship/MyInternshipPortal';
import WeeklyReports from './pages/reports/WeeklyReports';
import WeeklyLogModule from './pages/monitoring/WeeklyLogModule';
import InternshipCompletionStatus from './pages/monitoring/InternshipCompletion';
import ApprovedInternships from './pages/placement/ApprovedInternships';
import PlacementOfficerDashboard from './pages/dashboards/PlacementOfficerDashboard';
import CompanyApproval from './pages/company/CompanyApproval';
import RecruiterManagement from './pages/recruiters/RecruiterManagement';
import ClosureEvaluation from './pages/closure/ClosureEvaluation';
import CreditAuth from './pages/credit/CreditAuth';
import UserManagement from './pages/admin/UserManagement';
import RecruiterProfile from './pages/recruiters/RecruiterProfile';
import PlacementProfile from './pages/profiles/PlacementProfile';
import StudentProfile from './pages/profiles/StudentProfile';
import StudentDetailsPage from './pages/guides/StudentDetailsPage';
import GuideAssignment from './pages/guides/GuideAssignment';
import AssignedStudents from './pages/guides/AssignedStudents';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Define public pages that don't need the sidebar
  const publicRoutes = ['/', '/login', '/login/student', '/login/corporate', '/login/staff', '/register'];
  const isAuthPage = publicRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthPage || !isAuthenticated) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Navigation Logic
  const getNavItems = () => {
    const role = user?.role;

    switch (role) {
      case 'PROGRAMME_COORDINATOR':
        return [
          { icon: Users, label: 'Guide Allocation', path: '/dashboard' },
        ];
      case 'PLACEMENT_HEAD':
        return [
          { icon: Shield, label: 'Dashboard', path: '/dashboard' },
          { icon: Building2, label: 'Recruiter Approvals', path: '/company-approvals' },
          { icon: CheckCircle, label: 'Approved Internships', path: '/approved-internships' },
          { icon: Users, label: 'All Recruiters', path: '/recruiters' },
        ];
      case 'PLACEMENT':
      case 'PLACEMENT_OFFICE':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: CheckCircle, label: 'Approved Internships', path: '/approved-internships' },
        ];
      case 'PLACEMENT_OFFICE':
        return [
          { icon: LayoutDashboard, label: 'Internship Approvals', path: '/dashboard' },
          { icon: CheckCircle, label: 'Approved Internships', path: '/approved-internships' },
          { icon: FileText, label: 'Custom Approvals', path: '/custom-approvals' },
        ];
      case 'HOD':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Briefcase, label: 'Job Postings', path: '/jobs' },
          { icon: FileText, label: 'Applications', path: '/manage/applications' },
          { icon: UserCheck, label: 'Guide Assignment', path: '/guides' },
        ];
      case 'FACULTY':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Users, label: 'Assigned Students', path: '/assigned-students' },
        ];
      case 'CORPORATE':
      case 'RECRUITER': // Fallback alias
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Briefcase, label: 'My Postings', path: '/jobs' },
          { icon: FileText, label: 'Applications', path: '/manage/applications' },
        ];
      case 'STUDENT':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Briefcase, label: 'Browse Internships', path: '/internships' },
          { icon: FileText, label: 'My Applications', path: '/applications' },
          { icon: FileText, label: 'My Weekly Reports', path: '/weekly-reports' },
          { icon: CheckCircle, label: 'My Profile', path: '/profile' },
        ];
      case 'ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Users, label: 'User Management', path: '/users' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const isPlacement = user?.role === 'PLACEMENT' || user?.role === 'PLACEMENT_HEAD' || user?.role === 'PLACEMENT_OFFICE';

  const handleLogout = () => {
    const role = user?.role;
    if (role === 'CORPORATE' || role === 'RECRUITER') {
      navigate('/login/recruiter');
    } else {
      navigate('/');
    }
    setTimeout(logout, 50);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <aside className="w-64 bg-[#1A1C1E] text-white fixed h-full flex flex-col justify-between z-20 shadow-xl border-r border-white/5">
        <div>
          <div className="p-8">
            <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-1">
              {isPlacement ? 'IMS Portal' : 'Christ'}
            </h1>
            {!isPlacement && <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-3 opacity-60">University</h1>}

            {isPlacement && (
              <div className="mt-12 mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                  Management
                </p>
              </div>
            )}

            {!isPlacement && (
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-6 bg-[#D4AF37]"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  {user?.role === 'CORPORATE' || user?.role === 'RECRUITER' ? 'Recruiter Portal' :
                    user?.role === 'FACULTY' ? 'Faculty Portal' :
                      user?.role === 'HOD' ? 'HOD Portal' :
                        (user?.role === 'PLACEMENT_OFFICE' || user?.role === 'PLACEMENT') ? 'Placement Coordinator Portal' :
                          user?.role === 'PLACEMENT_HEAD' ? 'Placement Head Portal' :
                            user?.role === 'PROGRAMME_COORDINATOR' ? 'Programme Coordinator' :
                              user?.role === 'STUDENT' ? 'Student Portal' :
                                'Internships'}
                </p>
              </div>
            )}

            <div className="mt-4">
              <NotificationDropdown />
            </div>
          </div>
          <nav className="px-4 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 nav-item animate-slide-in-left ${location.pathname.startsWith(item.path)
                  ? isPlacement ? "bg-white/5 text-white" : "bg-[#1E3A5F] text-white shadow-lg border-l-4 border-[#D4AF37]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <item.icon size={18} className={location.pathname.startsWith(item.path) ? (isPlacement ? "text-white" : "text-[#D4AF37]") : "opacity-50"} />
                <span className={`text-sm ${location.pathname.startsWith(item.path) ? "font-semibold" : "font-medium"}`}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-6">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${isPlacement
              ? "bg-[#E25C44] text-white hover:bg-[#D14B35] shadow-lg shadow-orange-950/20"
              : "text-rose-400 hover:bg-rose-500/10"
              }`}
          >
            {isPlacement ? <LogOut size={16} /> : <LogOut size={18} />}
            <span>{isPlacement ? 'Logout Placement' : 'Sign Out Profile'}</span>
          </button>
        </div>
      </aside>
      <div className="ml-64 flex-1 p-8 overflow-y-auto h-screen page-enter">{children}</div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<StudentLoginPage />} />
      <Route path="/login/student" element={<StudentLoginPage />} />
      <Route path="/login/corporate" element={<CorporateLoginPage />} />
      <Route path="/login/staff" element={<StaffLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Legacy Routes redirecting to new structure */}
      <Route path="/login-page" element={<Navigate to="/login" replace />} />
      <Route path="/login/recruiter" element={<Navigate to="/login/corporate" replace />} />

      {/* Protected Functional Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard redirects based on role via Dashboard component */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<RoleGuard allowedRoles={['PLACEMENT', 'PLACEMENT_HEAD', 'PLACEMENT_OFFICE']} />}>
          <Route path="/approved-internships" element={<ApprovedInternships />} />
          <Route path="/custom-approvals" element={<PlacementOfficerDashboard />} />
          <Route path="/recruiters" element={<RecruiterManagement />} />
          <Route path="/company-approvals" element={<CompanyApproval />} />
          <Route path="/credits-approval" element={<ClosureEvaluation />} />
          <Route path="/credit-auth" element={<CreditAuth />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>

        <Route path="/recruiters/profile" element={<RecruiterProfile />} />

        <Route path="/jobs" element={<JobPostingList />} />
        <Route path="/jobs/new" element={<JobForm />} />
        <Route path="/jobs/:id/edit" element={<JobForm />} />

        <Route element={<RoleGuard allowedRoles={['STUDENT']} />}>
          <Route path="/applications" element={<StudentApplications />} />
          <Route path="/my-internship" element={<MyInternshipPortal />} />
          <Route path="/offers" element={<BrowseOffers />} />
          <Route path="/internships" element={<BrowseOffers />} />
          <Route path="/weekly-reports" element={<WeeklyReports />} />
          <Route path="/monitoring/logs" element={<WeeklyLogModule />} />
          <Route path="/completion" element={<InternshipCompletionStatus />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['PLACEMENT_OFFICE', 'FACULTY', 'HOD', 'IC', 'RECRUITER', 'CORPORATE']} />}>
          <Route path="/manage/applications" element={<ApplicationList />} />
          <Route path="/manage/applications/:id" element={<ApplicationDetail />} />
        </Route>

        <Route path="/guides" element={<GuideAssignment />} />
        <Route path="/assigned-students" element={<AssignedStudents />} />
        <Route path="/guide/student/:id" element={<StudentDetailsPage />} />
        <Route path="/profile" element={user?.role === 'STUDENT' ? <StudentProfile /> : <PlacementProfile />} />
        <Route path="/closure" element={<ClosureEvaluation />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </Layout>
        </Router>
      </NotificationProvider>
    </AuthProvider >
  );
};

export default App;