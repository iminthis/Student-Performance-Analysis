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
  ErrorBar,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';
import { scaleLabels } from '@/lib/dataDictionary';
import { spearmanCorrelation, calculateStats, anovaFTest } from '@/lib/dataLoader';

const COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

export default function GoingOutChart() {
  const { filteredStudents } = useData();

  const { chartData, rho, anova } = useMemo(() => {
    // Group by going out levels
    const groups: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    filteredStudents.forEach((s) => {
      groups[s.goout].push(s.G3);
    });

    // Calculate stats
    const data = [1, 2, 3, 4, 5].map((level) => {
      const stats = calculateStats(groups[level]);
      return {
        level,
        label: scaleLabels[level],
        mean: stats.mean,
        median: stats.median,
        std: stats.std,
        q1: stats.q1,
        q3: stats.q3,
        min: stats.min,
        max: stats.max,
        count: groups[level].length,
        errorBar: [stats.mean - stats.q1, stats.q3 - stats.mean],
      };
    });

    // Spearman correlation
    const gooutValues = filteredStudents.map(s => s.goout);
    const g3Values = filteredStudents.map(s => s.G3);
    const spearman = spearmanCorrelation(gooutValues, g3Values);

    // ANOVA
    const groupArrays = [1, 2, 3, 4, 5].map(l => groups[l]).filter(g => g.length > 0);
    const anovaResult = anovaFTest(groupArrays);

    return { chartData: data, rho: spearman, anova: anovaResult };
  }, [filteredStudents]);

  if (filteredStudents.length === 0) {
    return (
      <ChartWrapper
        id="goout"
        title="Going Out Frequency and Grades"
        howToRead="Bar chart showing grade distributions by going out frequency."
        takeaway="No data available for current filters."
      >
        <EmptyState />
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      id="goout"
      title="Going Out with Friends vs Academic Performance"
      howToRead="Each bar shows the mean final grade for students at each level of going out frequency (1=Very Low to 5=Very High). Colors transition from green (low) to red (high). Error bars show the interquartile range."
      takeaway="The relationship is non-linear: moderate social activity (levels 2-3) shows the highest average grades, while both extremes (very low and very high going out) are associated with somewhat lower performance. Very high going out frequency (level 5) shows the steepest decline."
      statsNote={`Spearman ρ = ${rho.toFixed(3)} (weak negative). ANOVA: F = ${anova.f.toFixed(2)}, ${anova.pApprox}. The non-linear pattern suggests social engagement has complex effects on academic outcomes.`}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            label={{ value: 'Going Out Frequency', position: 'bottom', offset: 40, fill: '#9ca3af' }}
          />
          <YAxis
            domain={[0, 14]}
            stroke="#6b7280"
            label={{ value: 'Mean Final Grade', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="tooltip">
                  <p className="font-semibold mb-2">{data.label}</p>
                  <p><strong>Mean:</strong> {data.mean.toFixed(2)}</p>
                  <p><strong>Median:</strong> {data.median.toFixed(1)}</p>
                  <p><strong>Std Dev:</strong> {data.std.toFixed(2)}</p>
                  <p><strong>Range:</strong> {data.min} - {data.max}</p>
                  <p><strong>Students:</strong> {data.count}</p>
                </div>
              );
            }}
          />
          <ReferenceLine y={10} stroke="#4ECDC4" strokeDasharray="5 5" label={{ value: 'Pass', fill: '#4ECDC4', position: 'right' }} />
          
          <Bar dataKey="mean" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} fillOpacity={0.85} />
            ))}
            <ErrorBar dataKey="errorBar" width={6} strokeWidth={2} stroke="#fff" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-5 gap-2">
        {chartData.map((d, i) => (
          <div 
            key={d.level} 
            className="text-center p-3 rounded-lg"
            style={{ backgroundColor: `${COLORS[i]}20`, borderColor: `${COLORS[i]}40`, borderWidth: 1 }}
          >
            <div className="text-sm text-gray-400 mb-1">{d.label}</div>
            <div className="font-mono text-xl font-bold" style={{ color: COLORS[i] }}>
              {d.mean.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">n = {d.count}</div>
          </div>
        ))}
      </div>

      {/* Interpretation */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div className="text-sm text-gray-300">
            <strong className="text-white">Interpretation:</strong> While the overall correlation is weak (ρ = {rho.toFixed(2)}), 
            the pattern suggests a &quot;Goldilocks zone&quot; for social activity. Students who rarely go out may lack 
            important social connections, while those who go out very frequently may sacrifice study time. 
            Moderate engagement appears optimal.
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}

