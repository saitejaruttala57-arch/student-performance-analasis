import React, { useState } from 'react';
import { Student, SubjectKey } from '../types/student';
import { SUBJECT_KEYS, SUBJECT_METADATA, recalculateStudentDerivedMetrics, calculateLetterGrade } from '../utils/analytics';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  onClose,
  onAddStudent
}) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState(`2026-N${Math.floor(100 + Math.random() * 900)}`);
  const [cohort, setCohort] = useState('Grade 11-AP');
  const [attendanceRate, setAttendanceRate] = useState<number>(92.0);
  const [targetGpa, setTargetGpa] = useState<number>(3.5);
  const [observations, setObservations] = useState('');

  // Default subject scores
  const [subjectScores, setSubjectScores] = useState<Record<SubjectKey, { quizzes: number; midterm: number; lab: number; final: number; missing: number }>>({
    mathematics: { quizzes: 85, midterm: 82, lab: 88, final: 84, missing: 0 },
    physics: { quizzes: 82, midterm: 80, lab: 86, final: 81, missing: 0 },
    chemistry: { quizzes: 80, midterm: 84, lab: 85, final: 82, missing: 0 },
    english: { quizzes: 88, midterm: 86, lab: 90, final: 89, missing: 0 },
    computerScience: { quizzes: 90, midterm: 92, lab: 94, final: 91, missing: 0 },
    history: { quizzes: 86, midterm: 85, lab: 87, final: 86, missing: 0 },
  });

  const handleScoreChange = (subject: SubjectKey, field: 'quizzes' | 'midterm' | 'lab' | 'final' | 'missing', value: number) => {
    setSubjectScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subjectsRecord: any = {};
    SUBJECT_KEYS.forEach((k) => {
      const s = subjectScores[k];
      const overall = Number(((s.quizzes * 0.2) + (s.midterm * 0.3) + (s.lab * 0.2) + (s.final * 0.3)).toFixed(1));
      subjectsRecord[k] = {
        subjectName: SUBJECT_METADATA[k].label,
        quizzes: s.quizzes,
        midterm: s.midterm,
        labOrProject: s.lab,
        finalExam: s.final,
        overallScore: overall,
        letterGrade: calculateLetterGrade(overall),
        missingAssignments: s.missing,
        teacherFeedback: 'Evaluated according to standard course criteria.'
      };
    });

    const newStudentRaw: Student = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      cohort,
      attendanceRate,
      targetGpa,
      rank: 99,
      overallPercentage: 0,
      gpa: 0,
      status: 'On Track',
      generalObservations: observations.trim() || 'Newly enrolled academic record.',
      subjects: subjectsRecord,
      competencies: {
        analyticalThinking: 82,
        scientificInquiry: 80,
        verbalExpression: 85,
        computationalLogic: 88,
        collaboration: 85,
        problemSolving: 83,
      },
      examHistory: [
        { examName: 'Diagnostic', score: 80, cohortAvg: 76 },
        { examName: 'Midterm 1', score: 82, cohortAvg: 77 },
        { examName: 'Midterm 2', score: 84, cohortAvg: 78 },
        { examName: 'Semester Final', score: 85, cohortAvg: 80 },
      ],
      interventions: [],
      remedialTasks: []
    };

    const studentWithMetrics = recalculateStudentDerivedMetrics(newStudentRaw);
    onAddStudent(studentWithMetrics);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Student Academic Record</h3>
            <p className="text-xs text-slate-500">Create new learner profile with initial subject scores and attendance</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section 1: Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Roll Number / Student ID
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Cohort / Grade Section
              </label>
              <select
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
              >
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 10-B">Grade 10-B</option>
                <option value="Grade 11-AP">Grade 11-AP</option>
                <option value="Grade 12-Honors">Grade 12-Honors</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Attendance Percentage (%)
              </label>
              <input
                type="number"
                min="40"
                max="100"
                step="0.5"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target GPA (4.0 Scale)
              </label>
              <input
                type="number"
                min="1.0"
                max="4.0"
                step="0.1"
                value={targetGpa}
                onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          {/* Section 2: Subject Assessments */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Initial Subject Assessments
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Input score components (0–100%) for automated weighted composite calculation.
            </p>

            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <div className="grid grid-cols-6 gap-2 text-[10px] font-semibold text-slate-500 uppercase px-1">
                <span className="col-span-2">Subject</span>
                <span className="text-right">Quiz %</span>
                <span className="text-right">Midterm %</span>
                <span className="text-right">Final %</span>
                <span className="text-right">Missing</span>
              </div>

              {SUBJECT_KEYS.map((k) => {
                const s = subjectScores[k];
                return (
                  <div key={k} className="grid grid-cols-6 gap-2 items-center bg-white p-2 rounded border border-slate-200">
                    <span className="col-span-2 font-medium text-slate-900 truncate">
                      {SUBJECT_METADATA[k].label}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.quizzes}
                      onChange={(e) => handleScoreChange(k, 'quizzes', parseInt(e.target.value) || 0)}
                      className="px-2 py-1 border border-slate-300 rounded text-right font-mono"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.midterm}
                      onChange={(e) => handleScoreChange(k, 'midterm', parseInt(e.target.value) || 0)}
                      className="px-2 py-1 border border-slate-300 rounded text-right font-mono"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.final}
                      onChange={(e) => handleScoreChange(k, 'final', parseInt(e.target.value) || 0)}
                      className="px-2 py-1 border border-slate-300 rounded text-right font-mono"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={s.missing}
                      onChange={(e) => handleScoreChange(k, 'missing', parseInt(e.target.value) || 0)}
                      className="px-2 py-1 border border-slate-300 rounded text-right font-mono"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              General Advisor Observations
            </label>
            <textarea
              rows={2}
              placeholder="Initial intake remarks or academic notes..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
            >
              Save Student Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
