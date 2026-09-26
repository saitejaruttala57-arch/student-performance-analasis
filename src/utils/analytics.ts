import { Student, SubjectKey, CohortStats, AcademicRiskStatus } from '../types/student';

export const SUBJECT_METADATA: Record<SubjectKey, { label: string; code: string; credits: number }> = {
  mathematics: { label: 'Advanced Mathematics', code: 'MATH-301', credits: 4 },
  physics: { label: 'Applied Physics & Lab', code: 'PHYS-204', credits: 4 },
  chemistry: { label: 'Chemistry & Analysis', code: 'CHEM-202', credits: 3 },
  english: { label: 'English Literature & Rhetoric', code: 'ENG-210', credits: 3 },
  computerScience: { label: 'Computer Science & Algorithms', code: 'CS-150', credits: 4 },
  history: { label: 'World History & Civilizations', code: 'HIST-105', credits: 3 },
};

export const SUBJECT_KEYS: SubjectKey[] = [
  'mathematics',
  'physics',
  'chemistry',
  'english',
  'computerScience',
  'history'
];

export function calculateLetterGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function scoreToGpa(score: number): number {
  if (score >= 93) return 4.0;
  if (score >= 90) return 3.7;
  if (score >= 87) return 3.3;
  if (score >= 83) return 3.0;
  if (score >= 80) return 2.7;
  if (score >= 77) return 2.3;
  if (score >= 73) return 2.0;
  if (score >= 70) return 1.7;
  if (score >= 65) return 1.3;
  if (score >= 60) return 1.0;
  return 0.0;
}

export function determineRiskStatus(
  overallScore: number,
  attendanceRate: number,
  missingAssignmentsCount: number,
  trajectoryDecline: boolean
): AcademicRiskStatus {
  if (overallScore < 65 || attendanceRate < 75 || missingAssignmentsCount >= 5) {
    return 'Critical Risk';
  }
  if (overallScore < 75 || attendanceRate < 85 || missingAssignmentsCount >= 3 || trajectoryDecline) {
    return 'Needs Attention';
  }
  if (overallScore >= 88 && attendanceRate >= 92) {
    return 'Thriving';
  }
  return 'On Track';
}

export function recalculateStudentDerivedMetrics(student: Student): Student {
  const scores = SUBJECT_KEYS.map((k) => student.subjects[k].overallScore);
  const avgScore = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
  const gpa = Number((scores.map(scoreToGpa).reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
  
  const totalMissing = SUBJECT_KEYS.reduce(
    (acc, k) => acc + (student.subjects[k].missingAssignments || 0),
    0
  );

  const history = student.examHistory || [];
  const trajectoryDecline = history.length >= 2 
    ? history[history.length - 1].score < history[0].score - 10
    : false;

  const status = determineRiskStatus(
    avgScore,
    student.attendanceRate,
    totalMissing,
    trajectoryDecline
  );

  return {
    ...student,
    overallPercentage: avgScore,
    gpa,
    status
  };
}

export function computeCohortStats(students: Student[]): CohortStats {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      meanGpa: 0,
      medianScore: 0,
      passRatePercentage: 0,
      meanAttendance: 0,
      atRiskCount: 0,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
      attendanceCorrelation: 0,
      subjectAverages: {
        mathematics: 0,
        physics: 0,
        chemistry: 0,
        english: 0,
        computerScience: 0,
        history: 0
      }
    };
  }

  const scores = students.map((s) => s.overallPercentage).sort((a, b) => a - b);
  const gpas = students.map((s) => s.gpa);
  const attendances = students.map((s) => s.attendanceRate);

  const meanGpa = Number((gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2));
  const meanAttendance = Number((attendances.reduce((a, b) => a + b, 0) / attendances.length).toFixed(1));

  const mid = Math.floor(scores.length / 2);
  const medianScore = scores.length % 2 !== 0 
    ? scores[mid] 
    : Number(((scores[mid - 1] + scores[mid]) / 2).toFixed(1));

  const passingStudents = students.filter((s) => s.overallPercentage >= 65);
  const passRatePercentage = Number(((passingStudents.length / students.length) * 100).toFixed(1));

  const atRiskCount = students.filter((s) => s.status === 'Critical Risk' || s.status === 'Needs Attention').length;

  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  students.forEach((s) => {
    const grade = calculateLetterGrade(s.overallPercentage);
    gradeDistribution[grade]++;
  });

  // Calculate Pearson correlation coefficient between Attendance and Overall Percentage
  const n = students.length;
  const meanX = attendances.reduce((a, b) => a + b, 0) / n;
  const meanY = scores.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = students[i].attendanceRate - meanX;
    const dy = students[i].overallPercentage - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const attendanceCorrelation = (denX > 0 && denY > 0)
    ? Number((num / Math.sqrt(denX * denY)).toFixed(2))
    : 0;

  // Calculate subject averages
  const subjectAverages = {} as Record<SubjectKey, number>;
  SUBJECT_KEYS.forEach((sub) => {
    const subScores = students.map((s) => s.subjects[sub]?.overallScore || 0);
    const avg = subScores.reduce((a, b) => a + b, 0) / subScores.length;
    subjectAverages[sub] = Number(avg.toFixed(1));
  });

  return {
    totalStudents: students.length,
    meanGpa,
    medianScore,
    passRatePercentage,
    meanAttendance,
    atRiskCount,
    gradeDistribution,
    attendanceCorrelation,
    subjectAverages
  };
}

