import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDropdown = () => {
    const { notifications, removeNotification } = useNotifications();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                        <span className="text-xs text-gray-500">{notifications.length} new</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-4">No new notifications</p>
                        ) : (
                            notifications.map((n) => (
                                <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 relative group">
                                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
