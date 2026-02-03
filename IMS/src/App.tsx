import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Briefcase, FileText, UserCheck, Calendar, Award } from 'lucide-react';

// Providers - MUST be at the top
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Auth & Services
import { logout } from './services/auth';
import ProtectedRoute from './components/auth/login';
import RoleGuard from './components/auth/RoleGuard';

// UI Components
import NotificationDropdown from './components/notifications/NotificationDropdown';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; // Staff Login
import RecruiterLoginPage from './pages/RecruiterLoginPage'; // Recruiter Login
import Login from './pages/Login'; // Recruiter Registration
import Dashboard from './pages/Dashboard';
import SessionList from './pages/sessions/SessionList';
import RecruiterManagement from './pages/recruiters/RecruiterManagement';
import JobPostingList from './pages/jobs/JobPostingList';
import JobForm from './pages/jobs/JobForm';
import ApplicationList from './pages/applications/ApplicationList';
import ApplicationDetail from './pages/applications/ApplicationDetail';
import GuideAssignment from './pages/guides/GuideAssignment';
import ClosureEvaluation from './pages/closure/ClosureEvaluation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Define public pages that don't need the sidebar
  const publicRoutes = ['/', '/login/staff', '/login/recruiter', '/register', '/login', '/login-page'];
  const isAuthPage = publicRoutes.includes(location.pathname);

  if (isAuthPage || !isAuthenticated) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Navigation Logic
  const getNavItems = () => {
    // Default to empty array if user role is missing
    const role = user?.role || 'IC';

    switch (role) {
      case 'IC':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Calendar, label: 'Sessions', path: '/sessions' },
          { icon: Users, label: 'Recruiters', path: '/recruiters' },
          { icon: Briefcase, label: 'Job Postings', path: '/jobs' },
          { icon: FileText, label: 'Applications', path: '/applications' },
          { icon: UserCheck, label: 'Guide Assignment', path: '/guides' },
          { icon: Award, label: 'Closure & Evaluation', path: '/closure' },
        ];
      case 'HOD':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Briefcase, label: 'Job Postings', path: '/jobs' },
          { icon: FileText, label: 'Applications', path: '/applications' },
          { icon: UserCheck, label: 'Guide Assignment', path: '/guides' },
          { icon: Award, label: 'Closure & Evaluation', path: '/closure' },
        ];
      case 'FACULTY':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: FileText, label: 'Applications', path: '/applications' },
          { icon: UserCheck, label: 'My Students', path: '/guides' },
          { icon: Award, label: 'Evaluations', path: '/closure' },
        ];
      case 'RECRUITER':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Briefcase, label: 'My Postings', path: '/jobs' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <aside className="w-64 bg-[#0F2540] text-white fixed h-full flex flex-col justify-between z-20 shadow-xl">
        <div>
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-[#D4AF37]">Christ University</h1>
            <p className="text-sm text-gray-400 mt-1">
              {user?.role === 'RECRUITER' ? 'Recruiter Portal' :
                user?.role === 'FACULTY' ? 'Faculty Portal' :
                  user?.role === 'HOD' ? 'HOD Portal' :
                    'Admin Portal'}
            </p>
            <div className="mt-4">
              <NotificationDropdown />
            </div>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith(item.path) ? "bg-[#1E3A5F] text-white shadow-md border-l-4 border-[#D4AF37]" : "text-gray-300 hover:bg-[#1E3A5F] hover:text-white"
                  }`}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700 bg-[#0A1A2F]">
          <div className="flex items-center gap-3 px-4 py-2 mb-2 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-[#1E3A5F] flex items-center justify-center text-[#D4AF37] font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-semibold text-white">{user?.name || 'User'}</p>
              <p className="truncate text-xs">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-900/20 w-full rounded-lg transition-colors text-sm font-medium">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <div className="ml-64 flex-1 p-8 overflow-y-auto h-screen">{children}</div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login/staff" element={<LoginPage />} />
              <Route path="/login/recruiter" element={<RecruiterLoginPage />} />
              <Route path="/register" element={<Login />} />

              {/* Legacy Routes redirecting to new structure */}
              <Route path="/login" element={<Navigate to="/register" replace />} />
              <Route path="/login-page" element={<Navigate to="/login/staff" replace />} />

              {/* Protected Functional Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Dashboard redirects based on role via Dashboard component */}
                <Route path="/dashboard" element={<Dashboard />} />

                <Route element={<RoleGuard allowedRoles={['IC', 'HOD']} />}>
                  <Route path="/sessions" element={<SessionList />} />
                </Route>

                <Route element={<RoleGuard allowedRoles={['IC']} />}>
                  <Route path="/recruiters" element={<RecruiterManagement />} />
                </Route>

                <Route path="/jobs" element={<JobPostingList />} />
                <Route path="/jobs/new" element={<JobForm />} />
                <Route path="/jobs/:id/edit" element={<JobForm />} />

                <Route path="/applications" element={<ApplicationList />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />

                <Route path="/guides" element={<GuideAssignment />} />
                <Route path="/closure" element={<ClosureEvaluation />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;