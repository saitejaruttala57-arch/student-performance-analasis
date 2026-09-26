import React, { useState } from 'react';
import { SubjectKey } from '../../types/student';
import { SUBJECT_METADATA, SUBJECT_KEYS } from '../../utils/analytics';

interface SubjectBarChartProps {
  subjectAverages: Record<SubjectKey, number>;
  onSubjectClick?: (subject: SubjectKey) => void;
  selectedSubject?: SubjectKey | null;
}

export const SubjectBarChart: React.FC<SubjectBarChartProps> = ({
  subjectAverages,
  onSubjectClick,
  selectedSubject
}) => {
  const [hoveredSubject, setHoveredSubject] = useState<SubjectKey | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-600';
    if (score >= 80) return 'bg-blue-600';
    if (score >= 70) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">Subject Mastery Index</h3>
          <p className="text-xs text-slate-500 mt-0.5">Mean performance across departmental curricula</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-dashed border-t-2 border-dashed border-slate-400 inline-block w-4"></span>
            70% Pass Standard
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {SUBJECT_KEYS.map((key) => {
          const meta = SUBJECT_METADATA[key];
          const avg = subjectAverages[key] || 0;
          const isSelected = selectedSubject === key;
          const isHovered = hoveredSubject === key;

          return (
            <div
              key={key}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected 
                  ? 'border-slate-900 bg-slate-100/60 shadow-xs' 
                  : isHovered 
                  ? 'border-slate-300 bg-slate-50/80' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onMouseEnter={() => setHoveredSubject(key)}
              onMouseLeave={() => setHoveredSubject(null)}
              onClick={() => onSubjectClick?.(key)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{meta.label}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{meta.code}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 text-[11px]">{meta.credits} credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono tabular-nums font-semibold text-slate-900 text-xs">
                    {avg.toFixed(1)}%
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {avg >= 85 ? 'High Mastery' : avg >= 70 ? 'Proficient' : 'Remediation Needed'}
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="relative w-full h-3 bg-slate-100 rounded overflow-hidden">
                {/* 70% passing threshold mark */}
                <div 
                  className="absolute top-0 bottom-0 w-[1.5px] bg-slate-400 z-10" 
                  style={{ left: '70%' }} 
                  title="70% Passing Threshold"
                />
                {/* 85% high proficiency mark */}
                <div 
                  className="absolute top-0 bottom-0 w-[1.5px] bg-slate-300 z-10" 
                  style={{ left: '85%' }} 
                  title="85% High Proficiency"
                />

                <div
                  className={`h-full rounded transition-all duration-500 ${getScoreColor(avg)} ${
                    selectedSubject && !isSelected ? 'opacity-40' : 'opacity-90'
                  }`}
                  style={{ width: `${Math.min(Math.max(avg, 2), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
