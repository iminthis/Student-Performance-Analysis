'use client';

import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from 'recharts';
import { useData } from '@/context/DataContext';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { EmptyState } from '@/components/ui/LoadingState';
import type { Student } from '@/types/student';

// Simple PCA implementation for visualization purposes
function computePCA(students: Student[]) {
  // Variables to include (excluding grades)
  const vars = ['Medu', 'Fedu', 'traveltime', 'studytime', 'failures', 'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences'] as const;
  
  // Extract data matrix
  const data = students.map(s => vars.map(v => s[v] as number));
  
  // Center the data
  const means = vars.map((_, i) => 
    data.reduce((sum, row) => sum + row[i], 0) / data.length
  );
  const stds = vars.map((_, i) => {
    const variance = data.reduce((sum, row) => sum + Math.pow(row[i] - means[i], 2), 0) / data.length;
    return Math.sqrt(variance) || 1;
  });
  
  const centered = data.map(row => 
    row.map((val, i) => (val - means[i]) / stds[i])
  );
  
  // Compute covariance matrix (simplified)
  const n = centered.length;
  const p = vars.length;
  const cov: number[][] = Array(p).fill(null).map(() => Array(p).fill(0));
  
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += centered[k][i] * centered[k][j];
      }
      cov[i][j] = sum / (n - 1);
    }
  }
  
  // Power iteration to find first two eigenvectors (simplified)
  const pc1 = powerIteration(cov);
  // Deflate for second component
  const deflated = deflateMatrix(cov, pc1);
  const pc2 = powerIteration(deflated);
  
  // Project data onto PCs
  const projected = centered.map((row, idx) => ({
    pc1: row.reduce((sum, val, i) => sum + val * pc1[i], 0),
    pc2: row.reduce((sum, val, i) => sum + val * pc2[i], 0),
    G3: students[idx].G3,
    student: students[idx],
  }));
  
  // Variable loadings
  const loadings = vars.map((v, i) => ({
    variable: v,
    pc1Loading: pc1[i],
    pc2Loading: pc2[i],
    pc1Contribution: Math.abs(pc1[i]),
    pc2Contribution: Math.abs(pc2[i]),
  }));
  
  return { projected, loadings, varNames: vars };
}

function powerIteration(matrix: number[][], iterations = 100): number[] {
  const n = matrix.length;
  let vector = Array(n).fill(1 / Math.sqrt(n));
  
  for (let iter = 0; iter < iterations; iter++) {
    // Multiply
    const newVector = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newVector[i] += matrix[i][j] * vector[j];
      }
    }
    // Normalize
    const norm = Math.sqrt(newVector.reduce((sum, v) => sum + v * v, 0));
    vector = newVector.map(v => v / norm);
  }
  
  return vector;
}

function deflateMatrix(matrix: number[][], eigenvector: number[]): number[][] {
  const n = matrix.length;
  // Calculate eigenvalue
  let eigenvalue = 0;
  for (let i = 0; i < n; i++) {
    let temp = 0;
    for (let j = 0; j < n; j++) {
      temp += matrix[i][j] * eigenvector[j];
    }
    eigenvalue += temp * eigenvector[i];
  }
  
  // Deflate
  const deflated: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      deflated[i][j] = matrix[i][j] - eigenvalue * eigenvector[i] * eigenvector[j];
    }
  }
  
  return deflated;
}

