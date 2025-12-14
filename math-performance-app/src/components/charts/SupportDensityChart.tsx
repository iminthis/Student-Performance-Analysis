'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';

// Create density estimation (simple kernel density)
function createDensity(values: number[], bandwidth = 1.5): { x: number; density: number }[] {
  if (values.length === 0) return [];
  
  const min = 0;
  const max = 20;
  const step = 0.5;
  const points: { x: number; density: number }[] = [];

  for (let x = min; x <= max; x += step) {
    let density = 0;
    for (const val of values) {
      // Gaussian kernel
      const z = (x - val) / bandwidth;
      density += Math.exp(-0.5 * z * z) / (bandwidth * Math.sqrt(2 * Math.PI));
    }
    density /= values.length;
    points.push({ x, density });
  }

  return points;
}

export default function SupportDensityChart() {
  const { filteredStudents } = useData();

  const { chartData, groupStats } = useMemo(() => {
    // Group students by school support and family support
    const groups = {
      schoolYesFamYes: filteredStudents.filter(s => s.schoolsup && s.famsup).map(s => s.G3),
      schoolYesFamNo: filteredStudents.filter(s => s.schoolsup && !s.famsup).map(s => s.G3),
      schoolNoFamYes: filteredStudents.filter(s => !s.schoolsup && s.famsup).map(s => s.G3),
      schoolNoFamNo: filteredStudents.filter(s => !s.schoolsup && !s.famsup).map(s => s.G3),
    };

    // Create densities
    const densities = {
      schoolYesFamYes: createDensity(groups.schoolYesFamYes),
      schoolYesFamNo: createDensity(groups.schoolYesFamNo),
      schoolNoFamYes: createDensity(groups.schoolNoFamYes),
      schoolNoFamNo: createDensity(groups.schoolNoFamNo),
    };

    // Combine into chart data
    const combined: { x: number; yy?: number; yn?: number; ny?: number; nn?: number }[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = i * 0.5;
      combined.push({
        x,
        yy: densities.schoolYesFamYes[i]?.density || 0,
        yn: densities.schoolYesFamNo[i]?.density || 0,
        ny: densities.schoolNoFamYes[i]?.density || 0,
        nn: densities.schoolNoFamNo[i]?.density || 0,
      });
    }

    // Stats for each group
    const stats = {
      schoolYesFamYes: {
        count: groups.schoolYesFamYes.length,
        mean: groups.schoolYesFamYes.length > 0 
          ? groups.schoolYesFamYes.reduce((a, b) => a + b, 0) / groups.schoolYesFamYes.length 
          : 0,
      },
      schoolYesFamNo: {
        count: groups.schoolYesFamNo.length,
        mean: groups.schoolYesFamNo.length > 0 
          ? groups.schoolYesFamNo.reduce((a, b) => a + b, 0) / groups.schoolYesFamNo.length 
          : 0,
      },
      schoolNoFamYes: {
        count: groups.schoolNoFamYes.length,
        mean: groups.schoolNoFamYes.length > 0 
          ? groups.schoolNoFamYes.reduce((a, b) => a + b, 0) / groups.schoolNoFamYes.length 
          : 0,
      },
      schoolNoFamNo: {
        count: groups.schoolNoFamNo.length,
        mean: groups.schoolNoFamNo.length > 0 
          ? groups.schoolNoFamNo.reduce((a, b) => a + b, 0) / groups.schoolNoFamNo.length 
          : 0,
      },
    };

    return { chartData: combined, groupStats: stats };
  }, [filteredStudents]);

  if (filteredStudents.length === 0) {
    return (
      <ChartWrapper
        id="support-density"
        title="Support Systems and Grade Distribution"
        howToRead="Density plots showing grade distributions by support type."
        takeaway="No data available for current filters."
      >
        <EmptyState />
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      id="support-density"
      title="School Support vs Family Support: Grade Distributions"
      howToRead="Each curve shows the distribution of final grades for students with different combinations of school and family educational support. Higher curves indicate more students at that grade level."
      takeaway="Students receiving school support tend to have lower grade distributions—likely reflecting selection effects (struggling students are more likely to receive intervention). Family support shows a more positive association with grades."
      statsNote="Caveat: School support is often reactive (given to struggling students), so the negative correlation doesn't imply causation. This is a classic example of selection bias in educational interventions."
    >
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
          <XAxis
            dataKey="x"
            stroke="#6b7280"
            label={{ value: 'Final Grade (G3)', position: 'bottom', offset: 20, fill: '#9ca3af' }}
          />
          <YAxis
            stroke="#6b7280"
            label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="tooltip">
                  <p className="font-semibold">Grade: {label}</p>
                  {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color }}>
                      {p.name}: {(p.value as number).toFixed(4)}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend verticalAlign="top" height={36} />
          
          <Area
            type="monotone"
            dataKey="yy"
            name="School: Yes, Family: Yes"
            stroke="#4ECDC4"
            fill="#4ECDC4"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="yn"
            name="School: Yes, Family: No"
            stroke="#FF6B6B"
            fill="#FF6B6B"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="ny"
            name="School: No, Family: Yes"
            stroke="#3498DB"
            fill="#3498DB"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="nn"
            name="School: No, Family: No"
            stroke="#9B59B6"
            fill="#9B59B6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Group summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#4ECDC4]/10 border border-[#4ECDC4]/30">
          <div className="text-sm text-[#4ECDC4] mb-1">School + Family Support</div>
          <div className="font-mono text-xl text-white">{groupStats.schoolYesFamYes.mean.toFixed(1)}</div>
          <div className="text-xs text-gray-500">n = {groupStats.schoolYesFamYes.count}</div>
        </div>
        <div className="p-4 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/30">
          <div className="text-sm text-[#FF6B6B] mb-1">School Only</div>
          <div className="font-mono text-xl text-white">{groupStats.schoolYesFamNo.mean.toFixed(1)}</div>
          <div className="text-xs text-gray-500">n = {groupStats.schoolYesFamNo.count}</div>
        </div>
        <div className="p-4 rounded-lg bg-[#3498DB]/10 border border-[#3498DB]/30">
          <div className="text-sm text-[#3498DB] mb-1">Family Only</div>
          <div className="font-mono text-xl text-white">{groupStats.schoolNoFamYes.mean.toFixed(1)}</div>
          <div className="text-xs text-gray-500">n = {groupStats.schoolNoFamYes.count}</div>
        </div>
        <div className="p-4 rounded-lg bg-[#9B59B6]/10 border border-[#9B59B6]/30">
          <div className="text-sm text-[#9B59B6] mb-1">No Support</div>
          <div className="font-mono text-xl text-white">{groupStats.schoolNoFamNo.mean.toFixed(1)}</div>
          <div className="text-xs text-gray-500">n = {groupStats.schoolNoFamNo.count}</div>
        </div>
      </div>
    </ChartWrapper>
  );
}

