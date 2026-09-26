import React, { useState } from 'react';
import { Student } from '../types/student';
import { AlertTriangle, Clock, ArrowRight, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SUBJECT_KEYS, SUBJECT_METADATA } from '../utils/analytics';

interface InterventionHubProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onUpdateStudent: (updated: Student) => void;
}

export const InterventionHub: React.FC<InterventionHubProps> = ({
  students,
  onSelectStudent,
  onUpdateStudent
}) => {
  const [filterType, setFilterType] = useState<'all' | 'attendance' | 'missing' | 'failing' | 'trajectory'>('all');

  // Categorize at-risk triggers
  const atRiskStudents = students.filter(
    (s) => s.status === 'Critical Risk' || s.status === 'Needs Attention'
  );

  const attendanceAlerts = atRiskStudents.filter((s) => s.attendanceRate < 80);
  
  const missingAlerts = atRiskStudents.filter((s) => {
    const missing = SUBJECT_KEYS.reduce((sum, k) => sum + (s.subjects[k]?.missingAssignments || 0), 0);
    return missing >= 2;
  });

  const failingAlerts = atRiskStudents.filter((s) => {
    return SUBJECT_KEYS.some((k) => s.subjects[k]?.overallScore < 65);
  });

  const trajectoryAlerts = atRiskStudents.filter((s) => {
    const h = s.examHistory;
    return h.length >= 2 && h[h.length - 1].score < h[0].score - 6;
  });

  const displayList = atRiskStudents.filter((s) => {
    if (filterType === 'attendance') return s.attendanceRate < 80;
    if (filterType === 'missing') {
      const missing = SUBJECT_KEYS.reduce((sum, k) => sum + (s.subjects[k]?.missingAssignments || 0), 0);
      return missing >= 2;
    }
    if (filterType === 'failing') {
      return SUBJECT_KEYS.some((k) => s.subjects[k]?.overallScore < 65);
    }
    if (filterType === 'trajectory') {
      const h = s.examHistory;
      return h.length >= 2 && h[h.length - 1].score < h[0].score - 6;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Academic Early Warning & Intervention Center
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Automated detection flags learners crossing critical thresholds in attendance attrition, prerequisite failure, or coursework deficits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500">Active Flags: </span>
              <span className="text-sm font-bold font-mono text-rose-700 tabular-nums">
                {atRiskStudents.length} Students
              </span>
            </div>
          </div>
        </div>

        {/* Warning Category Triggers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200">
          <button
            onClick={() => setFilterType(filterType === 'attendance' ? 'all' : 'attendance')}
            className={`p-3 text-left rounded-lg border transition-all ${
              filterType === 'attendance'
                ? 'bg-rose-50 border-rose-400'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] text-slate-600 font-medium">Chronic Absenteeism</div>
            <div className="text-xl font-bold font-mono text-rose-700 mt-0.5 tabular-nums">
              {attendanceAlerts.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">&lt; 80% instructional attendance</div>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'missing' ? 'all' : 'missing')}
            className={`p-3 text-left rounded-lg border transition-all ${
              filterType === 'missing'
                ? 'bg-amber-50 border-amber-400'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] text-slate-600 font-medium">Coursework Deficit</div>
            <div className="text-xl font-bold font-mono text-amber-700 mt-0.5 tabular-nums">
              {missingAlerts.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">&ge; 2 unsubmitted assignments</div>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'failing' ? 'all' : 'failing')}
            className={`p-3 text-left rounded-lg border transition-all ${
              filterType === 'failing'
                ? 'bg-rose-50 border-rose-400'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] text-slate-600 font-medium">Sub-65% Subject Grade</div>
            <div className="text-xl font-bold font-mono text-rose-700 mt-0.5 tabular-nums">
              {failingAlerts.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Critical subject remediation</div>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'trajectory' ? 'all' : 'trajectory')}
            className={`p-3 text-left rounded-lg border transition-all ${
              filterType === 'trajectory'
                ? 'bg-blue-50 border-blue-400'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] text-slate-600 font-medium">Exam Deceleration</div>
            <div className="text-xl font-bold font-mono text-blue-700 mt-0.5 tabular-nums">
              {trajectoryAlerts.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">&gt; 6% drop from diagnostic</div>
          </button>
        </div>
      </div>

      {/* Flagged Student Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Displaying {displayList.length} Flagged Learners {filterType !== 'all' ? `(${filterType})` : ''}
          </span>
          {filterType !== 'all' && (
            <button
              onClick={() => setFilterType('all')}
              className="text-slate-700 hover:text-slate-900 underline"
            >
              Show All Risk Flags
            </button>
          )}
        </div>

        {displayList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-sm">No Active Students in this Risk Category</p>
            <p className="text-xs text-slate-400 mt-1">All monitored students meet the threshold requirements.</p>
          </div>
        ) : (
          displayList.map((student) => {
            const missing = SUBJECT_KEYS.reduce(
              (sum, k) => sum + (student.subjects[k]?.missingAssignments || 0),
              0
            );

            // Find failing subjects
            const failingSubs = SUBJECT_KEYS.filter(
              (k) => student.subjects[k]?.overallScore < 65
            ).map((k) => `${SUBJECT_METADATA[k].label} (${student.subjects[k].overallScore}%)`);

            const pendingRemedialCount = student.remedialTasks.filter((t) => !t.completed).length;

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 p-4 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 mt-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs mt-0.5">
                      {student.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                      <span className="text-xs font-mono text-slate-400">{student.rollNumber}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-600">{student.cohort}</span>
                      <span className="text-slate-300">·</span>
                      <span className={`text-xs font-semibold ${
                        student.status === 'Critical Risk' ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        {student.status}
                      </span>
                    </div>

                    {/* Risk Diagnosis Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
                      {student.attendanceRate < 80 && (
                        <span className="text-rose-700 font-medium">
                          Attendance: {student.attendanceRate}%
                        </span>
                      )}
                      {missing > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-amber-700 font-medium">
                            {missing} missing assignments
                          </span>
                        </>
                      )}
                      {failingSubs.length > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-rose-700 font-medium">
                            Failing: {failingSubs.join(', ')}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 italic max-w-2xl">
                      "{student.generalObservations}"
                    </p>
                  </div>
                </div>

                {/* Right Action stats */}
                <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Overall GPA</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                      {student.gpa.toFixed(2)} ({student.overallPercentage}%)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">Pending Tasks</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-700">
                      {pendingRemedialCount} tasks
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors">
                    <span>Manage Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
