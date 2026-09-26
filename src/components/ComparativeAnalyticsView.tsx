import React from 'react';
import { Student } from '../types/student';
import { SUBJECT_KEYS, computeCohortStats } from '../utils/analytics';
import { AttendanceScatterPlot } from './Charts/AttendanceScatterPlot';
import { GradeDistributionChart } from './Charts/GradeDistributionChart';
import { SubjectBarChart } from './Charts/SubjectBarChart';

interface ComparativeAnalyticsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const ComparativeAnalyticsView: React.FC<ComparativeAnalyticsViewProps> = ({
  students,
  onSelectStudent
}) => {
  // Group by cohort
  const cohorts = Array.from(new Set(students.map((s) => s.cohort))).sort();

  const cohortComparisons = cohorts.map((c) => {
    const list = students.filter((s) => s.cohort === c);
    const meanGpa = list.reduce((sum, s) => sum + s.gpa, 0) / (list.length || 1);
    const meanAttendance = list.reduce((sum, s) => sum + s.attendanceRate, 0) / (list.length || 1);
    const passCount = list.filter((s) => s.overallPercentage >= 65).length;
    const passRate = (passCount / (list.length || 1)) * 100;

    // STEM (Math, Physics, Chemistry, CS) vs Humanities (English, History)
    const stemScores = list.flatMap((s) => [
      s.subjects.mathematics.overallScore,
      s.subjects.physics.overallScore,
      s.subjects.chemistry.overallScore,
      s.subjects.computerScience.overallScore
    ]);
    const humScores = list.flatMap((s) => [
      s.subjects.english.overallScore,
      s.subjects.history.overallScore
    ]);

    const stemAvg = stemScores.reduce((a, b) => a + b, 0) / (stemScores.length || 1);
    const humAvg = humScores.reduce((a, b) => a + b, 0) / (humScores.length || 1);

    return {
      name: c,
      count: list.length,
      meanGpa: Number(meanGpa.toFixed(2)),
      meanAttendance: Number(meanAttendance.toFixed(1)),
      passRate: Number(passRate.toFixed(1)),
      stemAvg: Number(stemAvg.toFixed(1)),
      humAvg: Number(humAvg.toFixed(1)),
    };
  });

  const overallStats = computeCohortStats(students);

  return (
    <div className="space-y-6">
      {/* Cohort Section Comparison Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            Inter-Cohort Academic Benchmark Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side metric comparison across enrolled grade sections and honor tracks
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Cohort Section</th>
                <th className="px-3 py-3 text-right">Enrollment</th>
                <th className="px-3 py-3 text-right">Mean GPA (4.0)</th>
                <th className="px-3 py-3 text-right">Attendance %</th>
                <th className="px-3 py-3 text-right">Pass Rate %</th>
                <th className="px-3 py-3 text-right">STEM Core Avg</th>
                <th className="px-3 py-3 text-right">Humanities Avg</th>
                <th className="px-4 py-3 text-right">Departmental Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {cohortComparisons.map((item) => (
                <tr key={item.name} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-slate-900 font-sans">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700">
                    {item.count}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900">
                    {item.meanGpa.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700">
                    {item.meanAttendance}%
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={item.passRate >= 90 ? 'text-emerald-700 font-semibold' : 'text-slate-900 font-semibold'}>
                      {item.passRate}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-blue-900 font-medium">
                    {item.stemAvg}%
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700">
                    {item.humAvg}%
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-xs">
                    <span className="text-slate-600">
                      {item.stemAvg > item.humAvg ? 'STEM Dominant' : 'Balanced Humanities'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <AttendanceScatterPlot
            students={students}
            onSelectStudent={onSelectStudent}
            correlation={overallStats.attendanceCorrelation}
          />
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <SubjectBarChart
            subjectAverages={overallStats.subjectAverages}
          />
        </div>
      </div>

      {/* Grade distribution */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <GradeDistributionChart
          distribution={overallStats.gradeDistribution}
          totalStudents={students.length}
        />
      </div>
    </div>
  );
};