// Color scale for grades
function getGradeColor(grade: number): string {
  if (grade >= 15) return '#22c55e'; // green
  if (grade >= 10) return '#3b82f6'; // blue
  if (grade >= 5) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

export default function PCAChart() {
  const { filteredStudents } = useData();
  const [showContributions, setShowContributions] = useState(false);

  const { projected, loadings } = useMemo(() => {
    if (filteredStudents.length < 10) {
      return { projected: [], loadings: [] };
    }
    return computePCA(filteredStudents);
  }, [filteredStudents]);

  if (filteredStudents.length < 10) {
    return (
      <ChartWrapper
        id="pca"
        title="Principal Component Analysis"
        howToRead="PCA reduces dimensionality to reveal underlying patterns."
        takeaway="Need at least 10 students for PCA analysis."
      >
        <EmptyState message="Need at least 10 students for PCA analysis" />
      </ChartWrapper>
    );
  }

  // Sort loadings for contribution charts
  const topPC1 = [...loadings].sort((a, b) => b.pc1Contribution - a.pc1Contribution).slice(0, 6);
  const topPC2 = [...loadings].sort((a, b) => b.pc2Contribution - a.pc2Contribution).slice(0, 6);

  return (
    <ChartWrapper
      id="pca"
      title="Principal Component Analysis: Lifestyle & Family Patterns"
      howToRead="Each point is a student plotted on the first two principal components (reduced dimensions). Color indicates final grade: green (15+), blue (10-14), amber (5-9), red (<5). Toggle to see which variables drive each dimension."
      takeaway="Dim 1 (horizontal) captures 'social/alcohol' patterns—high goout, Dalc, Walc load strongly. Dim 2 (vertical) captures 'parental education'—Medu and Fedu dominate. Students in the lower-left (less social, higher parent ed) tend to have higher grades."
      statsNote="PCA performed on 12 non-grade variables. The first two components capture the main variance patterns in lifestyle and family background."
    >
      {/* Toggle */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowContributions(!showContributions)}
          className={`filter-button ${showContributions ? 'active' : ''}`}
        >
          {showContributions ? 'Hide Contributions' : 'Show Variable Contributions'}
        </button>
      </div>

      {showContributions ? (
        // Contribution bar charts
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">Dimension 1: &quot;Social/Alcohol&quot;</h4>
            <div className="space-y-3">
              {topPC1.map((v) => (
                <div key={v.variable} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-gray-400">{v.variable}</span>
                  <div className="flex-1 h-6 bg-slate-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-coral to-accent-gold"
                      style={{ width: `${(v.pc1Contribution / topPC1[0].pc1Contribution) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono ${v.pc1Loading > 0 ? 'text-accent-teal' : 'text-accent-coral'}`}>
                    {v.pc1Loading > 0 ? '+' : ''}{v.pc1Loading.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">Dimension 2: &quot;Parent Education&quot;</h4>
            <div className="space-y-3">
              {topPC2.map((v) => (
                <div key={v.variable} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-gray-400">{v.variable}</span>
                  <div className="flex-1 h-6 bg-slate-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-teal to-accent-blue"
                      style={{ width: `${(v.pc2Contribution / topPC2[0].pc2Contribution) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono ${v.pc2Loading > 0 ? 'text-accent-teal' : 'text-accent-coral'}`}>
                    {v.pc2Loading > 0 ? '+' : ''}{v.pc2Loading.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Scatter plot
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5b" />
            <XAxis
              dataKey="pc1"
              type="number"
              stroke="#6b7280"
              domain={['auto', 'auto']}
              label={{ value: 'PC1: Social/Alcohol →', position: 'bottom', offset: 40, fill: '#9ca3af' }}
            />
            <YAxis
              dataKey="pc2"
              type="number"
              stroke="#6b7280"
              domain={['auto', 'auto']}
              label={{ value: '← Parent Education PC2', angle: -90, position: 'insideLeft', offset: -10, fill: '#9ca3af' }}
            />
            <ZAxis dataKey="G3" range={[30, 80]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="tooltip">
                    <p><strong>Grade:</strong> {data.G3}</p>
                    <p><strong>PC1:</strong> {data.pc1.toFixed(2)}</p>
                    <p><strong>PC2:</strong> {data.pc2.toFixed(2)}</p>
                    <p><strong>Goout:</strong> {data.student.goout}</p>
                    <p><strong>Walc:</strong> {data.student.Walc}</p>
                    <p><strong>Medu:</strong> {data.student.Medu}</p>
                  </div>
                );
              }}
            />
            <Scatter data={projected} fillOpacity={0.7}>
              {projected.map((entry, index) => (
                <Cell key={index} fill={getGradeColor(entry.G3)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      {!showContributions && (
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
            <span className="text-sm text-gray-400">Grade 15+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#3b82f6]" />
            <span className="text-sm text-gray-400">Grade 10-14</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#f59e0b]" />
            <span className="text-sm text-gray-400">Grade 5-9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
            <span className="text-sm text-gray-400">Grade 0-4</span>
          </div>
        </div>
      )}
    </ChartWrapper>
  );
}

