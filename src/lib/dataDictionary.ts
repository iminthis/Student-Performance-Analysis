// Data Dictionary: Maps raw variable names to human-readable labels
// Based on UCI Student Performance Dataset

export const dataDictionary = {
  // Demographic Variables
  school: {
    label: 'School',
    description: "Student's school",
    values: {
      GP: 'Gabriel Pereira',
      MS: 'Mousinho da Silveira',
    },
  },
  sex: {
    label: 'Sex',
    description: "Student's sex",
    values: {
      M: 'Male',
      F: 'Female',
    },
  },
  age: {
    label: 'Age',
    description: "Student's age (15-22)",
    type: 'numeric',
  },
  address: {
    label: 'Home Address',
    description: 'Home address type',
    values: {
      U: 'Urban',
      R: 'Rural',
    },
  },
  famsize: {
    label: 'Family Size',
    description: 'Family size',
    values: {
      LE3: '≤3 members',
      GT3: '>3 members',
    },
  },
  Pstatus: {
    label: 'Parent Status',
    description: "Parent's cohabitation status",
    values: {
      T: 'Living together',
      A: 'Apart',
    },
  },

  // Family Education
  Medu: {
    label: "Mother's Education",
    description: "Mother's education level",
    values: {
      0: 'None',
      1: 'Primary (4th grade)',
      2: 'Middle School (5th-9th)',
      3: 'Secondary',
      4: 'Higher Education',
    },
  },
  Fedu: {
    label: "Father's Education",
    description: "Father's education level",
    values: {
      0: 'None',
      1: 'Primary (4th grade)',
      2: 'Middle School (5th-9th)',
      3: 'Secondary',
      4: 'Higher Education',
    },
  },

  // Jobs
  Mjob: {
    label: "Mother's Job",
    description: "Mother's job",
    values: {
      teacher: 'Teacher',
      health: 'Health care',
      services: 'Civil services',
      at_home: 'At home',
      other: 'Other',
    },
  },
  Fjob: {
    label: "Father's Job",
    description: "Father's job",
    values: {
      teacher: 'Teacher',
      health: 'Health care',
      services: 'Civil services',
      at_home: 'At home',
      other: 'Other',
    },
  },

  // School-related
  reason: {
    label: 'School Choice Reason',
    description: 'Reason to choose this school',
    values: {
      home: 'Close to home',
      reputation: 'School reputation',
      course: 'Course preference',
      other: 'Other',
    },
  },
  guardian: {
    label: 'Guardian',
    description: "Student's guardian",
    values: {
      mother: 'Mother',
      father: 'Father',
      other: 'Other',
    },
  },
  traveltime: {
    label: 'Travel Time',
    description: 'Home to school travel time',
    values: {
      1: '<15 min',
      2: '15-30 min',
      3: '30 min - 1 hour',
      4: '>1 hour',
    },
  },
  studytime: {
    label: 'Study Time',
    description: 'Weekly study time',
    values: {
      1: '<2 hours',
      2: '2-5 hours',
      3: '5-10 hours',
      4: '>10 hours',
    },
  },
  failures: {
    label: 'Past Failures',
    description: 'Number of past class failures',
    type: 'numeric',
    note: 'n if 1≤n<3, else 3',
  },

  // Support
  schoolsup: {
    label: 'School Support',
    description: 'Extra educational support from school',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  famsup: {
    label: 'Family Support',
    description: 'Family educational support',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  paid: {
    label: 'Paid Classes',
    description: 'Extra paid classes within the course subject',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  activities: {
    label: 'Extra Activities',
    description: 'Extra-curricular activities',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  nursery: {
    label: 'Nursery',
    description: 'Attended nursery school',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  higher: {
    label: 'Higher Education Goal',
    description: 'Wants to take higher education',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  internet: {
    label: 'Internet Access',
    description: 'Internet access at home',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },
  romantic: {
    label: 'Romantic Relationship',
    description: 'In a romantic relationship',
    values: {
      yes: 'Yes',
      no: 'No',
    },
  },

  // Lifestyle (1-5 scales)
  famrel: {
    label: 'Family Relationship',
    description: 'Quality of family relationships',
    scale: '1 = very bad, 5 = excellent',
  },
  freetime: {
    label: 'Free Time',
    description: 'Free time after school',
    scale: '1 = very low, 5 = very high',
  },
  goout: {
    label: 'Going Out',
    description: 'Going out with friends',
    scale: '1 = very low, 5 = very high',
  },
  Dalc: {
    label: 'Weekday Alcohol',
    description: 'Workday alcohol consumption',
    scale: '1 = very low, 5 = very high',
  },
  Walc: {
    label: 'Weekend Alcohol',
    description: 'Weekend alcohol consumption',
    scale: '1 = very low, 5 = very high',
  },
  health: {
    label: 'Health Status',
    description: 'Current health status',
    scale: '1 = very bad, 5 = very good',
  },
  absences: {
    label: 'Absences',
    description: 'Number of school absences',
    type: 'numeric',
    note: '0-93',
  },

  // Grades
  G1: {
    label: 'First Period Grade',
    description: 'First period grade',
    type: 'numeric',
    note: '0-20',
  },
  G2: {
    label: 'Second Period Grade',
    description: 'Second period grade',
    type: 'numeric',
    note: '0-20',
  },
  G3: {
    label: 'Final Grade',
    description: 'Final grade (target variable)',
    type: 'numeric',
    note: '0-20',
  },
} as const;

// Helper to get human-readable label
export function getLabel(variable: keyof typeof dataDictionary): string {
  return dataDictionary[variable]?.label || variable;
}

// Helper to get value label
export function getValueLabel(
  variable: keyof typeof dataDictionary,
  value: string | number
): string {
  const entry = dataDictionary[variable];
  if ('values' in entry && entry.values) {
    return (entry.values as Record<string | number, string>)[value] || String(value);
  }
  return String(value);
}

// Education level labels (shared for Medu/Fedu)
export const educationLabels: Record<number, string> = {
  0: 'None',
  1: 'Primary',
  2: 'Middle School',
  3: 'Secondary',
  4: 'Higher Education',
};

// Study time labels
export const studytimeLabels: Record<number, string> = {
  1: '<2 hrs',
  2: '2-5 hrs',
  3: '5-10 hrs',
  4: '>10 hrs',
};

// Alcohol/lifestyle labels
export const scaleLabels: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very High',
};

