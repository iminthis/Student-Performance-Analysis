// Raw student data from CSV
export interface RawStudentData {
  school: string;
  sex: string;
  age: string;
  address: string;
  famsize: string;
  Pstatus: string;
  Medu: string;
  Fedu: string;
  Mjob: string;
  Fjob: string;
  reason: string;
  guardian: string;
  traveltime: string;
  studytime: string;
  failures: string;
  schoolsup: string;
  famsup: string;
  paid: string;
  activities: string;
  nursery: string;
  higher: string;
  internet: string;
  romantic: string;
  famrel: string;
  freetime: string;
  goout: string;
  Dalc: string;
  Walc: string;
  health: string;
  absences: string;
  G1: string;
  G2: string;
  G3: string;
}

// Parsed student data with correct types
export interface Student {
  id: number;
  school: 'GP' | 'MS';
  sex: 'M' | 'F';
  age: number;
  address: 'U' | 'R';
  famsize: 'LE3' | 'GT3';
  Pstatus: 'T' | 'A';
  Medu: number; // 0-4
  Fedu: number; // 0-4
  Mjob: string;
  Fjob: string;
  reason: string;
  guardian: 'mother' | 'father' | 'other';
  traveltime: number; // 1-4
  studytime: number; // 1-4
  failures: number; // 0-3+
  schoolsup: boolean;
  famsup: boolean;
  paid: boolean;
  activities: boolean;
  nursery: boolean;
  higher: boolean;
  internet: boolean;
  romantic: boolean;
  famrel: number; // 1-5
  freetime: number; // 1-5
  goout: number; // 1-5
  Dalc: number; // 1-5
  Walc: number; // 1-5
  health: number; // 1-5
  absences: number;
  G1: number; // 0-20
  G2: number; // 0-20
  G3: number; // 0-20
}

// Filter state
export interface FilterState {
  sex: 'all' | 'M' | 'F';
  school: 'all' | 'GP' | 'MS';
  address: 'all' | 'U' | 'R';
  higher: 'all' | 'yes' | 'no';
}

// Chart annotation
export interface ChartAnnotation {
  title: string;
  howToRead: string;
  takeaway: string;
  statsNote?: string;
}

// PCA Result
export interface PCAResult {
  pc1: number;
  pc2: number;
  student: Student;
}

// Variable contribution for PCA
export interface VariableContribution {
  variable: string;
  contribution: number;
  loading: number;
}

// Decision tree node
export interface TreeNode {
  id: string;
  variable?: string;
  threshold?: number | string;
  prediction?: number;
  left?: TreeNode;
  right?: TreeNode;
  label: string;
  samples?: number;
  description?: string;
}

