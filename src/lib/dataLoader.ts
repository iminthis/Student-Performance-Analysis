import Papa from 'papaparse';
import type { RawStudentData, Student, FilterState } from '@/types/student';

// Parse CSV and transform to typed Student array
export async function loadStudentData(): Promise<Student[]> {
  try {
    const response = await fetch('/data/student-mat.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse<RawStudentData>(csvText, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results) => {
          const students = results.data
            .map((row, index) => parseStudent(row, index))
            .filter((s): s is Student => s !== null);
          resolve(students);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Failed to load student data:', error);
    throw error;
  }
}

// Parse a single row into a Student object
function parseStudent(raw: RawStudentData, index: number): Student | null {
  try {
    // Clean quoted strings
    const clean = (val: string) => val?.replace(/^"|"$/g, '') || '';
    
    return {
      id: index + 1,
      school: clean(raw.school) as 'GP' | 'MS',
      sex: clean(raw.sex) as 'M' | 'F',
      age: parseInt(clean(raw.age)) || 0,
      address: clean(raw.address) as 'U' | 'R',
      famsize: clean(raw.famsize) as 'LE3' | 'GT3',
      Pstatus: clean(raw.Pstatus) as 'T' | 'A',
      Medu: parseInt(clean(raw.Medu)) || 0,
      Fedu: parseInt(clean(raw.Fedu)) || 0,
      Mjob: clean(raw.Mjob),
      Fjob: clean(raw.Fjob),
      reason: clean(raw.reason),
      guardian: clean(raw.guardian) as 'mother' | 'father' | 'other',
      traveltime: parseInt(clean(raw.traveltime)) || 1,
      studytime: parseInt(clean(raw.studytime)) || 1,
      failures: parseInt(clean(raw.failures)) || 0,
      schoolsup: clean(raw.schoolsup) === 'yes',
      famsup: clean(raw.famsup) === 'yes',
      paid: clean(raw.paid) === 'yes',
      activities: clean(raw.activities) === 'yes',
      nursery: clean(raw.nursery) === 'yes',
      higher: clean(raw.higher) === 'yes',
      internet: clean(raw.internet) === 'yes',
      romantic: clean(raw.romantic) === 'yes',
      famrel: parseInt(clean(raw.famrel)) || 3,
      freetime: parseInt(clean(raw.freetime)) || 3,
      goout: parseInt(clean(raw.goout)) || 3,
      Dalc: parseInt(clean(raw.Dalc)) || 1,
      Walc: parseInt(clean(raw.Walc)) || 1,
      health: parseInt(clean(raw.health)) || 3,
      absences: parseInt(clean(raw.absences)) || 0,
      G1: parseInt(clean(raw.G1)) || 0,
      G2: parseInt(clean(raw.G2)) || 0,
      G3: parseInt(clean(raw.G3)) || 0,
    };
  } catch (error) {
    console.warn(`Failed to parse student at index ${index}:`, error);
    return null;
  }
}

// Apply filters to student data
export function filterStudents(students: Student[], filters: FilterState): Student[] {
  return students.filter((student) => {
    if (filters.sex !== 'all' && student.sex !== filters.sex) return false;
    if (filters.school !== 'all' && student.school !== filters.school) return false;
    if (filters.address !== 'all' && student.address !== filters.address) return false;
    if (filters.higher !== 'all') {
      const hasHigher = student.higher;
      if (filters.higher === 'yes' && !hasHigher) return false;
      if (filters.higher === 'no' && hasHigher) return false;
    }
    return true;
  });
}

// Get default filter state
export function getDefaultFilters(): FilterState {
  return {
    sex: 'all',
    school: 'all',
    address: 'all',
    higher: 'all',
  };
}

// Calculate summary statistics
export function calculateStats(values: number[]): {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
} {
  if (values.length === 0) {
    return { mean: 0, median: 0, std: 0, min: 0, max: 0, q1: 0, q3: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  
  return {
    mean,
    median,
    std,
    min: sorted[0],
    max: sorted[n - 1],
    q1: sorted[q1Index],
    q3: sorted[q3Index],
  };
}

// Group students by a category
export function groupBy<T extends Student, K extends keyof T>(
  students: T[],
  key: K
): Map<T[K], T[]> {
  const groups = new Map<T[K], T[]>();
  
  for (const student of students) {
    const value = student[key];
    const existing = groups.get(value) || [];
    existing.push(student);
    groups.set(value, existing);
  }
  
  return groups;
}

// Calculate Spearman correlation
export function spearmanCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  
  // Rank the values
  const rankX = getRanks(x);
  const rankY = getRanks(y);
  
  // Calculate correlation of ranks
  const meanX = rankX.reduce((a, b) => a + b, 0) / n;
  const meanY = rankY.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = rankX[i] - meanX;
    const dy = rankY[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  
  const denominator = Math.sqrt(denomX * denomY);
  return denominator === 0 ? 0 : numerator / denominator;
}

function getRanks(values: number[]): number[] {
  const sorted = values.map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value);
  
  const ranks = new Array(values.length);
  
  for (let i = 0; i < sorted.length; i++) {
    // Handle ties by averaging ranks
    let j = i;
    while (j < sorted.length - 1 && sorted[j].value === sorted[j + 1].value) {
      j++;
    }
    const avgRank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) {
      ranks[sorted[k].index] = avgRank;
    }
    i = j;
  }
  
  return ranks;
}

// Calculate one-way ANOVA F-statistic
export function anovaFTest(groups: number[][]): { f: number; pApprox: string } {
  const allValues: number[] = [];
  groups.forEach(g => allValues.push(...g));
  
  const grandMean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  const k = groups.length;
  const n = allValues.length;
  
  // Between-group sum of squares
  let ssBetween = 0;
  for (const group of groups) {
    if (group.length === 0) continue;
    const groupMean = group.reduce((a, b) => a + b, 0) / group.length;
    ssBetween += group.length * Math.pow(groupMean - grandMean, 2);
  }
  
  // Within-group sum of squares
  let ssWithin = 0;
  for (const group of groups) {
    if (group.length === 0) continue;
    const groupMean = group.reduce((a, b) => a + b, 0) / group.length;
    for (const value of group) {
      ssWithin += Math.pow(value - groupMean, 2);
    }
  }
  
  const dfBetween = k - 1;
  const dfWithin = n - k;
  
  if (dfWithin <= 0 || dfBetween <= 0) {
    return { f: 0, pApprox: 'N/A' };
  }
  
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  
  const f = msWithin === 0 ? 0 : msBetween / msWithin;
  
  // Approximate p-value interpretation
  let pApprox = 'p > 0.05';
  if (f > 3.0) pApprox = 'p < 0.05';
  if (f > 5.0) pApprox = 'p < 0.01';
  if (f > 10.0) pApprox = 'p < 0.001';
  
  return { f, pApprox };
}

