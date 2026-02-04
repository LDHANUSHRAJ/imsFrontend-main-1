import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function Topbar() {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-8 transition-shadow hover:shadow-sm">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#0F2137] to-blue-600 bg-clip-text text-transparent">
                    {user?.role === 'RECRUITER' ? 'Corporate Portal' : 'IMS Portal'}
                </h2>
            </div>

            <div className="flex items-center gap-6">
                <NotificationDropdown />

                <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-[#0F2137] leading-tight">{user?.name || 'User'}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{user?.company_name || user?.role}</p>
                    </div>
                    <div className="h-10 w-10 bg-[#0F2137] rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/10 ring-2 ring-white">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
