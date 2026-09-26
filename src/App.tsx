/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Student, AcademicRiskStatus, SubjectKey } from './types/student';
import { getInitialStudents, assignRanks, INITIAL_STUDENTS_RAW } from './data/initialStudents';
import { computeCohortStats, recalculateStudentDerivedMetrics } from './utils/analytics';
import { Header, ActiveTab } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { StudentRosterTable } from './components/StudentRosterTable';
import { GradeDistributionChart } from './components/Charts/GradeDistributionChart';
import { SubjectBarChart } from './components/Charts/SubjectBarChart';
import { AttendanceScatterPlot } from './components/Charts/AttendanceScatterPlot';
import { StudentDetailModal } from './components/StudentDetailModal';
import { InterventionHub } from './components/InterventionHub';
import { SubjectMatrixView } from './components/SubjectMatrixView';
import { ComparativeAnalyticsView } from './components/ComparativeAnalyticsView';
import { AddStudentModal } from './components/AddStudentModal';
import { ImportExportModal } from './components/ImportExportModal';
import { PrintableReportCard } from './components/PrintableReportCard';
import { Sparkles, Download, Plus, ArrowRight, ShieldAlert } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => getInitialStudents());
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<AcademicRiskStatus | 'All'>('All');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [singleStudentForPrint, setSingleStudentForPrint] = useState<Student | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scholarpulse_students', JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [students]);

  // Cohort stats based on cohort filter
  const cohortFilteredStudents = useMemo(() => {
    if (selectedCohort === 'all') return students;
    return students.filter((s) => s.cohort === selectedCohort);
  }, [students, selectedCohort]);

  const cohortStats = useMemo(() => {
    return computeCohortStats(cohortFilteredStudents);
  }, [cohortFilteredStudents]);

  // Update a single student record
  const handleUpdateStudent = (updatedStudent: Student) => {
    const recalculated = recalculateStudentDerivedMetrics(updatedStudent);
    const updatedList = students.map((s) => (s.id === recalculated.id ? recalculated : s));
    const rankedList = assignRanks(updatedList);
    setStudents(rankedList);
    setSelectedStudent(recalculated);
  };

  // Add new student
  const handleAddStudent = (newStudent: Student) => {
    const updatedList = assignRanks([newStudent, ...students]);
    setStudents(updatedList);
  };

  // Import student list
  const handleImportStudents = (importedList: Student[]) => {
    const updatedList = assignRanks([...importedList, ...students]);
    setStudents(updatedList);
  };

  // Reset to initial default dataset
  const handleResetDefault = () => {
    localStorage.removeItem('scholarpulse_students');
    const fresh = INITIAL_STUDENTS_RAW.map((s) => recalculateStudentDerivedMetrics(s as Student));
    setStudents(assignRanks(fresh));
  };

  // Trigger print single student
  const handlePrintStudent = (studentToPrint: Student) => {
    setSingleStudentForPrint(studentToPrint);
    setIsPrintModalOpen(true);
  };

  // Export selected IDs
  const handleExportSelected = (selectedIds: string[]) => {
    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    const headers = ['Rank', 'Name', 'Roll Number', 'Cohort', 'Overall %', 'GPA', 'Attendance %', 'Status'];
    const rows = selectedStudents.map((s) => [
      s.rank,
      `"${s.name}"`,
      s.rollNumber,
      `"${s.cohort}"`,
      s.overallPercentage,
      s.gpa.toFixed(2),
      s.attendanceRate,
      s.status
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ScholarPulse_Selected_Students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onPrintReportCard={() => {
          setSingleStudentForPrint(null);
          setIsPrintModalOpen(true);
        }}
        atRiskCount={cohortStats.atRiskCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Stat Cards */}
        <MetricCards
          stats={cohortStats}
          selectedCohort={selectedCohort}
          onFilterAtRisk={() => {
            setActiveTab('interventions');
          }}
        />

        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Charts Row: Grade Histogram + Attendance Scatter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <GradeDistributionChart
                  distribution={cohortStats.gradeDistribution}
                  totalStudents={cohortFilteredStudents.length}
                  selectedGrade={selectedGrade}
                  onGradeSelect={(grade) => {
                    setSelectedGrade(grade);
                    if (grade) {
                      setActiveTab('roster');
                    }
                  }}
                />
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <SubjectBarChart
                  subjectAverages={cohortStats.subjectAverages}
                  onSubjectClick={(subject) => {
                    setActiveTab('subjects');
                  }}
                />
              </div>
            </div>

            {/* Attendance vs Performance Empirical Scatter */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <AttendanceScatterPlot
                students={cohortFilteredStudents}
                onSelectStudent={(student) => setSelectedStudent(student)}
                correlation={cohortStats.attendanceCorrelation}
              />
            </div>

            {/* Interactive Student Roster Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    Active Student Roster
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any student row to view comprehensive academic dossier, radar competencies, and intervention notes
                  </p>
                </div>
              </div>

              <StudentRosterTable
                students={students}
                onSelectStudent={(student) => setSelectedStudent(student)}
                selectedCohort={selectedCohort}
                setSelectedCohort={setSelectedCohort}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onExportSelected={handleExportSelected}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Comprehensive Student Roster & Grade Records
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete directory with multi-column sorting, bulk CSV export, and status tracking
                </p>
              </div>
            </div>

            <StudentRosterTable
              students={students}
              onSelectStudent={(student) => setSelectedStudent(student)}
              selectedCohort={selectedCohort}
              setSelectedCohort={setSelectedCohort}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onExportSelected={handleExportSelected}
            />
          </div>
        )}

        {/* VIEW 3: SUBJECT MATRIX */}
        {activeTab === 'subjects' && (
          <SubjectMatrixView
            students={cohortFilteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        )}

        {/* VIEW 4: INTERVENTION HUB */}
        {activeTab === 'interventions' && (
          <InterventionHub
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* VIEW 5: COMPARATIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <ComparativeAnalyticsView
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        )}
      </main>

      {/* Footer (No-print, minimal, zero telemetry slop) */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">ScholarPulse</span>
            <span>·</span>
            <span>Student Performance Analysis & Academic Diagnostics</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Confidential Educational Record (FERPA / GDPR Compliant)</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* Student Deep-Dive Dossier Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdateStudent={handleUpdateStudent}
          onPrintStudent={handlePrintStudent}
        />
      )}

      {/* Add Student Record Modal */}
      {isAddModalOpen && (
        <AddStudentModal
          onClose={() => setIsAddModalOpen(false)}
          onAddStudent={handleAddStudent}
        />
      )}

      {/* Import & Export Data Modal */}
      {isImportExportOpen && (
        <ImportExportModal
          students={students}
          onClose={() => setIsImportExportOpen(false)}
          onImportStudents={handleImportStudents}
          onResetDefault={handleResetDefault}
        />
      )}

      {/* Printable Report Card Modal */}
      {isPrintModalOpen && (
        <PrintableReportCard
          student={singleStudentForPrint}
          students={cohortFilteredStudents}
          onClose={() => {
            setIsPrintModalOpen(false);
            setSingleStudentForPrint(null);
          }}
        />
      )}
    </div>
  );
}
