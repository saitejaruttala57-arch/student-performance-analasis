import React from 'react';
import { CohortStats } from '../types/student';
import { Users, Award, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MetricCardsProps {
  stats: CohortStats;
  selectedCohort: string;
  onFilterAtRisk?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  stats,
  selectedCohort,
  onFilterAtRisk
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-6">
      {/* Metric 1: Total Enrolled */}
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Active Roster</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
          {stats.totalStudents}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          <span>{selectedCohort === 'all' ? 'All 4 Sections' : selectedCohort}</span>
          <span className="mx-1 text-slate-300">·</span>
          <span>100% active</span>
        </div>
      </div>

      {/* Metric 2: Mean GPA */}
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Cohort Mean GPA</span>
          <Award className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
          {stats.meanGpa.toFixed(2)}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          <span className="font-mono tabular-nums font-medium text-slate-700">{stats.medianScore}%</span>
          <span className="text-slate-500"> median score</span>
        </div>
      </div>

      {/* Metric 3: Passing Rate */}
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Overall Pass Rate</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
          {stats.passRatePercentage}%
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          <span>Standard: 65% benchmark</span>
        </div>
      </div>

      {/* Metric 4: Mean Attendance */}
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Instructional Attendance</span>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
          {stats.meanAttendance}%
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          <span>Correlation r = +{stats.attendanceCorrelation.toFixed(2)}</span>
        </div>
      </div>

      {/* Metric 5: At Risk Count */}
      <div 
        onClick={onFilterAtRisk}
        className={`p-4 rounded-lg border transition-all cursor-pointer ${
          stats.atRiskCount > 0 
            ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400' 
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-rose-700 mb-1">
          <span className="font-semibold">At-Risk Interventions</span>
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-2xl font-bold text-rose-900 font-mono tabular-nums">
          {stats.atRiskCount}
        </div>
        <div className="mt-1 text-[11px] text-rose-700">
          <span>Requires intervention · Click to view</span>
        </div>
      </div>
    </div>
  );
};
