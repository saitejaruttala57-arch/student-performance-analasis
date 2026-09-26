import { Student } from '../types/student';
import { recalculateStudentDerivedMetrics } from '../utils/analytics';

export const INITIAL_STUDENTS_RAW: Omit<Student, 'rank' | 'overallPercentage' | 'gpa' | 'status'>[] = [
  {
    id: 'STU-1001',
    name: 'Alexandra Vance',
    rollNumber: '2026-A101',
    cohort: 'Grade 11-AP',
    avatarUrl: '/src/assets/images/student_portrait_alex_1790429686324.jpg',
    attendanceRate: 98.4,
    targetGpa: 3.95,
    generalObservations: 'Consistent academic rigor, excels in mathematical proofs and computational thinking.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 96, midterm: 98, labOrProject: 95, finalExam: 97, overallScore: 96.8, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Superb mastery of multivariable calculus concepts.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 92, midterm: 94, labOrProject: 98, finalExam: 95, overallScore: 94.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Flawless lab notebook documentation and error analysis.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 90, midterm: 91, labOrProject: 93, finalExam: 94, overallScore: 92.2, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Strong stoichiometric calculations.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 88, midterm: 90, labOrProject: 92, finalExam: 91, overallScore: 90.2, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Thoughtful rhetorical analyses and critical essays.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 98, midterm: 99, labOrProject: 100, finalExam: 98, overallScore: 98.7, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Exceptional algorithmic efficiency and clean code design.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 90, midterm: 92, labOrProject: 91, finalExam: 93, overallScore: 91.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Engaged discussion participant.' },
    },
    competencies: {
      analyticalThinking: 97,
      scientificInquiry: 94,
      verbalExpression: 89,
      computationalLogic: 99,
      collaboration: 92,
      problemSolving: 96,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 92, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 94, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 96, cohortAvg: 78 },
      { examName: 'Semester Final', score: 97, cohortAvg: 80 },
    ],
    interventions: [
      { id: 'INT-01', date: '2026-02-10', type: 'Study Plan', status: 'Resolved', notes: 'Advanced placement research paper topic confirmed.', facilitator: 'Dr. Katherine Bell' }
    ],
    remedialTasks: [
      { id: 'REM-01', subject: 'Computer Science', title: 'Submit Science Fair Algorithm Abstract', dueDate: '2026-10-15', completed: true },
      { id: 'REM-02', subject: 'English', title: 'Peer review workshop paper', dueDate: '2026-10-22', completed: true },
    ]
  },
  {
    id: 'STU-1002',
    name: 'Marcus Chen',
    rollNumber: '2026-A102',
    cohort: 'Grade 11-AP',
    avatarUrl: '/src/assets/images/student_portrait_marcus_1790429703672.jpg',
    attendanceRate: 79.2,
    targetGpa: 3.20,
    generalObservations: 'High conceptual capacity hampered by morning absenteeism and missed lab write-ups.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 84, midterm: 78, labOrProject: 80, finalExam: 76, overallScore: 79.2, letterGrade: 'C', missingAssignments: 2, teacherFeedback: 'Capable of B+ performance with regular homework submission.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 88, midterm: 82, labOrProject: 65, finalExam: 79, overallScore: 76.5, letterGrade: 'C', missingAssignments: 3, teacherFeedback: 'Missing two critical kinematics lab write-ups.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 74, midterm: 70, labOrProject: 72, finalExam: 68, overallScore: 70.8, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Needs review of equilibrium constants.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 85, midterm: 84, labOrProject: 86, finalExam: 82, overallScore: 84.1, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Articulate writing style.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 92, midterm: 89, labOrProject: 90, finalExam: 91, overallScore: 90.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Natural aptitude for data structures and recursion.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 80, midterm: 76, labOrProject: 78, finalExam: 75, overallScore: 77.0, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Essay exams show promise; dates need review.' },
    },
    competencies: {
      analyticalThinking: 82,
      scientificInquiry: 72,
      verbalExpression: 84,
      computationalLogic: 91,
      collaboration: 75,
      problemSolving: 80,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 85, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 81, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 77, cohortAvg: 78 },
      { examName: 'Semester Final', score: 78, cohortAvg: 80 },
    ],
    interventions: [
      { id: 'INT-02', date: '2026-03-01', type: 'Parent Conference', status: 'Active', notes: 'Discussed morning transportation conflicts and missed first-period labs.', facilitator: 'Vice Principal Morales' },
      { id: 'INT-03', date: '2026-03-15', type: 'Tutoring', status: 'Active', notes: 'Enrolled in Tuesday physics recovery clinic.', facilitator: 'Prof. Sanders' }
    ],
    remedialTasks: [
      { id: 'REM-03', subject: 'Physics', title: 'Complete Pendulum Motion Lab Write-up', dueDate: '2026-10-05', completed: false },
      { id: 'REM-04', subject: 'Mathematics', title: 'Calculus derivatives makeup quiz #2', dueDate: '2026-10-12', completed: false },
      { id: 'REM-05', subject: 'Chemistry', title: 'Acid-Base titration problem set redo', dueDate: '2026-10-18', completed: true },
    ]
  },
  {
    id: 'STU-1003',
    name: 'Elena Rostova',
    rollNumber: '2026-A103',
    cohort: 'Grade 12-Honors',
    attendanceRate: 99.1,
    targetGpa: 4.0,
    generalObservations: 'Exemplary leadership, National Merit semifinalist, peer tutor in Chemistry.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 97, midterm: 96, labOrProject: 98, finalExam: 99, overallScore: 97.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Consistently top of class.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 95, midterm: 96, labOrProject: 98, finalExam: 97, overallScore: 96.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Outstanding analytical rigor.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 98, midterm: 99, labOrProject: 100, finalExam: 98, overallScore: 98.8, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Mastery is college undergraduate tier.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 94, midterm: 93, labOrProject: 95, finalExam: 96, overallScore: 94.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Exceptional prose clarity.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 96, midterm: 95, labOrProject: 96, finalExam: 97, overallScore: 96.1, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Efficient debugging skills.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 97, midterm: 98, labOrProject: 96, finalExam: 99, overallScore: 97.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Primary source evaluation is impeccable.' },
    },
    competencies: {
      analyticalThinking: 98,
      scientificInquiry: 99,
      verbalExpression: 95,
      computationalLogic: 95,
      collaboration: 97,
      problemSolving: 98,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 96, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 96, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 97, cohortAvg: 78 },
      { examName: 'Semester Final', score: 98, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: [
      { id: 'REM-06', subject: 'Leadership', title: 'Prepare peer chemistry seminar notes', dueDate: '2026-10-14', completed: true },
    ]
  },
  {
    id: 'STU-1004',
    name: 'Devon Bradley',
    rollNumber: '2026-B201',
    cohort: 'Grade 10-B',
    attendanceRate: 71.5,
    targetGpa: 2.2,
    generalObservations: 'At critical academic risk due to frequent unexcused absences and unsubmitted midterm projects.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 58, midterm: 54, labOrProject: 60, finalExam: 52, overallScore: 55.4, letterGrade: 'F', missingAssignments: 4, teacherFeedback: 'Severe gaps in polynomial factorization and graphing.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 62, midterm: 58, labOrProject: 50, finalExam: 55, overallScore: 56.2, letterGrade: 'F', missingAssignments: 4, teacherFeedback: 'Missing safety certifications and lab reports.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 65, midterm: 60, labOrProject: 62, finalExam: 59, overallScore: 61.2, letterGrade: 'D', missingAssignments: 3, teacherFeedback: 'Struggles with molar mass calculations.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 72, midterm: 68, labOrProject: 70, finalExam: 66, overallScore: 68.8, letterGrade: 'D', missingAssignments: 2, teacherFeedback: 'Good oral participation, written drafts overdue.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 75, midterm: 72, labOrProject: 70, finalExam: 68, overallScore: 71.0, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Understands basic control loops.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 68, midterm: 64, labOrProject: 66, finalExam: 62, overallScore: 64.6, letterGrade: 'D', missingAssignments: 3, teacherFeedback: 'Needs timeline restructuring assistance.' },
    },
    competencies: {
      analyticalThinking: 56,
      scientificInquiry: 52,
      verbalExpression: 66,
      computationalLogic: 70,
      collaboration: 60,
      problemSolving: 58,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 68, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 64, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 59, cohortAvg: 78 },
      { examName: 'Semester Final', score: 62, cohortAvg: 80 },
    ],
    interventions: [
      { id: 'INT-04', date: '2026-02-28', type: 'Parent Conference', status: 'Active', notes: 'Academic probation contract signed with guardian.', facilitator: 'Counselor Hayes' },
      { id: 'INT-05', date: '2026-03-10', type: 'Tutoring', status: 'Active', notes: 'Mandatory daily after-school study hall assigned.', facilitator: 'Mr. Vance' }
    ],
    remedialTasks: [
      { id: 'REM-07', subject: 'Mathematics', title: 'Quadratic equations remediation packet', dueDate: '2026-10-04', completed: false },
      { id: 'REM-08', subject: 'Physics', title: 'Newtonian mechanics lab makeup', dueDate: '2026-10-08', completed: false },
      { id: 'REM-09', subject: 'History', title: 'Submit overdue Industrial Revolution timeline', dueDate: '2026-10-11', completed: false },
    ]
  },
  {
    id: 'STU-1005',
    name: 'Maya Patel',
    rollNumber: '2026-A104',
    cohort: 'Grade 11-AP',
    attendanceRate: 95.8,
    targetGpa: 3.75,
    generalObservations: 'Solid, conscientious student with outstanding verbal fluency and historical analysis.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 84, midterm: 82, labOrProject: 86, finalExam: 85, overallScore: 84.4, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good conceptual retention; watch algebraic sign errors.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 80, midterm: 82, labOrProject: 88, finalExam: 83, overallScore: 83.5, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Effective experimental setups.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 85, midterm: 86, labOrProject: 88, finalExam: 87, overallScore: 86.6, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Diligent problem solver.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 95, midterm: 96, labOrProject: 98, finalExam: 96, overallScore: 96.3, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Published school literary contributor.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 82, midterm: 84, labOrProject: 85, finalExam: 83, overallScore: 83.6, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Steady progression in Python syntax.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 96, midterm: 97, labOrProject: 98, finalExam: 97, overallScore: 97.0, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Insightful historiography papers.' },
    },
    competencies: {
      analyticalThinking: 86,
      scientificInquiry: 85,
      verbalExpression: 97,
      computationalLogic: 82,
      collaboration: 94,
      problemSolving: 88,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 86, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 87, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 88, cohortAvg: 78 },
      { examName: 'Semester Final', score: 90, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: [
      { id: 'REM-10', subject: 'Mathematics', title: 'Trigonometric identities review sheet', dueDate: '2026-10-18', completed: true },
    ]
  },
  {
    id: 'STU-1006',
    name: 'Julian O\'Connor',
    rollNumber: '2026-A105',
    cohort: 'Grade 10-A',
    attendanceRate: 91.2,
    targetGpa: 3.4,
    generalObservations: 'Excels in laboratory work and empirical tests, needs writing refinement for essay finals.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 86, midterm: 84, labOrProject: 88, finalExam: 85, overallScore: 85.5, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Steady performance.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 92, midterm: 90, labOrProject: 96, finalExam: 91, overallScore: 92.1, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Natural experimenter.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 88, midterm: 86, labOrProject: 90, finalExam: 87, overallScore: 87.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good accuracy in laboratory titration.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 76, midterm: 74, labOrProject: 78, finalExam: 75, overallScore: 75.6, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Grammar mechanics need revision.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 85, midterm: 88, labOrProject: 89, finalExam: 87, overallScore: 87.4, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Solid object-oriented design.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 78, midterm: 76, labOrProject: 80, finalExam: 77, overallScore: 77.6, letterGrade: 'C', missingAssignments: 0, teacherFeedback: 'Consistent test score.' },
    },
    competencies: {
      analyticalThinking: 88,
      scientificInquiry: 92,
      verbalExpression: 75,
      computationalLogic: 86,
      collaboration: 84,
      problemSolving: 87,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 82, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 83, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 85, cohortAvg: 78 },
      { examName: 'Semester Final', score: 86, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: [
      { id: 'REM-11', subject: 'English', title: 'Essay outline conference with writing lab', dueDate: '2026-10-16', completed: true },
    ]
  },
  {
    id: 'STU-1007',
    name: 'Aisha Al-Mansoor',
    rollNumber: '2026-A106',
    cohort: 'Grade 12-Honors',
    attendanceRate: 97.5,
    targetGpa: 3.9,
    generalObservations: 'High academic distinction across STEM disciplines, active in robotics robotics team.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 95, midterm: 96, labOrProject: 98, finalExam: 97, overallScore: 96.4, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Remarkable aptitude for calculus proofs.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 96, midterm: 97, labOrProject: 99, finalExam: 96, overallScore: 97.0, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Leads kinematics problem sessions.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 94, midterm: 92, labOrProject: 95, finalExam: 94, overallScore: 93.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Deep grasp of thermodynamics.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 90, midterm: 89, labOrProject: 92, finalExam: 91, overallScore: 90.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Compelling argumentative speeches.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 98, midterm: 99, labOrProject: 99, finalExam: 98, overallScore: 98.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Robotics team lead software developer.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 91, midterm: 93, labOrProject: 94, finalExam: 92, overallScore: 92.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Active engagement in foreign policy debate.' },
    },
    competencies: {
      analyticalThinking: 97,
      scientificInquiry: 97,
      verbalExpression: 91,
      computationalLogic: 98,
      collaboration: 95,
      problemSolving: 98,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 93, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 94, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 95, cohortAvg: 78 },
      { examName: 'Semester Final', score: 96, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: []
  },
  {
    id: 'STU-1008',
    name: 'Lucas Ferreira',
    rollNumber: '2026-B202',
    cohort: 'Grade 10-B',
    attendanceRate: 83.4,
    targetGpa: 2.8,
    generalObservations: 'Moderate academic engagement; prone to test anxiety during timed math examinations.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 72, midterm: 65, labOrProject: 76, finalExam: 68, overallScore: 69.8, letterGrade: 'D', missingAssignments: 1, teacherFeedback: 'Time management during exams is the limiting factor.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 74, midterm: 72, labOrProject: 78, finalExam: 71, overallScore: 73.5, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Hands-on lab work is stronger than written theory.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 76, midterm: 75, labOrProject: 79, finalExam: 74, overallScore: 75.8, letterGrade: 'C', missingAssignments: 0, teacherFeedback: 'Consistent homework compliance.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 82, midterm: 80, labOrProject: 84, finalExam: 81, overallScore: 81.8, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Expressive creative responses.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 80, midterm: 78, labOrProject: 82, finalExam: 79, overallScore: 79.7, letterGrade: 'C', missingAssignments: 0, teacherFeedback: 'Solid HTML/CSS and introductory scripting.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 83, midterm: 82, labOrProject: 85, finalExam: 80, overallScore: 82.3, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good comprehension of geopolitical eras.' },
    },
    competencies: {
      analyticalThinking: 71,
      scientificInquiry: 74,
      verbalExpression: 82,
      computationalLogic: 78,
      collaboration: 80,
      problemSolving: 72,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 79, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 76, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 74, cohortAvg: 78 },
      { examName: 'Semester Final', score: 77, cohortAvg: 80 },
    ],
    interventions: [
      { id: 'INT-06', date: '2026-03-05', type: 'Study Plan', status: 'Active', notes: 'Implemented extended testing time accommodations evaluation.', facilitator: 'Specialist Ramirez' }
    ],
    remedialTasks: [
      { id: 'REM-12', subject: 'Mathematics', title: 'Timed practice test session with pacing strategies', dueDate: '2026-10-20', completed: false }
    ]
  },
  {
    id: 'STU-1009',
    name: 'Zoe Washington',
    rollNumber: '2026-A107',
    cohort: 'Grade 10-A',
    attendanceRate: 96.0,
    targetGpa: 3.65,
    generalObservations: 'Enthusiastic participant in STEM fairs, excellent collaborator in team lab projects.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 89, midterm: 88, labOrProject: 90, finalExam: 89, overallScore: 88.9, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Steady logical deduction.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 90, midterm: 92, labOrProject: 94, finalExam: 91, overallScore: 91.8, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Superb project on wave mechanics.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 86, midterm: 88, labOrProject: 89, finalExam: 87, overallScore: 87.5, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Accurate titration procedures.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 87, midterm: 86, labOrProject: 90, finalExam: 88, overallScore: 87.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Thoughtful poetry analysis.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 91, midterm: 93, labOrProject: 94, finalExam: 92, overallScore: 92.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Strong object structure.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 88, midterm: 90, labOrProject: 91, finalExam: 89, overallScore: 89.5, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good research papers.' },
    },
    competencies: {
      analyticalThinking: 89,
      scientificInquiry: 92,
      verbalExpression: 88,
      computationalLogic: 91,
      collaboration: 95,
      problemSolving: 90,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 87, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 88, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 90, cohortAvg: 78 },
      { examName: 'Semester Final', score: 91, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: []
  },
  {
    id: 'STU-1010',
    name: 'Kaito Tanaka',
    rollNumber: '2026-A108',
    cohort: 'Grade 11-AP',
    attendanceRate: 98.7,
    targetGpa: 3.85,
    generalObservations: 'Outstanding mathematical and computational performance, quiet demeanour in humanities.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 98, midterm: 99, labOrProject: 97, finalExam: 99, overallScore: 98.3, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Top score in state math Olympiad qualifiers.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 95, midterm: 96, labOrProject: 94, finalExam: 97, overallScore: 95.6, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Deep grasp of rotational dynamics.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 92, midterm: 90, labOrProject: 94, finalExam: 93, overallScore: 92.2, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Consistent lab diligence.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 84, midterm: 82, labOrProject: 86, finalExam: 83, overallScore: 83.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good analytical ideas; encourage more verbal debate.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 99, midterm: 100, labOrProject: 100, finalExam: 99, overallScore: 99.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Flawless graph search and dynamic programming solutions.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 85, midterm: 84, labOrProject: 88, finalExam: 86, overallScore: 85.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Well-researched primary source citations.' },
    },
    competencies: {
      analyticalThinking: 99,
      scientificInquiry: 95,
      verbalExpression: 83,
      computationalLogic: 100,
      collaboration: 88,
      problemSolving: 99,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 91, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 93, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 94, cohortAvg: 78 },
      { examName: 'Semester Final', score: 96, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: []
  },
  {
    id: 'STU-1011',
    name: 'Brianna Gomez',
    rollNumber: '2026-B203',
    cohort: 'Grade 10-B',
    attendanceRate: 74.2,
    targetGpa: 2.4,
    generalObservations: 'Suffers from persistent health-related absences; needs coordinated home study packet.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 64, midterm: 60, labOrProject: 68, finalExam: 59, overallScore: 62.3, letterGrade: 'D', missingAssignments: 3, teacherFeedback: 'Missed exponential growth unit completely.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 68, midterm: 65, labOrProject: 60, finalExam: 63, overallScore: 64.0, letterGrade: 'D', missingAssignments: 2, teacherFeedback: 'Needs guided circuit lab makeup.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 70, midterm: 68, labOrProject: 72, finalExam: 66, overallScore: 68.9, letterGrade: 'D', missingAssignments: 2, teacherFeedback: 'Grasps general concepts when present.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 79, midterm: 78, labOrProject: 82, finalExam: 76, overallScore: 78.7, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Good storytelling and expressive journal.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 72, midterm: 70, labOrProject: 74, finalExam: 69, overallScore: 71.2, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Enjoys web styling when caught up.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 74, midterm: 72, labOrProject: 75, finalExam: 70, overallScore: 72.7, letterGrade: 'C', missingAssignments: 2, teacherFeedback: 'Good historical awareness.' },
    },
    competencies: {
      analyticalThinking: 64,
      scientificInquiry: 62,
      verbalExpression: 78,
      computationalLogic: 71,
      collaboration: 70,
      problemSolving: 66,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 72, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 68, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 66, cohortAvg: 78 },
      { examName: 'Semester Final', score: 68, cohortAvg: 80 },
    ],
    interventions: [
      { id: 'INT-07', date: '2026-02-15', type: 'Counseling', status: 'Active', notes: 'Coordinating medical leave accommodations and asynchronous modules.', facilitator: 'Nurse Jenkins' }
    ],
    remedialTasks: [
      { id: 'REM-13', subject: 'Mathematics', title: 'Exponential graphs makeup worksheet', dueDate: '2026-10-09', completed: false },
      { id: 'REM-14', subject: 'Physics', title: 'Circuit simulation virtual lab', dueDate: '2026-10-17', completed: true },
    ]
  },
  {
    id: 'STU-1012',
    name: 'Samuel Adebayo',
    rollNumber: '2026-A109',
    cohort: 'Grade 12-Honors',
    attendanceRate: 96.5,
    targetGpa: 3.8,
    generalObservations: 'Diligent researcher with strong leadership and persuasive rhetoric skills.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 91, midterm: 90, labOrProject: 93, finalExam: 92, overallScore: 91.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Consistently methodical.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 89, midterm: 91, labOrProject: 94, finalExam: 90, overallScore: 91.0, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'High precision in error propagation.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 88, midterm: 89, labOrProject: 91, finalExam: 90, overallScore: 89.5, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Thorough lab reports.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 96, midterm: 98, labOrProject: 97, finalExam: 97, overallScore: 97.0, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Captained debate team to state finals.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 87, midterm: 86, labOrProject: 90, finalExam: 88, overallScore: 87.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good algorithmic problem solving.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 97, midterm: 98, labOrProject: 99, finalExam: 98, overallScore: 98.0, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Superb historiographical essay.' },
    },
    competencies: {
      analyticalThinking: 91,
      scientificInquiry: 90,
      verbalExpression: 98,
      computationalLogic: 87,
      collaboration: 97,
      problemSolving: 92,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 90, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 91, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 93, cohortAvg: 78 },
      { examName: 'Semester Final', score: 94, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: []
  },
  {
    id: 'STU-1013',
    name: 'Chloe Tremblay',
    rollNumber: '2026-A110',
    cohort: 'Grade 10-A',
    attendanceRate: 94.0,
    targetGpa: 3.5,
    generalObservations: 'Consistent, dependable student across all core modules; thrives in group seminars.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 83, midterm: 85, labOrProject: 87, finalExam: 84, overallScore: 84.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Steady pace.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 85, midterm: 86, labOrProject: 90, finalExam: 87, overallScore: 87.0, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good collaboration.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 88, midterm: 87, labOrProject: 89, finalExam: 88, overallScore: 88.0, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Careful titration technician.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 89, midterm: 91, labOrProject: 92, finalExam: 90, overallScore: 90.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Insightful narrative analysis.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 82, midterm: 84, labOrProject: 86, finalExam: 85, overallScore: 84.3, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Strong modularity.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 90, midterm: 92, labOrProject: 93, finalExam: 91, overallScore: 91.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'High contextual awareness.' },
    },
    competencies: {
      analyticalThinking: 85,
      scientificInquiry: 87,
      verbalExpression: 90,
      computationalLogic: 83,
      collaboration: 93,
      problemSolving: 86,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 84, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 86, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 87, cohortAvg: 78 },
      { examName: 'Semester Final', score: 88, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: []
  },
  {
    id: 'STU-1014',
    name: 'Noah Gallagher',
    rollNumber: '2026-B204',
    cohort: 'Grade 10-B',
    attendanceRate: 78.8,
    targetGpa: 2.7,
    generalObservations: 'Noticeable drop in exam scores after Midterm 1; requires motivational coaching.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 75, midterm: 70, labOrProject: 72, finalExam: 66, overallScore: 70.8, letterGrade: 'C', missingAssignments: 2, teacherFeedback: 'Loses concentration towards exam conclusion.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 72, midterm: 68, labOrProject: 70, finalExam: 64, overallScore: 68.5, letterGrade: 'D', missingAssignments: 2, teacherFeedback: 'Missed friction formulas.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 76, midterm: 73, labOrProject: 75, finalExam: 71, overallScore: 73.8, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Adequate test scores.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 81, midterm: 79, labOrProject: 82, finalExam: 78, overallScore: 80.0, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Creative ideas in short story units.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 82, midterm: 80, labOrProject: 81, finalExam: 79, overallScore: 80.5, letterGrade: 'B', missingAssignments: 1, teacherFeedback: 'Enjoys game development exercises.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 76, midterm: 74, labOrProject: 78, finalExam: 72, overallScore: 75.0, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Needs deeper source evaluation.' },
    },
    competencies: {
      analyticalThinking: 70,
      scientificInquiry: 68,
      verbalExpression: 80,
      computationalLogic: 81,
      collaboration: 76,
      problemSolving: 72,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 81, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 76, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 71, cohortAvg: 78 },
      { examName: 'Semester Final', score: 73, cohortAvg: 80 },
    ],
    interventions: [
      { id: 'INT-08', date: '2026-03-12', type: 'Study Plan', status: 'Active', notes: 'Created structured evening study schedule.', facilitator: 'Mentor Davis' }
    ],
    remedialTasks: [
      { id: 'REM-15', subject: 'Physics', title: 'Friction calculation review set', dueDate: '2026-10-21', completed: false }
    ]
  },
  {
    id: 'STU-1015',
    name: 'Fatima Zahra',
    rollNumber: '2026-A111',
    cohort: 'Grade 11-AP',
    attendanceRate: 97.2,
    targetGpa: 3.85,
    generalObservations: 'Exceptional laboratory conduct and precision across organic chemistry and cellular biology.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 92, midterm: 91, labOrProject: 94, finalExam: 93, overallScore: 92.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Clear linear algebra proofs.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 94, midterm: 95, labOrProject: 98, finalExam: 95, overallScore: 95.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Brilliant optical refraction project.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 97, midterm: 98, labOrProject: 99, finalExam: 97, overallScore: 97.8, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Flawless organic synthesis reporting.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 90, midterm: 89, labOrProject: 91, finalExam: 92, overallScore: 90.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Well-researched thesis statements.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 89, midterm: 91, labOrProject: 93, finalExam: 90, overallScore: 90.8, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Effective data pipelines.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 92, midterm: 94, labOrProject: 95, finalExam: 93, overallScore: 93.5, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Thoughtful cultural history synthesis.' },
    },
    competencies: {
      analyticalThinking: 94,
      scientificInquiry: 98,
      verbalExpression: 91,
      computationalLogic: 90,
      collaboration: 94,
      problemSolving: 95,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 92, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 93, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 94, cohortAvg: 78 },
      { examName: 'Semester Final', score: 95, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: []
  },
  {
    id: 'STU-1016',
    name: 'Ethan Cole',
    rollNumber: '2026-B205',
    cohort: 'Grade 10-B',
    attendanceRate: 85.5,
    targetGpa: 3.0,
    generalObservations: 'Shows great affinity for hands-on computer science; math test scores need reinforcement.',
    subjects: {
      mathematics: { subjectName: 'Advanced Mathematics', quizzes: 72, midterm: 70, labOrProject: 76, finalExam: 69, overallScore: 71.8, letterGrade: 'C', missingAssignments: 1, teacherFeedback: 'Needs practice with trigonometric values.' },
      physics: { subjectName: 'Applied Physics & Lab', quizzes: 77, midterm: 76, labOrProject: 82, finalExam: 75, overallScore: 77.5, letterGrade: 'C', missingAssignments: 0, teacherFeedback: 'Good laboratory participation.' },
      chemistry: { subjectName: 'Chemistry & Analysis', quizzes: 79, midterm: 77, labOrProject: 81, finalExam: 78, overallScore: 78.8, letterGrade: 'C', missingAssignments: 0, teacherFeedback: 'Reliable team partner.' },
      english: { subjectName: 'English Literature & Rhetoric', quizzes: 82, midterm: 84, labOrProject: 86, finalExam: 83, overallScore: 83.7, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good speech presentation.' },
      computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: 92, midterm: 94, labOrProject: 96, finalExam: 93, overallScore: 93.8, letterGrade: 'A', missingAssignments: 0, teacherFeedback: 'Built impressive full-stack class utility.' },
      history: { subjectName: 'World History & Civilizations', quizzes: 80, midterm: 82, labOrProject: 84, finalExam: 81, overallScore: 81.8, letterGrade: 'B', missingAssignments: 0, teacherFeedback: 'Good grasp of industrial history.' },
    },
    competencies: {
      analyticalThinking: 75,
      scientificInquiry: 78,
      verbalExpression: 83,
      computationalLogic: 94,
      collaboration: 85,
      problemSolving: 82,
    },
    examHistory: [
      { examName: 'Diagnostic', score: 79, cohortAvg: 76 },
      { examName: 'Midterm 1', score: 80, cohortAvg: 77 },
      { examName: 'Midterm 2', score: 81, cohortAvg: 78 },
      { examName: 'Semester Final', score: 82, cohortAvg: 80 },
    ],
    interventions: [],
    remedialTasks: [
      { id: 'REM-16', subject: 'Mathematics', title: 'Unit circle mastery drill', dueDate: '2026-10-19', completed: false }
    ]
  }
];

export function getInitialStudents(): Student[] {
  // Check localStorage for persisted user edits or fall back to initialized set
  const saved = typeof window !== 'undefined' ? localStorage.getItem('scholarpulse_students') : null;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return assignRanks(parsed);
      }
    } catch (e) {
      console.error('Failed to parse cached student data', e);
    }
  }

  const calculated = INITIAL_STUDENTS_RAW.map((s) => recalculateStudentDerivedMetrics(s as Student));
  return assignRanks(calculated);
}

export function assignRanks(students: Student[]): Student[] {
  const sorted = [...students].sort((a, b) => b.overallPercentage - a.overallPercentage);
  return sorted.map((student, index) => ({
    ...student,
    rank: index + 1
  }));
}
