'use client';

import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';

export default function FilterBar() {
  const { filters, updateFilter, resetFilters, filteredStudents, students } = useData();

  const filterGroups = [
    {
      key: 'sex' as const,
      label: 'Sex',
      options: [
        { value: 'all', label: 'All' },
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
      ],
    },
    {
      key: 'school' as const,
      label: 'School',
      options: [
        { value: 'all', label: 'All' },
        { value: 'GP', label: 'Gabriel Pereira' },
        { value: 'MS', label: 'Mousinho da Silveira' },
      ],
    },
    {
      key: 'address' as const,
      label: 'Location',
      options: [
        { value: 'all', label: 'All' },
        { value: 'U', label: 'Urban' },
        { value: 'R', label: 'Rural' },
      ],
    },
    {
      key: 'higher' as const,
      label: 'Higher Ed Goal',
      options: [
        { value: 'all', label: 'All' },
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
  ];

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-slate-925/80 backdrop-blur-lg border-b border-slate-800 py-4"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Filter Groups */}
          <div className="flex flex-wrap items-center gap-6">
            {filterGroups.map((group) => (
              <div key={group.key} className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{group.label}:</span>
                <div className="flex gap-1">
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter(group.key, option.value as typeof filters[typeof group.key])}
                      className={`filter-button ${filters[group.key] === option.value ? 'active' : ''}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Results & Reset */}
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-accent-teal font-mono font-semibold">{filteredStudents.length}</span>
              <span className="text-gray-400"> / {students.length} students</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

