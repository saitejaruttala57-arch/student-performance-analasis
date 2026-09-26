import React, { useState } from 'react';

interface GradeDistributionChartProps {
  distribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  totalStudents: number;
  onGradeSelect?: (grade: string | null) => void;
  selectedGrade?: string | null;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  distribution,
  totalStudents,
  onGradeSelect,
  selectedGrade
}) => {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  const grades: Array<{ key: 'A' | 'B' | 'C' | 'D' | 'F'; label: string; range: string; color: string; border: string }> = [
    { key: 'A', label: 'Grade A', range: '90–100%', color: 'bg-emerald-600', border: '#059669' },
    { key: 'B', label: 'Grade B', range: '80–89%', color: 'bg-blue-600', border: '#2563eb' },
    { key: 'C', label: 'Grade C', range: '70–79%', color: 'bg-amber-600', border: '#d97706' },
    { key: 'D', label: 'Grade D', range: '60–69%', color: 'bg-orange-600', border: '#ea580c' },
    { key: 'F', label: 'Grade F', range: '<60%', color: 'bg-rose-600', border: '#e11d48' },
  ];

  const maxCount = Math.max(...Object.values(distribution), 1);
  const chartHeight = 160;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">Grade Distribution</h3>
          <p className="text-xs text-slate-500 mt-0.5">Cohort mastery spread across standard 5-tier academic bands</p>
        </div>
        {selectedGrade && (
          <button
            onClick={() => onGradeSelect?.(null)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="pt-2 pb-1">
        <div className="grid grid-cols-5 gap-3 items-end h-[160px] border-b border-slate-200 px-2">
          {grades.map((g) => {
            const count = distribution[g.key] || 0;
            const pct = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0';
            const barHeightPct = Math.max((count / maxCount) * 100, 4);
            const isSelected = selectedGrade === g.key;
            const isHovered = hoveredGrade === g.key;

            return (
              <div
                key={g.key}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredGrade(g.key)}
                onMouseLeave={() => setHoveredGrade(null)}
                onClick={() => onGradeSelect?.(isSelected ? null : g.key)}
              >
                {/* Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute -top-11 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all">
                    <span className="font-semibold">{g.label}</span>
                    <span className="text-slate-300 mx-1">·</span>
                    <span className="font-mono tabular-nums">{count} students ({pct}%)</span>
                  </div>
                )}

                {/* Count indicator above bar */}
                <span className={`text-[11px] font-mono tabular-nums mb-1 font-medium transition-colors ${
                  isSelected ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-900'
                }`}>
                  {count}
                </span>

                {/* Animated Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 ${g.color} ${
                    selectedGrade && !isSelected ? 'opacity-30' : 'opacity-90 group-hover:opacity-100 group-hover:scale-[1.02]'
                  } ${isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}
                  style={{ height: `${barHeightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Labels below */}
        <div className="grid grid-cols-5 gap-3 px-2 pt-2 text-center">
          {grades.map((g) => (
            <button
              key={g.key}
              onClick={() => onGradeSelect?.(selectedGrade === g.key ? null : g.key)}
              className="text-left flex flex-col items-center focus:outline-none"
            >
              <span className={`text-xs font-semibold transition-colors ${
                selectedGrade === g.key ? 'text-slate-900 font-bold underline' : 'text-slate-700 hover:text-slate-900'
              }`}>
                {g.key}
              </span>
              <span className="text-[10px] text-slate-400 font-mono tabular-nums mt-0.5">{g.range}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
