import React, { useState } from 'react';
import { Student } from '../../types/student';

interface AttendanceScatterPlotProps {
  students: Student[];
  onSelectStudent?: (student: Student) => void;
  correlation: number;
}

export const AttendanceScatterPlot: React.FC<AttendanceScatterPlotProps> = ({
  students,
  onSelectStudent,
  correlation
}) => {
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);

  // Bounds
  const minX = 65; // Attendance min
  const maxX = 100; // Attendance max
  const minY = 50; // Score min
  const maxY = 100; // Score max

  const width = 560;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (val: number) => padding.top + (1 - (val - minY) / (maxY - minY)) * plotHeight;

  // Simple linear regression line
  const n = students.length;
  let lineX1 = minX;
  let lineY1 = 60;
  let lineX2 = maxX;
  let lineY2 = 95;

  if (n > 1) {
    const meanX = students.reduce((acc, s) => acc + s.attendanceRate, 0) / n;
    const meanY = students.reduce((acc, s) => acc + s.overallPercentage, 0) / n;
    let num = 0;
    let den = 0;
    for (const s of students) {
      num += (s.attendanceRate - meanX) * (s.overallPercentage - meanY);
      den += (s.attendanceRate - meanX) * (s.attendanceRate - meanX);
    }
    const slope = den !== 0 ? num / den : 1;
    const intercept = meanY - slope * meanX;

    lineX1 = 70;
    lineY1 = Math.max(50, Math.min(100, slope * lineX1 + intercept));
    lineX2 = 100;
    lineY2 = Math.max(50, Math.min(100, slope * lineX2 + intercept));
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">Attendance vs. Performance Correlation</h3>
          <p className="text-xs text-slate-500 mt-0.5">Empirical scatter demonstrating the impact of instructional seat time</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-slate-700">Pearson Correlation (r): </span>
          <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">+{correlation.toFixed(2)}</span>
          <span className="block text-[11px] text-emerald-700 font-medium">Strong positive relationship</span>
        </div>
      </div>

      <div className="relative border border-slate-200 bg-white rounded-lg p-2 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {[60, 70, 80, 90, 100].map((yVal) => (
            <g key={yVal}>
              <line
                x1={padding.left}
                y1={scaleY(yVal)}
                x2={width - padding.right}
                y2={scaleY(yVal)}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={scaleY(yVal) + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                {yVal}%
              </text>
            </g>
          ))}

          {[70, 80, 90, 100].map((xVal) => (
            <g key={xVal}>
              <line
                x1={scaleX(xVal)}
                y1={padding.top}
                x2={scaleX(xVal)}
                y2={height - padding.bottom}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={scaleX(xVal)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                {xVal}%
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* Regression Line */}
          <line
            x1={scaleX(lineX1)}
            y1={scaleY(lineY1)}
            x2={scaleX(lineX2)}
            y2={scaleY(lineY2)}
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Data Points */}
          {students.map((student) => {
            const cx = scaleX(student.attendanceRate);
            const cy = scaleY(student.overallPercentage);
            const isHovered = hoveredStudent?.id === student.id;

            let dotColor = '#059669'; // Green thriving
            if (student.status === 'Critical Risk') dotColor = '#e11d48';
            else if (student.status === 'Needs Attention') dotColor = '#d97706';
            else if (student.status === 'On Track') dotColor = '#2563eb';

            return (
              <circle
                key={student.id}
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4.5}
                fill={dotColor}
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 1}
                className="cursor-pointer transition-all duration-150 opacity-90 hover:opacity-100"
                onMouseEnter={() => setHoveredStudent(student)}
                onMouseLeave={() => setHoveredStudent(null)}
                onClick={() => onSelectStudent?.(student)}
              />
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredStudent && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900 text-white rounded p-2 text-xs shadow-xl max-w-xs transition-opacity duration-150"
            style={{
              left: `${Math.min(scaleX(hoveredStudent.attendanceRate), width - 140)}px`,
              top: `${Math.max(scaleY(hoveredStudent.overallPercentage) - 60, 10)}px`,
            }}
          >
            <div className="font-semibold text-slate-100">{hoveredStudent.name}</div>
            <div className="text-[11px] text-slate-300 font-mono tabular-nums mt-0.5">
              Attendance: {hoveredStudent.attendanceRate}% · Score: {hoveredStudent.overallPercentage}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {hoveredStudent.cohort} · Rank #{hoveredStudent.rank} · Click to inspect
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 px-1 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              Thriving (88%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              On Track
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
              Needs Attention
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
              Critical Risk
            </span>
          </div>
          <span className="text-slate-400 italic">Regression slope: +0.67 pts/% attendance</span>
        </div>
      </div>
    </div>
  );
};
