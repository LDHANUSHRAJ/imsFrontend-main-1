import React, { useState } from 'react';
import { Filter, Calendar, Layers, ChevronDown, Check } from 'lucide-react';
import { PROGRAMS } from '../../data/programs';

interface FilterOption {
    label: string;
    value: string;
}

const SKILLS = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Data Analysis', 'Machine Learning'];
const LOCATIONS = ['Bangalore', 'Mumbai', 'Delhi', 'Remote', 'Hyderabad', 'Chennai'];

// ... existing imports ...

interface DashboardFiltersProps {
    years: FilterOption[];
    batches: FilterOption[];
    selectedYear: string;
    selectedBatch: string;
    selectedPrograms?: string[];
    // New Filters
    selectedSkills?: string[];
    selectedLocations?: string[];
    minGpa?: string;

    onYearChange: (year: string) => void;
    onBatchChange: (batch: string) => void;
    onProgramsChange?: (programs: string[]) => void;
    // New Handlers
    onSkillsChange?: (skills: string[]) => void;
    onLocationsChange?: (locations: string[]) => void;
    onGpaChange?: (gpa: string) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    years,
    batches,
    selectedYear,
    selectedBatch,
    selectedPrograms = [],
    selectedSkills = [],
    selectedLocations = [],
    minGpa = '',
    onYearChange,
    onBatchChange,
    onProgramsChange,
    onSkillsChange,
    onLocationsChange,
    onGpaChange
}) => {
    const [showProgramFilter, setShowProgramFilter] = useState(false);
    const [showSkillFilter, setShowSkillFilter] = useState(false);
    const [showLocationFilter, setShowLocationFilter] = useState(false);

    // ... existing toggleProgram ...
    const toggleProgram = (program: string) => {
        if (!onProgramsChange) return;
        const newSelection = selectedPrograms.includes(program)
            ? selectedPrograms.filter(p => p !== program)
            : [...selectedPrograms, program];
        onProgramsChange(newSelection);
    };

    const toggleCategory = (categorySubprograms: string[]) => {
        if (!onProgramsChange) return;
        const allSelected = categorySubprograms.every(p => selectedPrograms.includes(p));
        let newSelection = [...selectedPrograms];
        if (allSelected) {
            newSelection = newSelection.filter(p => !categorySubprograms.includes(p));
        } else {
            categorySubprograms.forEach(p => {
                if (!newSelection.includes(p)) newSelection.push(p);
            });
        }
        onProgramsChange(newSelection);
    };

    // Generic toggle for simple string arrays
    const toggleSelection = (item: string, current: string[], onChange?: (items: string[]) => void) => {
        if (!onChange) return;
        const newSelection = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        onChange(newSelection);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm mb-6 w-fit">
            <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <Filter size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filters</span>
            </div>

            <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer py-1"
                >
                    {years.map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                </select>
            </div>

            <div className="w-px h-4 bg-slate-200"></div>

            <div className="flex items-center gap-2 pr-2">
                <Layers size={14} className="text-slate-400" />
                <select
                    value={selectedBatch}
                    onChange={(e) => onBatchChange(e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer py-1"
                >
                    {batches.map(batch => (
                        <option key={batch.value} value={batch.value}>{batch.label}</option>
                    ))}
                </select>
            </div>

            {onProgramsChange && (
                <>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="relative">
                        <button
                            onClick={() => setShowProgramFilter(!showProgramFilter)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#0F2137]"
                        >
                            Programs {selectedPrograms.length > 0 && <span className="bg-[#0F2137] text-white text-[10px] px-1.5 rounded-full">{selectedPrograms.length}</span>}
                            <ChevronDown size={14} />
                        </button>

                        {showProgramFilter && (
                            <div className="absolute top-10 left-0 w-[400px] max-h-[500px] overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl z-50 p-4">
                                <div className="mb-4 flex justify-between items-center">
                                    <h4 className="font-bold text-sm">Select Subprograms</h4>
                                    <button onClick={() => setShowProgramFilter(false)} className="text-xs text-blue-500 font-bold">Done</button>
                                </div>
                                <div className="space-y-4">
                                    {PROGRAMS.map((category) => (
                                        <div key={category.name}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{category.name}</h5>
                                                <button
                                                    onClick={() => toggleCategory(category.subprograms)}
                                                    className="text-[10px] text-blue-600 hover:underline"
                                                >
                                                    Select All
                                                </button>
                                            </div>
                                            <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                                                {category.subprograms.map(prog => (
                                                    <label key={prog} className="flex items-start gap-2 cursor-pointer group">
                                                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPrograms.includes(prog) ? 'bg-[#0F2137] border-[#0F2137]' : 'border-slate-300 bg-white'}`}>
                                                            {selectedPrograms.includes(prog) && <Check size={10} className="text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={selectedPrograms.includes(prog)}
                                                            onChange={() => toggleProgram(prog)}
                                                        />
                                                        <span className={`text-xs ${selectedPrograms.includes(prog) ? 'text-[#0F2137] font-medium' : 'text-slate-600'}`}>
                                                            {prog}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Skills Filter */}
            {onSkillsChange && (
                <>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="relative">
                        <button
                            onClick={() => setShowSkillFilter(!showSkillFilter)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#0F2137]"
                        >
                            Skills {selectedSkills.length > 0 && <span className="bg-[#0F2137] text-white text-[10px] px-1.5 rounded-full">{selectedSkills.length}</span>}
                            <ChevronDown size={14} />
                        </button>
                        {showSkillFilter && (
                            <div className="absolute top-10 left-0 w-[200px] max-h-[300px] overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl z-50 p-4">
                                <div className="mb-2 flex justify-between items-center">
                                    <h4 className="font-bold text-sm">Skills</h4>
                                    <button onClick={() => setShowSkillFilter(false)} className="text-xs text-blue-500 font-bold">Done</button>
                                </div>
                                <div className="space-y-2">
                                    {SKILLS.map(skill => (
                                        <label key={skill} className="flex items-start gap-2 cursor-pointer group">
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedSkills.includes(skill) ? 'bg-[#0F2137] border-[#0F2137]' : 'border-slate-300 bg-white'}`}>
                                                {selectedSkills.includes(skill) && <Check size={10} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedSkills.includes(skill)}
                                                onChange={() => toggleSelection(skill, selectedSkills, onSkillsChange)}
                                            />
                                            <span className="text-xs text-slate-600">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Location Filter */}
            {onLocationsChange && (
                <>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="relative">
                        <button
                            onClick={() => setShowLocationFilter(!showLocationFilter)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#0F2137]"
                        >
                            Location {selectedLocations.length > 0 && <span className="bg-[#0F2137] text-white text-[10px] px-1.5 rounded-full">{selectedLocations.length}</span>}
                            <ChevronDown size={14} />
                        </button>
                        {showLocationFilter && (
                            <div className="absolute top-10 left-0 w-[200px] max-h-[300px] overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl z-50 p-4">
                                <div className="mb-2 flex justify-between items-center">
                                    <h4 className="font-bold text-sm">Location</h4>
                                    <button onClick={() => setShowLocationFilter(false)} className="text-xs text-blue-500 font-bold">Done</button>
                                </div>
                                <div className="space-y-2">
                                    {LOCATIONS.map(loc => (
                                        <label key={loc} className="flex items-start gap-2 cursor-pointer group">
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedLocations.includes(loc) ? 'bg-[#0F2137] border-[#0F2137]' : 'border-slate-300 bg-white'}`}>
                                                {selectedLocations.includes(loc) && <Check size={10} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedLocations.includes(loc)}
                                                onChange={() => toggleSelection(loc, selectedLocations, onLocationsChange)}
                                            />
                                            <span className="text-xs text-slate-600">{loc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* GPA Filter */}
            {onGpaChange && (
                <>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">Min GPA:</span>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={minGpa}
                            onChange={(e) => onGpaChange(e.target.value)}
                            className="w-16 h-8 text-sm border border-slate-200 rounded px-2 focus:ring-2 focus:ring-[#0F2137] outline-none"
                            placeholder="0.0"
                        />
                    </div>
                </>
            )}

        </div>
    );
};

export default DashboardFilters;
