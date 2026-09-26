export type SubjectKey = 
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'english'
  | 'computerScience'
  | 'history';

export interface SubjectAssessment {
  subjectName: string;
  quizzes: number;      // 0-100
  midterm: number;      // 0-100
  labOrProject: number; // 0-100
  finalExam: number;    // 0-100
  overallScore: number; // weighted or average 0-100
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  missingAssignments: number;
  teacherFeedback: string;
}

export interface CompetencyMetrics {
  analyticalThinking: number;   // 0-100
  scientificInquiry: number;    // 0-100
  verbalExpression: number;     // 0-100
  computationalLogic: number;   // 0-100
  collaboration: number;        // 0-100
  problemSolving: number;       // 0-100
}

export interface ExamPoint {
  examName: string; // e.g. "Diagnostic", "Midterm 1", "Midterm 2", "Semester Final"
  score: number;
  cohortAvg: number;
}

export interface InterventionRecord {
  id: string;
  date: string;
  type: 'Tutoring' | 'Parent Conference' | 'Study Plan' | 'Counseling' | 'Peer Review';
  status: 'Active' | 'Resolved' | 'Scheduled';
  notes: string;
  facilitator: string;
}

export interface RemedialTask {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export type AcademicRiskStatus = 'Thriving' | 'On Track' | 'Needs Attention' | 'Critical Risk';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  cohort: string; // e.g. "Grade 11-A", "Grade 11-B", "Grade 12-Honors"
  avatarUrl?: string;
  attendanceRate: number; // 0-100 percentage
  overallPercentage: number; // 0-100
  gpa: number; // 0.0 - 4.0
  status: AcademicRiskStatus;
  rank: number;
  subjects: Record<SubjectKey, SubjectAssessment>;
  competencies: CompetencyMetrics;
  examHistory: ExamPoint[];
  interventions: InterventionRecord[];
  remedialTasks: RemedialTask[];
  generalObservations: string;
  targetGpa: number;
}

export interface CohortStats {
  totalStudents: number;
  meanGpa: number;
  medianScore: number;
  passRatePercentage: number;
  meanAttendance: number;
  atRiskCount: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  attendanceCorrelation: number; // Pearson r
  subjectAverages: Record<SubjectKey, number>;
}
