'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';
import { scaleLabels } from '@/lib/dataDictionary';
import { spearmanCorrelation, calculateStats } from '@/lib/dataLoader';

const DALC_COLOR = '#9B59B6';
const WALC_COLOR = '#E74C3C';

export default function AlcoholChart() {
  const { filteredStudents } = useData();

  const { dalcData, walcData, dalcRho, walcRho } = useMemo(() => {
    // Group by alcohol consumption levels
    const dalcGroups: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const walcGroups: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    filteredStudents.forEach((s) => {
      dalcGroups[s.Dalc].push(s.G3);
      walcGroups[s.Walc].push(s.G3);
    });

    // Calculate stats
    const dalc = [1, 2, 3, 4, 5].map((level) => {
      const stats = calculateStats(dalcGroups[level]);
      return {
        level,
        label: scaleLabels[level],
        mean: stats.mean,
        median: stats.median,
        q1: stats.q1,
        q3: stats.q3,
        min: stats.min,
        max: stats.max,
        count: dalcGroups[level].length,
      };
    });

    const walc = [1, 2, 3, 4, 5].map((level) => {
      const stats = calculateStats(walcGroups[level]);
      return {
        level,
        label: scaleLabels[level],
        mean: stats.mean,
        median: stats.median,
        q1: stats.q1,
        q3: stats.q3,
        min: stats.min,
        max: stats.max,
        count: walcGroups[level].length,
      };
    });

    // Spearman correlations
    const dalcValues = filteredStudents.map(s => s.Dalc);
    const walcValues = filteredStudents.map(s => s.Walc);
    const g3Values = filteredStudents.map(s => s.G3);

    const dalcSpearman = spearmanCorrelation(dalcValues, g3Values);
    const walcSpearman = spearmanCorrelation(walcValues, g3Values);

    return {
      dalcData: dalc,
      walcData: walc,
      dalcRho: dalcSpearman,
      walcRho: walcSpearman,
    };
  }, [filteredStudents]);

  if (filteredStudents.length === 0) {
    return (
      <ChartWrapper
        id="alcohol"
        title="Alcohol Consumption and Grades"
        howToRead="Box plots showing grade distributions by alcohol consumption level."
        takeaway="No data available for current filters."
      >
        <EmptyState />
      </ChartWrapper>
    );
  }

  // Combined chart data
  const chartData = [1, 2, 3, 4, 5].map((level) => ({
    level,
    label: scaleLabels[level],
    dalcMean: dalcData[level - 1].mean,
    walcMean: walcData[level - 1].mean,
    dalcCount: dalcData[level - 1].count,
    walcCount: walcData[level - 1].count,
  }));

  return (
    <ChartWrapper
      id="alcohol"
      title="Alcohol Consumption: Weekday vs Weekend"
      howToRead="Bars show mean final grade at each alcohol consumption level (1=Very Low to 5=Very High). Purple bars represent weekday (Dalc), red bars represent weekend (Walc) consumption."
      takeaway="Both weekday and weekend alcohol consumption show negative correlations with grades, but weekend alcohol (Walc) shows a stronger relationship (ρ = -0.17). Students with 'Very High' weekend drinking average 2+ points lower than those with 'Very Low'."
      statsNote={`Spearman ρ: Weekday alcohol (Dalc) = ${dalcRho.toFixed(3)}, Weekend alcohol (Walc) = ${walcRho.toFixed(3)}. Both correlations are negative, indicating higher alcohol consumption associates with lower grades.`}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            label={{ value: 'Alcohol Consumption Level', position: 'bottom', offset: 40, fill: '#9ca3af' }}
          />
          <YAxis
            domain={[0, 14]}
            stroke="#6b7280"
            label={{ value: 'Mean Final Grade', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="tooltip">
                  <p className="font-semibold mb-2">{label}</p>
                  {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color }}>
                      {p.name}: {(p.value as number).toFixed(2)}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend verticalAlign="top" height={36} />
          
          <Bar dataKey="dalcMean" name="Weekday (Dalc)" fill={DALC_COLOR} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fillOpacity={0.8 + (0.2 * entry.dalcCount / Math.max(...chartData.map(d => d.dalcCount)))} />
            ))}
          </Bar>
          <Bar dataKey="walcMean" name="Weekend (Walc)" fill={WALC_COLOR} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fillOpacity={0.8 + (0.2 * entry.walcCount / Math.max(...chartData.map(d => d.walcCount)))} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Correlation summary */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-[#9B59B6]/10 border border-[#9B59B6]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9B59B6] font-semibold">Weekday Alcohol (Dalc)</span>
            <span className="font-mono text-lg text-white">ρ = {dalcRho.toFixed(3)}</span>
          </div>
          <div className="text-sm text-gray-400">
            {dalcRho < -0.1 ? 'Weak negative correlation' : 'Very weak/no correlation'}
          </div>
          <div className="mt-2 flex gap-2 text-xs text-gray-500">
            {dalcData.map((d) => (
              <span key={d.level} className="bg-slate-800 px-2 py-1 rounded">
                L{d.level}: n={d.count}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-[#E74C3C]/10 border border-[#E74C3C]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#E74C3C] font-semibold">Weekend Alcohol (Walc)</span>
            <span className="font-mono text-lg text-white">ρ = {walcRho.toFixed(3)}</span>
          </div>
          <div className="text-sm text-gray-400">
            {walcRho < -0.15 ? 'Weak negative correlation' : walcRho < -0.1 ? 'Very weak negative correlation' : 'Very weak/no correlation'}
          </div>
          <div className="mt-2 flex gap-2 text-xs text-gray-500">
            {walcData.map((d) => (
              <span key={d.level} className="bg-slate-800 px-2 py-1 rounded">
                L{d.level}: n={d.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}

