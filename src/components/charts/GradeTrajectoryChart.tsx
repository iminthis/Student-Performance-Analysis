'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';

export default function GradeTrajectoryChart() {
  const { filteredStudents } = useData();
  const [showMeanOnly, setShowMeanOnly] = useState(false);

  const { trajectories, meanTrajectory, trajectoryStats } = useMemo(() => {
    // Create trajectory for each student
    const allTrajectories = filteredStudents.map((s) => ({
      id: s.id,
      data: [
        { period: 'G1', grade: s.G1 },
        { period: 'G2', grade: s.G2 },
        { period: 'G3', grade: s.G3 },
      ],
      trend: s.G3 - s.G1,
      color: s.G3 >= s.G1 ? '#4ECDC4' : '#FF6B6B',
    }));

    // Calculate mean trajectory
    const g1Mean = filteredStudents.reduce((sum, s) => sum + s.G1, 0) / filteredStudents.length;
    const g2Mean = filteredStudents.reduce((sum, s) => sum + s.G2, 0) / filteredStudents.length;
    const g3Mean = filteredStudents.reduce((sum, s) => sum + s.G3, 0) / filteredStudents.length;

    const meanData = [
      { period: 'G1', grade: g1Mean },
      { period: 'G2', grade: g2Mean },
      { period: 'G3', grade: g3Mean },
    ];

    // Calculate trajectory statistics
    const improving = filteredStudents.filter(s => s.G3 > s.G1).length;
    const declining = filteredStudents.filter(s => s.G3 < s.G1).length;
    const stable = filteredStudents.filter(s => s.G3 === s.G1).length;
    const crashers = filteredStudents.filter(s => (s.G2 - s.G3) >= 4).length; // Sharp final drop

    return {
      trajectories: allTrajectories,
      meanTrajectory: meanData,
      trajectoryStats: { improving, declining, stable, crashers },
    };
  }, [filteredStudents]);

  // Sample trajectories for individual lines (limit to 50 for performance)
  const sampledTrajectories = useMemo(() => {
    if (trajectories.length <= 50) return trajectories;
    const step = Math.floor(trajectories.length / 50);
    return trajectories.filter((_, i) => i % step === 0).slice(0, 50);
  }, [trajectories]);

  if (filteredStudents.length === 0) {
    return (
      <ChartWrapper
        id="trajectories"
        title="Grade Trajectories Across Periods"
        howToRead="Lines show individual student progression from G1 → G2 → G3."
        takeaway="No data available for current filters."
      >
        <EmptyState />
      </ChartWrapper>
    );
  }

  // Flatten data for the chart
  const chartData = [
    { period: 'G1', mean: meanTrajectory[0].grade },
    { period: 'G2', mean: meanTrajectory[1].grade },
    { period: 'G3', mean: meanTrajectory[2].grade },
  ];

  return (
    <ChartWrapper
      id="trajectories"
      title="Grade Trajectories: G1 → G2 → G3"
      howToRead="Each thin line represents one student's progression across three grading periods. Green lines show improvement, red lines show decline. The thick white line shows the class mean."
      takeaway={`Many students show relatively stable trajectories, but ${trajectoryStats.crashers} students (${((trajectoryStats.crashers / filteredStudents.length) * 100).toFixed(0)}%) experienced sharp drops of 4+ points in the final period—suggesting late-semester challenges or disengagement.`}
      statsNote={`Trajectory breakdown: ${trajectoryStats.improving} improved (${((trajectoryStats.improving / filteredStudents.length) * 100).toFixed(0)}%), ${trajectoryStats.declining} declined (${((trajectoryStats.declining / filteredStudents.length) * 100).toFixed(0)}%), ${trajectoryStats.stable} stable (${((trajectoryStats.stable / filteredStudents.length) * 100).toFixed(0)}%).`}
    >
      {/* Toggle control */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowMeanOnly(!showMeanOnly)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            showMeanOnly 
              ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30' 
              : 'bg-slate-800/50 text-gray-400 border border-slate-700'
          }`}
        >
          {showMeanOnly ? 'Show Individual Lines' : 'Show Mean Only'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
          <XAxis dataKey="period" stroke="#6b7280" />
          <YAxis domain={[0, 20]} stroke="#6b7280" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="tooltip">
                  <p className="font-semibold">{label}</p>
                  <p>Mean: {payload[0]?.value?.toFixed(1)}</p>
                </div>
              );
            }}
          />
          <ReferenceLine y={10} stroke="#4ECDC4" strokeDasharray="5 5" label={{ value: 'Pass', fill: '#4ECDC4', position: 'right' }} />

          {/* Individual student lines */}
          {!showMeanOnly && sampledTrajectories.map((traj) => (
            <Line
              key={traj.id}
              type="monotone"
              data={traj.data}
              dataKey="grade"
              stroke={traj.color}
              strokeWidth={1}
              strokeOpacity={0.3}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {/* Mean line */}
          <Line
            type="monotone"
            dataKey="mean"
            stroke="#fff"
            strokeWidth={3}
            dot={{ fill: '#fff', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Trajectory stats grid */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="text-center p-4 bg-accent-teal/10 rounded-lg border border-accent-teal/30">
          <div className="text-3xl font-bold text-accent-teal">{trajectoryStats.improving}</div>
          <div className="text-sm text-gray-400">Improved</div>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-3xl font-bold text-gray-300">{trajectoryStats.stable}</div>
          <div className="text-sm text-gray-400">Stable</div>
        </div>
        <div className="text-center p-4 bg-accent-coral/10 rounded-lg border border-accent-coral/30">
          <div className="text-3xl font-bold text-accent-coral">{trajectoryStats.declining}</div>
          <div className="text-sm text-gray-400">Declined</div>
        </div>
        <div className="text-center p-4 bg-accent-purple/10 rounded-lg border border-accent-purple/30">
          <div className="text-3xl font-bold text-accent-purple">{trajectoryStats.crashers}</div>
          <div className="text-sm text-gray-400">Sharp Drop (4+)</div>
        </div>
      </div>
    </ChartWrapper>
  );
}

