import React from 'react';
import { Download, Plus, Sparkles, Printer } from 'lucide-react';

export type ActiveTab = 'overview' | 'roster' | 'subjects' | 'interventions' | 'analytics';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onOpenImportExport: () => void;
  onPrintReportCard: () => void;
  atRiskCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenImportExport,
  onPrintReportCard,
  atRiskCount
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              S
            </div>
            <span>ScholarPulse</span>
          </a>
        </div>

        {/* Zone 2: 4-5 clean nav links, single-line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'overview'
                ? 'text-slate-900 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'roster'
                ? 'text-slate-900 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Student Roster
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'subjects'
                ? 'text-slate-900 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Subject Matrix
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'interventions'
                ? 'text-slate-900 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Intervention Hub</span>
            {atRiskCount > 0 && (
              <span className="font-mono text-[11px] text-rose-600 font-bold tabular-nums">
                ({atRiskCount})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'analytics'
                ? 'text-slate-900 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Comparative Analytics
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenImportExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
            title="Import/Export CSV data"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Data / CSV</span>
          </button>

          <button
            onClick={onPrintReportCard}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
            title="Print Academic Performance Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
};