export function generateHeuristicDiagnosis(student: Student): {
  executiveSummary: string;
  primaryStrength: string;
  criticalRiskFactor: string;
  recommendedInterventions: Array<{ title: string; action: string; priority: 'High' | 'Medium' }>;
  projectedTrajectory: string;
} {
  const sortedSubs = SUBJECT_KEYS.map((k) => ({
    key: k,
    name: SUBJECT_METADATA[k].label,
    score: student.subjects[k].overallScore,
    missing: student.subjects[k].missingAssignments
  })).sort((a, b) => b.score - a.score);

  const topSubject = sortedSubs[0];
  const lowestSubject = sortedSubs[sortedSubs.length - 1];
  const totalMissing = sortedSubs.reduce((acc, s) => acc + s.missing, 0);

  let primaryStrength = `${topSubject.name} (${topSubject.score}%)`;
  if (student.competencies.analyticalThinking >= 85) {
    primaryStrength += ' with prominent conceptual problem-solving';
  } else if (student.competencies.verbalExpression >= 85) {
    primaryStrength += ' supported by strong articulate expression';
  }

  let criticalRiskFactor = 'Balanced performance with minimal standard variance.';
  if (student.attendanceRate < 80) {
    criticalRiskFactor = `Chronic absenteeism (${student.attendanceRate}%) directly impacting lesson continuity and quiz readiness.`;
  } else if (totalMissing >= 3) {
    criticalRiskFactor = `Accumulation of ${totalMissing} unsubmitted assignments in ${lowestSubject.name} reducing composite score.`;
  } else if (lowestSubject.score < 65) {
    criticalRiskFactor = `Marked deficit in ${lowestSubject.name} (${lowestSubject.score}%), creating prerequisite vulnerability.`;
  } else if (student.examHistory.length >= 2 && student.examHistory[student.examHistory.length - 1].score < student.examHistory[0].score - 8) {
    criticalRiskFactor = 'Mid-semester performance deceleration indicating test anxiety or exam fatigue.';
  }

  const interventions: Array<{ title: string; action: string; priority: 'High' | 'Medium' }> = [];

  if (lowestSubject.score < 75) {
    interventions.push({
      title: `${lowestSubject.name} Focused Review`,
      action: `Establish bi-weekly guided recitations focused on foundational concepts in ${lowestSubject.name}.`,
      priority: 'High'
    });
  }

  if (totalMissing > 0) {
    interventions.push({
      title: 'Assignment Resolution Contract',
      action: `Authorize a 5-day grace period to submit ${totalMissing} outstanding coursework deliverables for up to 80% recovery credit.`,
      priority: 'High'
    });
  }

  if (student.attendanceRate < 88) {
    interventions.push({
      title: 'Attendance Accountability Check-in',
      action: 'Weekly morning homeroom check-in with academic counselor to monitor attendance logs.',
      priority: 'Medium'
    });
  }

  if (interventions.length < 3) {
    interventions.push({
      title: 'Peer Learning Partnership',
      action: `Pair student with study partner to leverage strengths in ${topSubject.name} while cross-reviewing exam prompts.`,
      priority: 'Medium'
    });
  }

  const executiveSummary = `${student.name} maintains a cumulative GPA of ${student.gpa.toFixed(2)} (${student.overallPercentage}%). Demonstrates distinct proficiency in ${topSubject.name}, while ${lowestSubject.name} requires structured scaffolded support. Attendance stands at ${student.attendanceRate}%.`;

  const projectedTrajectory = student.overallPercentage >= 80 
    ? 'On pace to achieve Dean’s Academic Distinction if current assessment consistency is maintained through finals.'
    : 'Projected to recover a 0.4 GPA gain within 4 weeks upon execution of the recommended remediation checklist.';

  return {
    executiveSummary,
    primaryStrength,
    criticalRiskFactor,
    recommendedInterventions: interventions.slice(0, 3),
    projectedTrajectory
  };
}
