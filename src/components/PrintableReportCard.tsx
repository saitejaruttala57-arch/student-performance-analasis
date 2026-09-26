import React from 'react';
import { Student } from '../types/student';
import { SUBJECT_KEYS, SUBJECT_METADATA } from '../utils/analytics';
import { Printer, X, Award, CheckCircle } from 'lucide-react';

interface PrintableReportCardProps {
  student?: Student | null;
  students?: Student[];
  onClose: () => void;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  student,
  students,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  // If a single student is selected, print their transcript.
  // Otherwise, print cohort executive summary report.
  const targetStudents = student ? [student] : (students || []).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 flex items-center justify-center p-4">
      {/* Floating Toolbar (hidden in print) */}
      <div className="no-print fixed top-4 right-4 z-60 flex items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-lg shadow-xl border border-slate-300">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white w-full max-w-4xl min-h-[90vh] p-8 md:p-12 shadow-2xl rounded-lg text-slate-900 my-8">
        {targetStudents.map((st, sIndex) => (
          <div key={st.id} className={`${sIndex > 0 ? 'mt-16 pt-16 border-t-2 border-slate-300 break-before-page' : ''}`}>
            {/* Formal Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
              <div>
                <div className="text-xl font-bold uppercase tracking-wider text-slate-900">
                  ScholarPulse Academic Board
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Official Academic Performance Dossier & Semester Evaluation
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Accreditation Code: ACAD-REG-2026 · Academic Year 2025–2026
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-slate-900">
                  DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-xs font-mono text-slate-600 mt-0.5">
                  RECORD ID: {st.id}
                </div>
              </div>
            </div>

            {/* Student Bio Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded mb-6 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Student Name</span>
                <span className="font-bold text-sm text-slate-900">{st.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Roll / Identification</span>
                <span className="font-mono font-semibold text-slate-900">{st.rollNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Grade & Section</span>
                <span className="font-semibold text-slate-900">{st.cohort}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Standing</span>
                <span className="font-mono font-bold text-slate-900">Rank #{st.rank}</span>
              </div>
            </div>

            {/* Key Composite Performance */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 border border-slate-300 rounded text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500">Cumulative GPA (4.0)</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {st.gpa.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">Scale max 4.00</span>
              </div>

              <div className="p-3 border border-slate-300 rounded text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500">Overall Mastery</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {st.overallPercentage}%
                </div>
                <span className="text-[10px] text-slate-500">
                  Standing: {st.status}
                </span>
              </div>

              <div className="p-3 border border-slate-300 rounded text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500">Instructional Attendance</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {st.attendanceRate}%
                </div>
                <span className="text-[10px] text-slate-500">
                  {st.attendanceRate >= 90 ? 'Regular' : 'Audit Required'}
                </span>
              </div>
            </div>

            {/* Official Subject Marks Table */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Certified Curriculum Performance Ledger
              </h4>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Course Code</th>
                    <th className="p-2 border-r border-slate-300">Subject Description</th>
                    <th className="p-2 border-r border-slate-300 text-right">Credits</th>
                    <th className="p-2 border-r border-slate-300 text-right">Quizzes</th>
                    <th className="p-2 border-r border-slate-300 text-right">Midterm</th>
                    <th className="p-2 border-r border-slate-300 text-right">Final Exam</th>
                    <th className="p-2 border-r border-slate-300 text-right">Score %</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                  {SUBJECT_KEYS.map((k) => {
                    const sub = st.subjects[k];
                    const meta = SUBJECT_METADATA[k];
                    return (
                      <tr key={k}>
                        <td className="p-2 border-r border-slate-300 font-semibold">{meta.code}</td>
                        <td className="p-2 border-r border-slate-300 font-sans">{meta.label}</td>
                        <td className="p-2 border-r border-slate-300 text-right">{meta.credits}</td>
                        <td className="p-2 border-r border-slate-300 text-right">{sub.quizzes}%</td>
                        <td className="p-2 border-r border-slate-300 text-right">{sub.midterm}%</td>
                        <td className="p-2 border-r border-slate-300 text-right">{sub.finalExam}%</td>
                        <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-900">{sub.overallScore}%</td>
                        <td className="p-2 text-center font-bold text-slate-900 font-sans">{sub.letterGrade}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cognitive Competencies */}
            <div className="mb-6 p-4 border border-slate-200 rounded bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Demonstrated Cognitive & Practical Competencies
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Analytical Thinking:</span>{' '}
                  <strong className="font-mono tabular-nums">{st.competencies.analyticalThinking}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Scientific Inquiry:</span>{' '}
                  <strong className="font-mono tabular-nums">{st.competencies.scientificInquiry}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Verbal Expression:</span>{' '}
                  <strong className="font-mono tabular-nums">{st.competencies.verbalExpression}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Computational Logic:</span>{' '}
                  <strong className="font-mono tabular-nums">{st.competencies.computationalLogic}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Peer Collaboration:</span>{' '}
                  <strong className="font-mono tabular-nums">{st.competencies.collaboration}%</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Problem Solving:</span>{' '}
                  <strong className="font-mono tabular-nums">{st.competencies.problemSolving}%</strong>
                </div>
              </div>
            </div>

            {/* General Remarks & Signatures */}
            <div className="pt-4 border-t border-slate-300 text-xs">
              <div className="mb-8">
                <span className="font-bold text-slate-900">Faculty Advisory Note: </span>
                <span className="italic text-slate-700">"{st.generalObservations}"</span>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-semibold text-slate-800 block">Class Dean / Advisor</span>
                  <span className="text-[10px] text-slate-500">Dr. Katherine Bell</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-semibold text-slate-800 block">Department Chair</span>
                  <span className="text-[10px] text-slate-500">Prof. Marcus Vance</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-semibold text-slate-800 block">Office of the Registrar</span>
                  <span className="text-[10px] text-slate-500">Institutional Seal Affixed</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
