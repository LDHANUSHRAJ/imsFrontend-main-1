interface FilterBarProps {
    children: React.ReactNode;
}

export const FilterBar = ({ children }: FilterBarProps) => {
    return (
        <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    );
};
