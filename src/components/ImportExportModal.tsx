import React, { useState, useRef } from 'react';
import { Student } from '../types/student';
import { SUBJECT_KEYS, recalculateStudentDerivedMetrics, calculateLetterGrade } from '../utils/analytics';
import { X, Download, Upload, RefreshCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { INITIAL_STUDENTS_RAW } from '../data/initialStudents';

interface ImportExportModalProps {
  students: Student[];
  onClose: () => void;
  onImportStudents: (newStudents: Student[]) => void;
  onResetDefault: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  students,
  onClose,
  onImportStudents,
  onResetDefault
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'Rank',
      'Student ID',
      'Name',
      'Roll Number',
      'Cohort',
      'Overall Score %',
      'GPA',
      'Attendance %',
      'Status',
      'Mathematics %',
      'Physics %',
      'Chemistry %',
      'English %',
      'Computer Science %',
      'History %',
      'Total Missing Assignments'
    ];

    const rows = students.map((s) => {
      const missing = SUBJECT_KEYS.reduce((sum, k) => sum + (s.subjects[k]?.missingAssignments || 0), 0);
      return [
        s.rank,
        s.id,
        `"${s.name}"`,
        s.rollNumber,
        `"${s.cohort}"`,
        s.overallPercentage,
        s.gpa.toFixed(2),
        s.attendanceRate,
        s.status,
        s.subjects.mathematics.overallScore,
        s.subjects.physics.overallScore,
        s.subjects.chemistry.overallScore,
        s.subjects.english.overallScore,
        s.subjects.computerScience.overallScore,
        s.subjects.history.overallScore,
        missing
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ScholarPulse_Student_Performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const sampleHeaders = 'Name,RollNumber,Cohort,Attendance,Mathematics,Physics,Chemistry,English,ComputerScience,History';
    const sampleRow1 = 'Jordan Miller,2026-N101,Grade 11-AP,94.5,88,85,90,92,95,89';
    const sampleRow2 = 'Maya Lin,2026-N102,Grade 10-A,89.0,78,76,82,88,80,84';
    const csvContent = [sampleHeaders, sampleRow1, sampleRow2].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'scholarpulse_sample_roster_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('CSV file must have a header row and at least one student record.');
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const importedList: Student[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          if (values.length < 5) continue;

          const rowData: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowData[h] = values[idx] || '';
          });

          const studentName = rowData['name'] || `Student ${i}`;
          const roll = rowData['rollnumber'] || rowData['roll'] || `2026-U${100 + i}`;
          const cohort = rowData['cohort'] || 'Grade 11-AP';
          const attendance = parseFloat(rowData['attendance'] || rowData['attendancerate'] || '90') || 90;

          const mathScore = parseFloat(rowData['mathematics'] || rowData['math'] || '80') || 80;
          const physScore = parseFloat(rowData['physics'] || '80') || 80;
          const chemScore = parseFloat(rowData['chemistry'] || '80') || 80;
          const engScore = parseFloat(rowData['english'] || '80') || 80;
          const csScore = parseFloat(rowData['computerscience'] || rowData['cs'] || '80') || 80;
          const histScore = parseFloat(rowData['history'] || '80') || 80;

          const studentRaw: Student = {
            id: `STU-IMP-${Date.now()}-${i}`,
            name: studentName,
            rollNumber: roll,
            cohort,
            attendanceRate: attendance,
            targetGpa: 3.5,
            rank: i,
            overallPercentage: 0,
            gpa: 0,
            status: 'On Track',
            generalObservations: 'Imported via CSV record.',
            subjects: {
              mathematics: { subjectName: 'Advanced Mathematics', quizzes: mathScore, midterm: mathScore, labOrProject: mathScore, finalExam: mathScore, overallScore: mathScore, letterGrade: calculateLetterGrade(mathScore), missingAssignments: 0, teacherFeedback: 'Imported grade.' },
              physics: { subjectName: 'Applied Physics & Lab', quizzes: physScore, midterm: physScore, labOrProject: physScore, finalExam: physScore, overallScore: physScore, letterGrade: calculateLetterGrade(physScore), missingAssignments: 0, teacherFeedback: 'Imported grade.' },
              chemistry: { subjectName: 'Chemistry & Analysis', quizzes: chemScore, midterm: chemScore, labOrProject: chemScore, finalExam: chemScore, overallScore: chemScore, letterGrade: calculateLetterGrade(chemScore), missingAssignments: 0, teacherFeedback: 'Imported grade.' },
              english: { subjectName: 'English Literature & Rhetoric', quizzes: engScore, midterm: engScore, labOrProject: engScore, finalExam: engScore, overallScore: engScore, letterGrade: calculateLetterGrade(engScore), missingAssignments: 0, teacherFeedback: 'Imported grade.' },
              computerScience: { subjectName: 'Computer Science & Algorithms', quizzes: csScore, midterm: csScore, labOrProject: csScore, finalExam: csScore, overallScore: csScore, letterGrade: calculateLetterGrade(csScore), missingAssignments: 0, teacherFeedback: 'Imported grade.' },
              history: { subjectName: 'World History & Civilizations', quizzes: histScore, midterm: histScore, labOrProject: histScore, finalExam: histScore, overallScore: histScore, letterGrade: calculateLetterGrade(histScore), missingAssignments: 0, teacherFeedback: 'Imported grade.' },
            },
            competencies: {
              analyticalThinking: Math.round((mathScore + csScore) / 2),
              scientificInquiry: Math.round((physScore + chemScore) / 2),
              verbalExpression: engScore,
              computationalLogic: csScore,
              collaboration: 82,
              problemSolving: mathScore,
            },
            examHistory: [
              { examName: 'Diagnostic', score: Math.round((mathScore + engScore) / 2) - 4, cohortAvg: 76 },
              { examName: 'Midterm 1', score: Math.round((mathScore + engScore) / 2) - 2, cohortAvg: 77 },
              { examName: 'Midterm 2', score: Math.round((mathScore + engScore) / 2), cohortAvg: 78 },
              { examName: 'Semester Final', score: Math.round((mathScore + engScore) / 2) + 2, cohortAvg: 80 },
            ],
            interventions: [],
            remedialTasks: []
          };

          importedList.push(recalculateStudentDerivedMetrics(studentRaw));
        }

        if (importedList.length === 0) {
          throw new Error('No valid student rows could be parsed from the file.');
        }

        onImportStudents(importedList);
        setImportStatus(`Successfully loaded ${importedList.length} student records.`);
      } catch (err: any) {
        setImportError(err?.message || 'Failed to parse CSV file. Please verify columns.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Academic Data Management</h3>
            <p className="text-xs text-slate-500">Export reports, upload custom CSV roster, or reset cohort defaults</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Export Section */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Export Cohort Performance Ledger</h4>
                <p className="text-slate-500 text-[11px]">Download all {students.length} student records, subject breakdowns, and attendance as CSV</p>
              </div>
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Import Student Roster (CSV)</h4>
                <p className="text-slate-500 text-[11px]">Upload CSV containing Name, RollNumber, Cohort, Attendance, and Subject scores</p>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="text-xs text-slate-600 hover:text-slate-900 underline shrink-0"
              >
                Download Template
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-50/50 transition-colors"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Click to select CSV file from your computer</span>
              <span className="text-[10px] text-slate-400">Supports standard comma-delimited tables</span>
            </button>

            {importStatus && (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}

            {importError && (
              <div className="flex items-center gap-2 p-2.5 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">Reset to Sample Dataset</div>
              <div className="text-[11px] text-slate-500">Restore the curated 16-student academic cohort dataset</div>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all current changes back to the default curated dataset?')) {
                  onResetDefault();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
