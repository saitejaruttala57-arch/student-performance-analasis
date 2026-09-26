import React, { useState, useMemo } from 'react';
import { Student, AcademicRiskStatus } from '../types/student';
import { Search, ArrowUpDown, ChevronDown, CheckSquare, Square, Eye, AlertCircle } from 'lucide-react';
import { SUBJECT_KEYS } from '../utils/analytics';

interface StudentRosterTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedCohort: string;
  setSelectedCohort: (cohort: string) => void;
  statusFilter: AcademicRiskStatus | 'All';
  setStatusFilter: (status: AcademicRiskStatus | 'All') => void;
  onExportSelected: (selectedIds: string[]) => void;
}

type SortField = 'rank' | 'name' | 'overallPercentage' | 'gpa' | 'attendanceRate' | 'missingAssignments';

export const StudentRosterTable: React.FC<StudentRosterTableProps> = ({
  students,
  onSelectStudent,
  selectedCohort,
  setSelectedCohort,
  statusFilter,
  setStatusFilter,
  onExportSelected
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Distinct cohorts
  const cohorts = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.cohort)));
    return ['all', ...list];
  }, [students]);

  // Filtering & Sorting
  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (selectedCohort !== 'all') {
      result = result.filter((s) => s.cohort === selectedCohort);
    }

    if (statusFilter !== 'All') {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'overallPercentage') {
        comparison = a.overallPercentage - b.overallPercentage;
      } else if (sortField === 'gpa') {
        comparison = a.gpa - b.gpa;
      } else if (sortField === 'attendanceRate') {
        comparison = a.attendanceRate - b.attendanceRate;
      } else if (sortField === 'missingAssignments') {
        const missingA = SUBJECT_KEYS.reduce((sum, k) => sum + (a.subjects[k]?.missingAssignments || 0), 0);
        const missingB = SUBJECT_KEYS.reduce((sum, k) => sum + (b.subjects[k]?.missingAssignments || 0), 0);
        comparison = missingA - missingB;
      }
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [students, selectedCohort, statusFilter, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'rank');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const getStatusBadge = (status: AcademicRiskStatus) => {
    switch (status) {
      case 'Thriving':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Thriving
          </span>
        );
      case 'On Track':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            On Track
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Needs Attention
          </span>
        );
      case 'Critical Risk':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Critical Risk
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-slate-50/50">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Right: Interactive Filters & Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cohort dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Cohort:</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Cohorts ({students.length})</option>
              {cohorts.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200 text-xs">
            {(['All', 'Thriving', 'On Track', 'Needs Attention', 'Critical Risk'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 font-medium shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Bulk Export Button if items selected */}
          {selectedIds.size > 0 && (
            <button
              onClick={() => onExportSelected(Array.from(selectedIds))}
              className="px-2.5 py-1 text-xs font-medium text-slate-900 bg-slate-200 hover:bg-slate-300 rounded transition-colors"
            >
              Export Selected ({selectedIds.size})
            </button>
          )}
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider select-none font-semibold">
            <tr>
              <th className="w-10 px-3 py-3">
                <button
                  onClick={toggleSelectAll}
                  className="text-slate-500 hover:text-slate-900 focus:outline-none"
                  title="Select all"
                >
                  {selectedIds.size === filteredStudents.length && filteredStudents.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-slate-900" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th
                onClick={() => toggleSort('rank')}
                className="px-3 py-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>Rank</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('name')}
                className="px-4 py-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>Student & Cohort</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('overallPercentage')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Overall %</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('gpa')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>GPA (4.0)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('attendanceRate')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Attendance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('missingAssignments')}
                className="px-3 py-3 text-center cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Missing</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="px-4 py-3">Academic Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto">
                    <p className="font-medium text-slate-600 text-sm">No matching students found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Adjust your search query or reset status filters to view student records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);
                const totalMissing = SUBJECT_KEYS.reduce(
                  (sum, k) => sum + (student.subjects[k]?.missingAssignments || 0),
                  0
                );

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-50' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-2.5" onClick={(e) => toggleSelectOne(student.id, e)}>
                      <button className="text-slate-500 hover:text-slate-900 focus:outline-none">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-slate-900" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="px-3 py-2.5 font-mono text-slate-500 font-semibold tabular-nums">
                      #{student.rank}
                    </td>

                    {/* Student Name & Roll */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 hover:underline">
                            {student.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span className="font-mono text-slate-400">{student.rollNumber}</span>
                            <span className="text-slate-300">·</span>
                            <span>{student.cohort}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Overall % */}
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                      <span className={student.overallPercentage >= 88 ? 'text-emerald-700 font-bold' : student.overallPercentage < 65 ? 'text-rose-700 font-bold' : ''}>
                        {student.overallPercentage.toFixed(1)}%
                      </span>
                    </td>

                    {/* GPA */}
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-700 font-medium">
                      {student.gpa.toFixed(2)}
                    </td>

                    {/* Attendance */}
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                      <span className={`font-medium ${
                        student.attendanceRate < 80 ? 'text-rose-600 font-bold' : 'text-slate-700'
                      }`}>
                        {student.attendanceRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Missing */}
                    <td className="px-3 py-2.5 text-center font-mono tabular-nums">
                      {totalMissing > 0 ? (
                        <span className="text-rose-600 font-bold">
                          {totalMissing}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    {/* Academic Status (Zero-Pill: Clean unboxed metadata) */}
                    <td className="px-4 py-2.5">
                      {getStatusBadge(student.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                        title="View Profile & Diagnostic Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
        <span>
          Showing {filteredStudents.length} of {students.length} students
        </span>
        <span>
          {selectedIds.size > 0 && `${selectedIds.size} records selected`}
        </span>
      </div>
    </div>
  );
};
