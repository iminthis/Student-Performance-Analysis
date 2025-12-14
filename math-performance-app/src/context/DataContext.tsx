'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Student, FilterState } from '@/types/student';
import { loadStudentData, filterStudents, getDefaultFilters } from '@/lib/dataLoader';

interface DataContextType {
  students: Student[];
  filteredStudents: Student[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await loadStudentData();
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load student data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate filtered students
  const filteredStudents = filterStudents(students, filters);

  // Update a single filter
  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(getDefaultFilters());
  }, []);

  return (
    <DataContext.Provider
      value={{
        students,
        filteredStudents,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        isLoading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

