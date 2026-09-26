import React, { useState } from 'react';
import { Student, SubjectKey } from '../types/student';
import { SUBJECT_KEYS, SUBJECT_METADATA } from '../utils/analytics';
import { BookOpen, Award, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface SubjectMatrixViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const SubjectMatrixView: React.FC<SubjectMatrixViewProps> = ({
  students,
  onSelectStudent
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('mathematics');

  // Compute metrics for active subject
  const currentSubjectData = React.useMemo(() => {
    const scores = students.map((s) => ({
      student: s,
      assessment: s.subjects[activeSubject],
      score: s.subjects[activeSubject]?.overallScore || 0,
    }));

    scores.sort((a, b) => b.score - a.score);

    const mean = scores.reduce((sum, item) => sum + item.score, 0) / (scores.length || 1);
    
    // Standard deviation
    const variance = scores.reduce((sum, item) => sum + Math.pow(item.score - mean, 2), 0) / (scores.length || 1);
    const stdDev = Math.sqrt(variance);

    // Component averages
    const avgQuizzes = scores.reduce((sum, i) => sum + i.assessment.quizzes, 0) / (scores.length || 1);
    const avgMidterm = scores.reduce((sum, i) => sum + i.assessment.midterm, 0) / (scores.length || 1);
    const avgLabs = scores.reduce((sum, i) => sum + i.assessment.labOrProject, 0) / (scores.length || 1);
    const avgFinal = scores.reduce((sum, i) => sum + i.assessment.finalExam, 0) / (scores.length || 1);

    const passing = scores.filter((i) => i.score >= 70);
    const passRate = (passing.length / (scores.length || 1)) * 100;

    const topScholars = scores.slice(0, 4);
    const supportNeeded = scores.filter((i) => i.score < 75);

    return {
      mean: Number(mean.toFixed(1)),
      stdDev: Number(stdDev.toFixed(1)),
      avgQuizzes: Number(avgQuizzes.toFixed(1)),
      avgMidterm: Number(avgMidterm.toFixed(1)),
      avgLabs: Number(avgLabs.toFixed(1)),
      avgFinal: Number(avgFinal.toFixed(1)),
      passRate: Number(passRate.toFixed(1)),
      topScholars,
      supportNeeded,
      totalMissing: scores.reduce((sum, i) => sum + (i.assessment.missingAssignments || 0), 0)
    };
  }, [students, activeSubject]);

  const meta = SUBJECT_METADATA[activeSubject];

  return (
    <div className="space-y-6">
      {/* Subject Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {SUBJECT_KEYS.map((k) => {
          const m = SUBJECT_METADATA[k];
          const isSelected = activeSubject === k;
          return (
            <button
              key={k}
              onClick={() => setActiveSubject(k)}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-all whitespace-nowrap border-b-2 ${
                isSelected
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span>{m.label}</span>
              <span className="ml-1.5 text-[10px] font-mono text-slate-400 tabular-nums">
                ({m.code})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Subject Overview Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {meta.label} Assessment Dossier
              </h2>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-mono text-slate-600">{meta.code}</span>
              <span>·</span>
              <span>Academic Weight: {meta.credits} Credit Hours</span>
              <span>·</span>
              <span>Enrollment: {students.length} Students</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-500">Cohort Pass Standard (&ge;70%)</div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {currentSubjectData.passRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Departmental Mean</div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
              {currentSubjectData.mean}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Benchmark: 75% standard</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Standard Deviation (&sigma;)</div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
              &plusmn;{currentSubjectData.stdDev}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Measures cohort spread</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Unsubmitted Coursework</div>
            <div className="text-xl font-bold font-mono text-amber-700 tabular-nums mt-0.5">
              {currentSubjectData.totalMissing} items
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across all enrolled students</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Intervention Candidates</div>
            <div className="text-xl font-bold font-mono text-rose-700 tabular-nums mt-0.5">
              {currentSubjectData.supportNeeded.length} students
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Scoring under 75% threshold</div>
          </div>
        </div>

        {/* Assessment Component Breakdown Bar */}
        <div>
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Assessment Modality Distribution
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded border border-slate-200">
              <div className="text-xs text-slate-500">Continuous Quizzes (20%)</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                {currentSubjectData.avgQuizzes}%
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-slate-200">
              <div className="text-xs text-slate-500">Midterm Exam (30%)</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                {currentSubjectData.avgMidterm}%
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-slate-200">
              <div className="text-xs text-slate-500">Labs & Practicum (20%)</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                {currentSubjectData.avgLabs}%
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-slate-200">
              <div className="text-xs text-slate-500">Final Examination (30%)</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                {currentSubjectData.avgFinal}%
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers vs Learners Needing Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Top Scholars */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Top Subject Scholars
              </h4>
            </div>
            <div className="space-y-2">
              {currentSubjectData.topScholars.map((item, idx) => (
                <div
                  key={item.student.id}
                  onClick={() => onSelectStudent(item.student)}
                  className="p-2.5 bg-white rounded border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-slate-400 font-bold tabular-nums">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 hover:underline">
                        {item.student.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.student.cohort} · Final: {item.assessment.finalExam}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-800 tabular-nums">
                      {item.score}%
                    </span>
                    <span className="block text-[10px] text-slate-400">Grade {item.assessment.letterGrade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Candidates */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Target Remediation Candidates
              </h4>
            </div>
            <div className="space-y-2">
              {currentSubjectData.supportNeeded.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 italic text-center bg-white rounded border border-slate-200">
                  No students currently below the 75% proficiency threshold in this subject.
                </div>
              ) : (
                currentSubjectData.supportNeeded.map((item) => (
                  <div
                    key={item.student.id}
                    onClick={() => onSelectStudent(item.student)}
                    className="p-2.5 bg-white rounded border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 hover:underline">
                        {item.student.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{item.student.cohort}</span>
                        {item.assessment.missingAssignments > 0 && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-rose-600 font-medium">
                              {item.assessment.missingAssignments} missing
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono tabular-nums ${
                        item.score < 65 ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        {item.score}%
                      </span>
                      <span className="block text-[10px] text-slate-400">Grade {item.assessment.letterGrade}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
