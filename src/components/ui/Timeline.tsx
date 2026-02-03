import { useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface TimelineEvent {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'success' | 'error' | 'info' | 'warning';
    user?: string;
}

interface TimelineProps {
    events: TimelineEvent[];
}

const Timeline = ({ events }: TimelineProps) => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="text-emerald-500" size={20} />;
            case 'error':
                return <XCircle className="text-rose-500" size={20} />;
            default:
                return <Clock className="text-blue-500" size={20} />;
        }
    };

    const getLineColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-200';
            case 'error':
                return 'bg-rose-200';
            default:
                return 'bg-blue-200';
        }
    };

    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <Clock size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event, index) => (
                <div key={event.id} className="relative">
                    {index !== events.length - 1 && (
                        <div className={`absolute left-[19px] top-10 w-0.5 h-full ${getLineColor(event.type)}`} />
                    )}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 bg-white rounded-full p-2 border-2 border-slate-100 relative z-10">
                            {getIcon(event.type)}
                        </div>
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-[#0F2137] text-sm">{event.title}</h4>
                                <span className="text-xs text-slate-400">{event.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-600">{event.description}</p>
                            {event.user && (
                                <p className="text-xs text-slate-400 mt-2">by {event.user}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
