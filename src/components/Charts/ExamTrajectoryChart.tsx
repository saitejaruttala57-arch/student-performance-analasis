import React from 'react';
import { ExamPoint } from '../../types/student';

interface ExamTrajectoryChartProps {
  examHistory: ExamPoint[];
  studentName?: string;
}

export const ExamTrajectoryChart: React.FC<ExamTrajectoryChartProps> = ({
  examHistory,
  studentName
}) => {
  if (!examHistory || examHistory.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-slate-400">
        No exam history recorded.
      </div>
    );
  }

  const width = 420;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 40 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minY = 50;
  const maxY = 100;

  const scaleX = (index: number) => {
    return padding.left + (index / (examHistory.length - 1 || 1)) * plotWidth;
  };

  const scaleY = (val: number) => {
    return padding.top + (1 - (val - minY) / (maxY - minY)) * plotHeight;
  };

  // Student path
  const studentPath = examHistory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.score)}`).join(' ');
  // Cohort path
  const cohortPath = examHistory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.cohortAvg)}`).join(' ');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Semester Assessment Trajectory
        </h4>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-0.5 bg-blue-600 inline-block"></span>
            Student Score
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
            Cohort Mean
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Y Grid */}
        {[60, 70, 80, 90, 100].map((y) => (
          <g key={y}>
            <line
              x1={padding.left}
              y1={scaleY(y)}
              x2={width - padding.right}
              y2={scaleY(y)}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={scaleY(y) + 3}
              textAnchor="end"
              className="text-[9px] fill-slate-400 font-mono tabular-nums"
            >
              {y}%
            </text>
          </g>
        ))}

        {/* Cohort average path */}
        <path
          d={cohortPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Student score path */}
        <path
          d={studentPath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
        />

        {/* Points */}
        {examHistory.map((p, i) => {
          const cx = scaleX(i);
          const cy = scaleY(p.score);
          const diff = p.score - p.cohortAvg;

          return (
            <g key={p.examName}>
              {/* Vertical guideline */}
              <line
                x1={cx}
                y1={padding.top}
                x2={cx}
                y2={height - padding.bottom}
                stroke="#f8fafc"
                strokeWidth="1"
              />

              {/* Student Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={4.5}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Score label */}
              <text
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-slate-900 tabular-nums"
              >
                {p.score}%
              </text>

              {/* Delta above or below average */}
              <text
                x={cx}
                y={cy + 16}
                textAnchor="middle"
                className={`text-[8px] font-mono font-semibold tabular-nums ${
                  diff >= 0 ? 'fill-emerald-600' : 'fill-rose-600'
                }`}
              >
                {diff >= 0 ? `+${diff}%` : `${diff}%`}
              </text>

              {/* X Axis Label */}
              <text
                x={cx}
                y={height - padding.bottom + 14}
                textAnchor="middle"
                className="text-[10px] fill-slate-600 font-medium"
              >
                {p.examName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
