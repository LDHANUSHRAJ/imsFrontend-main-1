import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check, Search } from 'lucide-react';
import { AdminService } from '../../services/admin.service';
import type { Department, Program } from '../../types';

interface DepartmentSelectorProps {
    selected: string[]; // List of selected 'Program - Subprogram' strings or just 'Subprogram' depending on need. Let's start with unique subprogram names.
    onChange: (selected: string[]) => void;
    label?: string;
    placeholder?: string;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ selected, onChange, label = "Department Filter", placeholder = "Select Departments" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [depts, progs] = await Promise.all([
                    AdminService.getDepartments(),
                    AdminService.getPrograms()
                ]);
                setDepartments(depts);
                setPrograms(progs);
            } catch (error) {
                console.error("Failed to fetch selector data", error);
            }
        };
        fetchData();
    }, []);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleSelect = (programId: string) => {
        if (selected.includes(programId)) {
            onChange(selected.filter(id => id !== programId));
        } else {
            onChange([...selected, programId]);
        }
    };

    // Filter departments and their programs
    const filteredDepts = departments.filter(dept => {
        const deptMatches = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        const progMatches = programs.some(p => p.department_id === dept.id && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return deptMatches || progMatches;
    });

    return (
        <div className="relative w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

            <div
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-blue-400"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-sm text-gray-600 truncate">
                    {selected.length > 0 ? `${selected.length} Selected` : placeholder}
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-96 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto p-2 scrollbar-thin">
                        {filteredDepts.length > 0 ? (
                            filteredDepts.map(dept => (
                                <div key={dept.id} className="mb-1">
                                    <div
                                        className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer select-none"
                                        onClick={() => toggleCategory(dept.id)}
                                    >
                                        {expandedCategories.includes(dept.id) || searchTerm ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                                        <span className="text-sm font-semibold text-slate-700">{dept.name}</span>
                                    </div>

                                    {(expandedCategories.includes(dept.id) || searchTerm) && (
                                        <div className="ml-6 space-y-1 mt-1 border-l-2 border-slate-100 pl-2">
                                            {programs
                                                .filter(p => p.department_id === dept.id)
                                                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || dept.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map(prog => (
                                                    <label key={prog.id} className="flex items-start gap-2 p-1.5 hover:bg-blue-50 rounded cursor-pointer group">
                                                        <div className={`mt-0.5 w-4 h-4 border rounded flex items-center justify-center transition-colors ${selected.includes(prog.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                                            {selected.includes(prog.id) && <Check size={10} className="text-white" />}
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={selected.includes(prog.id)}
                                                                onChange={() => handleSelect(prog.id)}
                                                            />
                                                        </div>
                                                        <span className={`text-xs leading-snug ${selected.includes(prog.id) ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                                                            {prog.name}
                                                        </span>
                                                    </label>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-slate-500">No programs found</div>
                        )}
                    </div>

                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between">
                        <button onClick={() => onChange([])} className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1">Clear</button>
                        <button onClick={() => setIsOpen(false)} className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1">Done</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentSelector;
