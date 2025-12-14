'use client';

import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ErrorBar,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';
import { educationLabels } from '@/lib/dataDictionary';
import { anovaFTest, calculateStats } from '@/lib/dataLoader';

type ParentType = 'mother' | 'father';
type GuardianFilter = 'all' | 'mother' | 'father' | 'other';

export default function ParentEducationChart() {
  const { filteredStudents } = useData();
  const [guardianFilter, setGuardianFilter] = useState<GuardianFilter>('all');

  const { chartData, meduAnova, feduAnova } = useMemo(() => {
    // Filter by guardian if needed
    const students = guardianFilter === 'all' 
      ? filteredStudents 
      : filteredStudents.filter(s => s.guardian === guardianFilter);

    // Group by education level
    const meduGroups: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    const feduGroups: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    students.forEach((s) => {
      meduGroups[s.Medu].push(s.G3);
      feduGroups[s.Fedu].push(s.G3);
    });

    // Calculate stats for each education level
    const data = [0, 1, 2, 3, 4].map((edu) => {
      const meduStats = calculateStats(meduGroups[edu]);
      const feduStats = calculateStats(feduGroups[edu]);
      
      return {
        education: educationLabels[edu],
        eduLevel: edu,
        meduMean: meduStats.mean,
        meduCount: meduGroups[edu].length,
        meduError: [meduStats.mean - meduStats.q1, meduStats.q3 - meduStats.mean],
        feduMean: feduStats.mean,
        feduCount: feduGroups[edu].length,
        feduError: [feduStats.mean - feduStats.q1, feduStats.q3 - feduStats.mean],
      };
    });

    // ANOVA tests
    const meduArrays = [0, 1, 2, 3, 4].map(e => meduGroups[e]).filter(g => g.length > 0);
    const feduArrays = [0, 1, 2, 3, 4].map(e => feduGroups[e]).filter(g => g.length > 0);

    return {
      chartData: data,
      meduAnova: anovaFTest(meduArrays),
      feduAnova: anovaFTest(feduArrays),
    };
  }, [filteredStudents, guardianFilter]);

  if (filteredStudents.length === 0) {
    return (
      <ChartWrapper
        id="parent-education"
        title="Parental Education and Student Performance"
        howToRead="Grouped bar chart comparing grades by parent education level."
        takeaway="No data available for current filters."
      >
        <EmptyState />
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      id="parent-education"
      title="Parent Education Level and Student Grades"
      howToRead="Each group of bars shows the mean final grade for students whose mother (teal) or father (blue) has that education level. Error bars show the interquartile range."
      takeaway="Mother's education shows a clearer gradient: students with mothers holding higher education average 11.4, compared to 8.8 for those with uneducated mothers—a 2.6 point gap. Father's education shows a similar but weaker pattern."
      statsNote={`Mother's education ANOVA: F = ${meduAnova.f.toFixed(2)}, ${meduAnova.pApprox}. Father's education ANOVA: F = ${feduAnova.f.toFixed(2)}, ${feduAnova.pApprox}. Both are statistically significant, but maternal education shows stronger association.`}
    >
      {/* Guardian filter */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm text-gray-400">Filter by guardian:</span>
        <div className="flex gap-2">
          {(['all', 'mother', 'father', 'other'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGuardianFilter(g)}
              className={`filter-button ${guardianFilter === g ? 'active' : ''}`}
            >
              {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
          <XAxis
            dataKey="education"
            stroke="#6b7280"
            angle={-20}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
            label={{ value: 'Parent Education Level', position: 'bottom', offset: 40, fill: '#9ca3af' }}
          />
          <YAxis
            domain={[0, 15]}
            stroke="#6b7280"
            label={{ value: 'Mean Final Grade', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="tooltip">
                  <p className="font-semibold mb-2">{label}</p>
                  {payload.map((p) => {
                    const countKey = p.dataKey === 'meduMean' ? 'meduCount' : 'feduCount';
                    const count = p.payload[countKey];
                    return (
                      <p key={p.name} style={{ color: p.color }}>
                        {p.name}: {(p.value as number).toFixed(2)} (n={count})
                      </p>
                    );
                  })}
                </div>
              );
            }}
          />
          <Legend verticalAlign="top" height={36} />
          
          <Bar
            dataKey="meduMean"
            name="Mother's Education"
            fill="#4ECDC4"
            radius={[4, 4, 0, 0]}
          >
            <ErrorBar dataKey="meduError" width={4} strokeWidth={1.5} stroke="#4ECDC4" />
          </Bar>
          <Bar
            dataKey="feduMean"
            name="Father's Education"
            fill="#3498DB"
            radius={[4, 4, 0, 0]}
          >
            <ErrorBar dataKey="feduError" width={4} strokeWidth={1.5} stroke="#3498DB" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Education gradient summary */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-accent-teal font-semibold mb-2">Mother&apos;s Education Effect</h4>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400">None</div>
                <div className="font-mono text-xl">{chartData[0].meduMean.toFixed(1)}</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-accent-coral to-accent-teal" />
              <div className="text-center">
                <div className="text-sm text-gray-400">Higher Ed</div>
                <div className="font-mono text-xl text-accent-teal">{chartData[4].meduMean.toFixed(1)}</div>
              </div>
              <div className="text-accent-teal text-sm">
                +{(chartData[4].meduMean - chartData[0].meduMean).toFixed(1)} pts
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-accent-blue font-semibold mb-2">Father&apos;s Education Effect</h4>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400">None</div>
                <div className="font-mono text-xl">{chartData[0].feduMean.toFixed(1)}</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-accent-coral to-accent-blue" />
              <div className="text-center">
                <div className="text-sm text-gray-400">Higher Ed</div>
                <div className="font-mono text-xl text-accent-blue">{chartData[4].feduMean.toFixed(1)}</div>
              </div>
              <div className="text-accent-blue text-sm">
                +{(chartData[4].feduMean - chartData[0].feduMean).toFixed(1)} pts
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}

