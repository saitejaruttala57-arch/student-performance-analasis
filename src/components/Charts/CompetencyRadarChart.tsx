import React from 'react';
import { CompetencyMetrics } from '../../types/student';

interface CompetencyRadarChartProps {
  competencies: CompetencyMetrics;
  studentName?: string;
}

export const CompetencyRadarChart: React.FC<CompetencyRadarChartProps> = ({
  competencies,
  studentName
}) => {
  const axes: Array<{ key: keyof CompetencyMetrics; label: string }> = [
    { key: 'analyticalThinking', label: 'Analytical Thinking' },
    { key: 'scientificInquiry', label: 'Scientific Inquiry' },
    { key: 'verbalExpression', label: 'Verbal Expression' },
    { key: 'computationalLogic', label: 'Computational Logic' },
    { key: 'collaboration', label: 'Collaboration' },
    { key: 'problemSolving', label: 'Problem Solving' },
  ];

  const size = 320;
  const center = size / 2;
  const radius = 105;
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Calculate coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Polygon path for student values
  const points = axes.map((axis, i) => {
    const val = competencies[axis.key] || 0;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  // Concentric levels (25, 50, 75, 100)
  const levels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-1">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Cognitive Competency Profile
        </h4>
        <span className="text-[11px] font-mono text-slate-500 tabular-nums">Scale 0–100</span>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible select-none">
        {/* Background concentric polygons */}
        {levels.map((level) => {
          const levelPoints = axes.map((_, i) => {
            const { x, y } = getCoordinates(level, i);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={level}>
              <polygon
                points={levelPoints}
                fill={level === 100 ? '#f8fafc' : 'none'}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={center + 4}
                y={center - (level / 100) * radius - 2}
                className="text-[9px] fill-slate-400 font-mono"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Axis spokes */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Student competency polygon */}
        <polygon
          points={points}
          fill="rgba(37, 99, 235, 0.18)"
          stroke="#2563eb"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Data points on vertices */}
        {axes.map((axis, i) => {
          const val = competencies[axis.key] || 0;
          const { x, y } = getCoordinates(val, i);
          return (
            <circle
              key={axis.key}
              cx={x}
              cy={y}
              r={4}
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const angle = indexToAngle(i, numAxes);
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const val = competencies[axis.key] || 0;

          return (
            <g key={axis.key}>
              <text
                x={lx}
                y={ly}
                textAnchor={getTextAnchor(angle)}
                alignmentBaseline="middle"
                className="text-[10px] font-medium fill-slate-700"
              >
                {axis.label}
              </text>
              <text
                x={lx}
                y={ly + 11}
                textAnchor={getTextAnchor(angle)}
                alignmentBaseline="middle"
                className="text-[10px] font-mono fill-slate-500 font-semibold tabular-nums"
              >
                {val}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

function indexToAngle(index: number, total: number) {
  return index * ((Math.PI * 2) / total) - Math.PI / 2;
}

function getTextAnchor(angle: number): 'start' | 'middle' | 'end' {
  const cos = Math.cos(angle);
  if (Math.abs(cos) < 0.25) return 'middle';
  return cos > 0 ? 'start' : 'end';
}
