import React, { createContext, useContext, useState, useEffect } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    category?: string;
    timestamp: number;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            try {
                setNotifications(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);

        // Auto-dismiss popup/toast style notifications (visual only, actual data kept)
        // Ideally we would split "toasts" from "history" but for now let's keep all.
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, markAsRead, clearAll }}>
            {children}
            {/* Global Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.slice(0, 3).map((n) => (
                    // Only show recent unread ones as toasts for a few seconds? 
                    // Or rely on the consuming components to show toasts?
                    // Let's implement a simple toast here for immediate feedback, clickable to dismiss
                    // To avoid duplicates if components also show them, we might need a "toast" flag.
                    // For simplicity, let's presume components CALL addNotification, and THIS is the visualizer.
                    // Wait, previous code in JobForm just called addNotification and expected magic?
                    // No, existing NotificationContext likely didn't have a renderer.
                    // I'll add a renderer here.
                    <div key={n.id} className="pointer-events-auto bg-white border-l-4 border-[#0F2137] shadow-lg rounded-r p-4 flex items-start gap-4 min-w-[300px] animate-in slide-in-from-right duration-300">
                        <div className={`p-1 rounded-full ${n.type === 'success' ? 'bg-green-100 text-green-600' : n.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {/* Icon Placeholder */}
                            <div className="w-2 h-2 rounded-full bg-current" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-[#0F2137]">{n.title}</h4>
                            <p className="text-xs text-slate-500">{n.message}</p>
                        </div>
                        <button onClick={() => removeNotification(n.id)} className="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
