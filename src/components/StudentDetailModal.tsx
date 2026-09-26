import React, { useState } from 'react';
import { Student, SubjectKey, InterventionRecord, RemedialTask } from '../types/student';
import { SUBJECT_KEYS, SUBJECT_METADATA, generateHeuristicDiagnosis } from '../utils/analytics';
import { CompetencyRadarChart } from './Charts/CompetencyRadarChart';
import { ExamTrajectoryChart } from './Charts/ExamTrajectoryChart';
import { X, Printer, CheckCircle, Clock, AlertTriangle, Sparkles, BookOpen, UserCheck, ShieldAlert, Plus, Check } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onUpdateStudent: (updated: Student) => void;
  onPrintStudent: (student: Student) => void;
}

type ModalTab = 'overview' | 'gradebook' | 'interventions' | 'diagnostics';

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onUpdateStudent,
  onPrintStudent,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [targetGpaInput, setTargetGpaInput] = useState<number>(student.targetGpa || 3.5);
  const [newInterventionType, setNewInterventionType] = useState<InterventionRecord['type']>('Tutoring');
  const [newInterventionNotes, setNewInterventionNotes] = useState('');
  const [newInterventionFacilitator, setNewInterventionFacilitator] = useState('');
  const [isLoggingIntervention, setIsLoggingIntervention] = useState(false);

  // AI Diagnostic states
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Toggle checklist item
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = student.remedialTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateStudent({
      ...student,
      remedialTasks: updatedTasks,
    });
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const taskInput = form.elements.namedItem('taskTitle') as HTMLInputElement;
    const subjectInput = form.elements.namedItem('taskSubject') as HTMLSelectElement;
    if (!taskInput.value.trim()) return;

    const newTask: RemedialTask = {
      id: `REM-${Date.now().toString().slice(-4)}`,
      title: taskInput.value.trim(),
      subject: subjectInput.value,
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      completed: false,
    };

    onUpdateStudent({
      ...student,
      remedialTasks: [newTask, ...student.remedialTasks],
    });
    taskInput.value = '';
  };

  // Save new intervention
  const handleSaveIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterventionNotes.trim()) return;

    const record: InterventionRecord = {
      id: `INT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      type: newInterventionType,
      status: 'Active',
      notes: newInterventionNotes.trim(),
      facilitator: newInterventionFacilitator.trim() || 'Academic Counselor',
    };

    onUpdateStudent({
      ...student,
      interventions: [record, ...student.interventions],
    });

    setNewInterventionNotes('');
    setNewInterventionFacilitator('');
    setIsLoggingIntervention(false);
  };

  // Run AI Diagnostic
  const handleRunAiDiagnostic = async () => {
    setIsLoadingAi(true);
    setAiError(null);

    try {
      const response = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          studentData: {
            gpa: student.gpa,
            overallPercentage: student.overallPercentage,
            attendanceRate: student.attendanceRate,
            cohort: student.cohort,
            status: student.status,
            subjects: student.subjects,
            competencies: student.competencies,
            examHistory: student.examHistory,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        // Fallback to local heuristic diagnosis
        const local = generateHeuristicDiagnosis(student);
        setAiAnalysis(local);
      }
    } catch (err: any) {
      // Fallback cleanly to local heuristics
      const local = generateHeuristicDiagnosis(student);
      setAiAnalysis(local);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Target GPA calculation: what final exam average is needed?
  // Current score = overallPercentage. Target score needed:
  const targetPctNeeded = Math.min(100, Math.max(50, targetGpaInput * 25));
  const currentDiff = targetPctNeeded - student.overallPercentage;

  const totalMissing = SUBJECT_KEYS.reduce(
    (acc, k) => acc + (student.subjects[k]?.missingAssignments || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-300 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  #{student.rollNumber}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-600">{student.cohort}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Class Rank: <strong className="text-slate-900 font-mono font-semibold tabular-nums">#{student.rank}</strong></span>
                <span className="text-slate-300">·</span>
                <span>GPA: <strong className="text-slate-900 font-mono font-semibold tabular-nums">{student.gpa.toFixed(2)}</strong></span>
                <span className="text-slate-300">·</span>
                <span>Attendance: <strong className="text-slate-900 font-mono font-semibold tabular-nums">{student.attendanceRate}%</strong></span>
                <span className="text-slate-300">·</span>
                <span>Status: <strong className={student.status === 'Critical Risk' ? 'text-rose-700' : student.status === 'Needs Attention' ? 'text-amber-700' : 'text-emerald-700'}>{student.status}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintStudent(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              title="Print Academic Report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Academic Overview
          </button>
          <button
            onClick={() => setActiveTab('gradebook')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'gradebook'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Subject Gradebook & Feedback
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'interventions'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Interventions & Target Planner</span>
            {student.remedialTasks.filter((t) => !t.completed).length > 0 && (
              <span className="font-mono text-[10px] text-amber-700 font-bold tabular-nums">
                ({student.remedialTasks.filter((t) => !t.completed).length})
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('diagnostics');
              if (!aiAnalysis) {
                handleRunAiDiagnostic();
              }
            }}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Academic Diagnostic</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Summary Metric Row */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Cumulative Mastery</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {student.overallPercentage}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Grade {student.overallPercentage >= 90 ? 'A' : student.overallPercentage >= 80 ? 'B' : student.overallPercentage >= 70 ? 'C' : 'D'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Current GPA</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {student.gpa.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Target: {student.targetGpa.toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Attendance Rate</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {student.attendanceRate}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {student.attendanceRate >= 90 ? 'Satisfactory' : 'Needs Intervention'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Missing Submissions</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {totalMissing}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {totalMissing === 0 ? 'All coursework current' : `${totalMissing} deliverables due`}
                  </div>
                </div>
              </div>

              {/* Charts Row: Radar & Trajectory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <CompetencyRadarChart competencies={student.competencies} studentName={student.name} />
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <ExamTrajectoryChart examHistory={student.examHistory} studentName={student.name} />
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">Trajectory Assessment: </span>
                    {student.examHistory.length >= 2 && student.examHistory[student.examHistory.length - 1].score >= student.examHistory[0].score
                      ? 'Upward trend showing positive instructional reception and cumulative reinforcement.'
                      : 'Decelerating trajectory requires diagnostic check on midterm prerequisite retention.'}
                  </div>
                </div>
              </div>

              {/* Subject Score Cards */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Subject Performance Cards</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SUBJECT_KEYS.map((key) => {
                    const sub = student.subjects[key];
                    const meta = SUBJECT_METADATA[key];
                    return (
                      <div key={key} className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-900">{meta.label}</span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {sub.overallScore}%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>Grade {sub.letterGrade}</span>
                          {sub.missingAssignments > 0 ? (
                            <span className="text-rose-600 font-medium">
                              {sub.missingAssignments} missing
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium">On pace</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 italic">
                          "{sub.teacherFeedback}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRADEBOOK */}
          {activeTab === 'gradebook' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Granular Subject Assessment Ledger</h3>
                  <p className="text-xs text-slate-500">Component weighting: Quizzes (20%), Midterm (30%), Projects/Labs (20%), Final (30%)</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-3 py-3 text-right">Quizzes</th>
                      <th className="px-3 py-3 text-right">Midterm</th>
                      <th className="px-3 py-3 text-right">Lab/Proj</th>
                      <th className="px-3 py-3 text-right">Final Exam</th>
                      <th className="px-3 py-3 text-right">Composite</th>
                      <th className="px-3 py-3 text-center">Grade</th>
                      <th className="px-4 py-3">Instructor Evaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SUBJECT_KEYS.map((k) => {
                      const item = student.subjects[k];
                      const meta = SUBJECT_METADATA[k];
                      return (
                        <tr key={k} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            <div>{meta.label}</div>
                            <div className="text-[10px] font-mono text-slate-400">{meta.code}</div>
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                            {item.quizzes}%
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                            {item.midterm}%
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                            {item.labOrProject}%
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                            {item.finalExam}%
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-slate-900">
                            {item.overallScore}%
                          </td>
                          <td className="px-3 py-3 text-center font-bold text-slate-900">
                            {item.letterGrade}
                          </td>
                          <td className="px-4 py-3 text-slate-600 italic">
                            {item.teacherFeedback}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INTERVENTIONS & GOALS */}
          {activeTab === 'interventions' && (
            <div className="space-y-6">
              {/* Target GPA Simulator */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Academic Target & GPA Simulation
                    </h4>
                    <p className="text-xs text-slate-500">
                      Simulate the impact of remaining term assessments on cumulative standing.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Current GPA: </span>
                    <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                      {student.gpa.toFixed(2)}
                    </span>
                    <span className="mx-1 text-slate-400">→</span>
                    <span className="text-xs text-blue-700">Target: </span>
                    <span className="text-xs font-mono font-bold text-blue-900 tabular-nums">
                      {targetGpaInput.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <span className="text-xs font-mono tabular-nums text-slate-500">2.0</span>
                  <input
                    type="range"
                    min="2.0"
                    max="4.0"
                    step="0.05"
                    value={targetGpaInput}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setTargetGpaInput(val);
                      onUpdateStudent({ ...student, targetGpa: val });
                    }}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <span className="text-xs font-mono tabular-nums text-slate-500">4.0</span>
                </div>

                <div className="mt-3 text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-200">
                  <span>
                    To reach target GPA of <strong className="font-mono tabular-nums">{targetGpaInput.toFixed(2)}</strong>, the student must achieve an average of approximately{' '}
                    <strong className="font-mono tabular-nums text-slate-900">{targetPctNeeded.toFixed(0)}%</strong> on upcoming assessments.
                  </span>
                  <span className={`font-mono text-xs font-semibold tabular-nums ${currentDiff <= 0 ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {currentDiff <= 0 ? 'Target currently met' : `+${currentDiff.toFixed(1)}% gain required`}
                  </span>
                </div>
              </div>

              {/* Remedial Task Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Remediation & Assignment Recovery Checklist
                    </h4>
                    <p className="text-xs text-slate-500">Track outstanding makeup assignments and corrective steps</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {student.remedialTasks.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-200 rounded text-center text-xs text-slate-400">
                      No active remedial tasks assigned. Student is in good standing.
                    </div>
                  ) : (
                    student.remedialTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                          task.completed
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-white border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                              task.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white hover:border-slate-500'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <div className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span>{task.subject}</span>
                              <span className="mx-1 text-slate-300">·</span>
                              <span>Due {task.dueDate}</span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[11px] font-medium ${task.completed ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {task.completed ? 'Resolved' : 'Pending'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Quick Remedial Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    name="taskTitle"
                    type="text"
                    placeholder="Add remedial action item (e.g., Quadratic equations test redo)..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <select
                    name="taskSubject"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  >
                    {SUBJECT_KEYS.map((k) => (
                      <option key={k} value={SUBJECT_METADATA[k].label}>
                        {SUBJECT_METADATA[k].label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Add Task
                  </button>
                </form>
              </div>

              {/* Logged Interventions History */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Formal Intervention Records
                    </h4>
                    <p className="text-xs text-slate-500">Documented counseling sessions, parent communications, and tutoring logs</p>
                  </div>
                  <button
                    onClick={() => setIsLoggingIntervention(!isLoggingIntervention)}
                    className="px-3 py-1 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
                  >
                    {isLoggingIntervention ? 'Cancel' : '+ Log Intervention'}
                  </button>
                </div>

                {/* New Intervention Form */}
                {isLoggingIntervention && (
                  <form onSubmit={handleSaveIntervention} className="p-4 bg-slate-50 border border-slate-300 rounded-lg mb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Intervention Type
                        </label>
                        <select
                          value={newInterventionType}
                          onChange={(e) => setNewInterventionType(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                        >
                          <option value="Tutoring">Tutoring & Recitation</option>
                          <option value="Parent Conference">Parent-Teacher Conference</option>
                          <option value="Study Plan">Individualized Study Plan</option>
                          <option value="Counseling">Academic Counseling</option>
                          <option value="Peer Review">Peer Learning Partnership</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Facilitator / Educator
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dr. Roberts, Counselor Hayes"
                          value={newInterventionFacilitator}
                          onChange={(e) => setNewInterventionFacilitator(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Pedagogical Notes & Corrective Mandate
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Detail the discussion points, attendance agreement, or study requirements..."
                        value={newInterventionNotes}
                        onChange={(e) => setNewInterventionNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsLoggingIntervention(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800"
                      >
                        Save Record
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {student.interventions.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 italic">
                      No interventions recorded for this student.
                    </div>
                  ) : (
                    student.interventions.map((record) => (
                      <div key={record.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{record.type}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">{record.facilitator}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-mono tabular-nums">{record.date}</span>
                            <span className={`text-[11px] font-medium ${record.status === 'Resolved' ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {record.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{record.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI & PEDAGOGICAL DIAGNOSTIC */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Automated Pedagogical Diagnostic & Learning Prognosis</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluates multi-subject variance, attendance correlation, and historical exam momentum.
                  </p>
                </div>
                <button
                  onClick={handleRunAiDiagnostic}
                  disabled={isLoadingAi}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoadingAi ? 'Synthesizing...' : 'Regenerate Diagnostic'}</span>
                </button>
              </div>

              {isLoadingAi ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium">Synthesizing multidimensional learning diagnostic...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  {/* Executive Summary */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Diagnostic Executive Summary
                    </h4>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {aiAnalysis.executiveSummary}
                    </p>
                  </div>

                  {/* Strengths & Risk Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                        <span>Core Cognitive Anchor</span>
                      </div>
                      <p className="text-xs text-emerald-950 mt-1">
                        {aiAnalysis.primaryStrength}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        <span>Primary Bottleneck / Risk Factor</span>
                      </div>
                      <p className="text-xs text-amber-950 mt-1">
                        {aiAnalysis.criticalRiskFactor}
                      </p>
                    </div>
                  </div>

                  {/* Targeted Action Interventions */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Prioritized Pedagogical Interventions
                    </h4>
                    <div className="space-y-2">
                      {(aiAnalysis.recommendedInterventions || []).map((step: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-0.5">
                              <span className="font-semibold text-slate-900">{step.title}</span>
                              <span className={`text-[10px] font-mono font-semibold uppercase ${
                                step.priority === 'High' ? 'text-rose-700' : 'text-blue-700'
                              }`}>
                                {step.priority} Priority
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{step.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prognosis */}
                  <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 text-xs text-blue-950">
                    <span className="font-semibold text-blue-900">Projected Outcome: </span>
                    <span>{aiAnalysis.projectedTrajectory}</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Student Dossier · ScholarPulse Records</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
