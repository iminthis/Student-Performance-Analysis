'use client';

import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';
import { educationLabels, studytimeLabels } from '@/lib/dataDictionary';

const COLORS = {
  0: '#ef4444', // red - none
  1: '#f97316', // orange - primary
  2: '#eab308', // yellow - middle
  3: '#22c55e', // green - secondary
  4: '#3b82f6', // blue - higher
};

export default function StudyTimeChart() {
  const { filteredStudents } = useData();

  // Prepare data grouped by mother's education
  const { chartData, meansByStudytime } = useMemo(() => {
    const data: Record<number, { studytime: number; G3: number; Medu: number; count: number }[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [],
    };

    // Add jitter to avoid overlapping points
    filteredStudents.forEach((s) => {
      const jitterX = (Math.random() - 0.5) * 0.3;
      const jitterY = (Math.random() - 0.5) * 0.5;
      data[s.Medu].push({
        studytime: s.studytime + jitterX,
        G3: s.G3 + jitterY,
        Medu: s.Medu,
        count: 1,
      });
    });

    // Calculate means by study time for trend line
    const means: { studytime: number; mean: number }[] = [];
    [1, 2, 3, 4].forEach((st) => {
      const students = filteredStudents.filter(s => s.studytime === st);
      if (students.length > 0) {
        const mean = students.reduce((sum, s) => sum + s.G3, 0) / students.length;
        means.push({ studytime: st, mean });
      }
    });

    return { chartData: data, meansByStudytime: means };
  }, [filteredStudents]);

  if (filteredStudents.length === 0) {
    return (
      <ChartWrapper
        id="study-time"
        title="Study Time vs Final Grade"
        howToRead="Each point represents a student, colored by mother's education level."
        takeaway="No data available for current filters."
      >
        <EmptyState />
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      id="study-time"
      title="Study Time vs Final Grade by Mother's Education"
      howToRead="Each dot represents a student, positioned by weekly study time (x-axis) and final grade (y-axis). Colors indicate mother's education level from none (red) to higher education (blue)."
      takeaway="Higher study time generally correlates with better grades, but the relationship is non-linear. Students with highly educated mothers (blue) tend to cluster in higher grade ranges regardless of study time, suggesting parental education provides academic advantages beyond direct study effort."
      statsNote="Trend shows diminishing returns: moving from <2 hours to 2-5 hours yields larger gains than 5-10 hours to >10 hours."
    >
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
          <XAxis
            dataKey="studytime"
            type="number"
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(v) => studytimeLabels[v] || v}
            stroke="#6b7280"
            label={{ value: 'Weekly Study Time', position: 'bottom', offset: 40, fill: '#9ca3af' }}
          />
          <YAxis
            dataKey="G3"
            domain={[0, 20]}
            stroke="#6b7280"
            label={{ value: 'Final Grade (G3)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="tooltip">
                  <p><strong>Grade:</strong> {Math.round(data.G3)}</p>
                  <p><strong>Study Time:</strong> {studytimeLabels[Math.round(data.studytime)]}</p>
                  <p><strong>Mother&apos;s Ed:</strong> {educationLabels[data.Medu]}</p>
                </div>
              );
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
          />
          
          {/* Scatter plots by education level */}
          {[0, 1, 2, 3, 4].map((edu) => (
            <Scatter
              key={edu}
              name={educationLabels[edu]}
              data={chartData[edu]}
              fill={COLORS[edu as keyof typeof COLORS]}
              fillOpacity={0.7}
            />
          ))}

          {/* Mean reference line */}
          <ReferenceLine y={10} stroke="#4ECDC4" strokeDasharray="5 5" label={{ value: 'Pass', fill: '#4ECDC4', position: 'right' }} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Trend summary below chart */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {meansByStudytime.map(({ studytime, mean }) => (
          <div key={studytime} className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">{studytimeLabels[studytime]}</div>
            <div className="font-mono text-lg text-white">{mean.toFixed(1)}</div>
            <div className="text-xs text-gray-500">avg grade</div>
          </div>
        ))}
      </div>
    </ChartWrapper>
  );
}

