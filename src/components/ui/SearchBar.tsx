import { Search, X } from 'lucide-react';
import Input from './Input';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }: SearchBarProps) => {
    return (
        <div className={`relative ${className}`}>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                icon={<Search size={18} />}
                className="pr-10"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
