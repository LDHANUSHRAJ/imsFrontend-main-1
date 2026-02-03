const Skeleton = ({ className = "", variant = "default" }: { className?: string; variant?: "default" | "circle" | "text" }) => {
    const baseClasses = "animate-pulse bg-slate-200";

    const variants = {
        default: "rounded-lg",
        circle: "rounded-full",
        text: "rounded h-4"
    };

    return (
        <div className={`${baseClasses} ${variants[variant]} ${className}`} />
    );
};

export const CardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-4">
            <Skeleton variant="circle" className="h-12 w-12" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <Skeleton variant="circle" className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
        ))}
    </div>
);

export default Skeleton;
