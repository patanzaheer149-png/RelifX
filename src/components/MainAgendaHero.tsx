import React from 'react';
import { MainAgenda } from '../types/agenda';
import { Target, CheckCircle2, Circle, Flame, Play, Clock, Sparkles, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface MainAgendaHeroProps {
  agenda: MainAgenda;
  onToggleComplete: () => void;
  onToggleMilestone: (id: string) => void;
  onStartFocus: () => void;
  onEdit: () => void;
  progressPercent: number;
}

export const MainAgendaHero: React.FC<MainAgendaHeroProps> = ({
  agenda,
  onToggleComplete,
  onToggleMilestone,
  onStartFocus,
  onEdit,
  progressPercent,
}) => {
  const handleCompleteClick = () => {
    soundManager.playTap();
    if (!agenda.completed) {
      soundManager.playMainAgendaCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#38bdf8'],
        });
      } catch {}
    }
    onToggleComplete();
  };

  // Color theme mapping
  const themeMap = {
    amber: {
      gradient: 'from-amber-500/20 via-neutral-900/90 to-neutral-950',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_35px_-8px_rgba(245,158,11,0.25)]',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      accent: 'text-amber-400',
      bar: 'bg-gradient-to-r from-amber-500 to-amber-300',
      button: 'bg-amber-500 hover:bg-amber-400 text-neutral-950',
      milestoneCheck: 'text-amber-400',
    },
    emerald: {
      gradient: 'from-emerald-500/20 via-neutral-900/90 to-neutral-950',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_35px_-8px_rgba(16,185,129,0.25)]',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      accent: 'text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-500 to-emerald-300',
      button: 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950',
      milestoneCheck: 'text-emerald-400',
    },
    indigo: {
      gradient: 'from-indigo-500/20 via-neutral-900/90 to-neutral-950',
      border: 'border-indigo-500/40',
      glow: 'shadow-[0_0_35px_-8px_rgba(99,102,241,0.25)]',
      badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      accent: 'text-indigo-400',
      bar: 'bg-gradient-to-r from-indigo-500 to-indigo-300',
      button: 'bg-indigo-500 hover:bg-indigo-400 text-neutral-950',
      milestoneCheck: 'text-indigo-400',
    },
    rose: {
      gradient: 'from-rose-500/20 via-neutral-900/90 to-neutral-950',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_35px_-8px_rgba(244,63,94,0.25)]',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      accent: 'text-rose-400',
      bar: 'bg-gradient-to-r from-rose-500 to-rose-300',
      button: 'bg-rose-500 hover:bg-rose-400 text-neutral-950',
      milestoneCheck: 'text-rose-400',
    },
    cyan: {
      gradient: 'from-cyan-500/20 via-neutral-900/90 to-neutral-950',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_35px_-8px_rgba(6,182,212,0.25)]',
      badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      accent: 'text-cyan-400',
      bar: 'bg-gradient-to-r from-cyan-500 to-cyan-300',
      button: 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950',
      milestoneCheck: 'text-cyan-400',
    },
  };

  const theme = themeMap[agenda.colorTheme || 'amber'];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${theme.border} ${theme.glow} bg-gradient-to-b ${theme.gradient} p-4 sm:p-5 transition-all duration-300`}
    >
      {/* Subtle background ambient pulse glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header bar: Badge + Deadline + Edit Action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${theme.badge}`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            Main Agenda of the Day
          </span>
          {agenda.completed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-3 h-3" />
              Accomplished
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {agenda.deadlineTime && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded-md border border-neutral-800">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span className="font-tabular font-medium">{agenda.deadlineTime}</span>
            </span>
          )}
          <button
            onClick={() => {
              soundManager.playTap();
              onEdit();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 transition-colors"
            title="Edit Main Agenda"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Agenda Title */}
      <div className="mb-3">
        <h2 className={`font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-snug ${agenda.completed ? 'line-through opacity-75' : ''}`}>
          {agenda.title}
        </h2>
        {agenda.subtitle && (
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            {agenda.subtitle}
          </p>
        )}
      </div>

      {/* Why It Matters / Impact Statement */}
      {agenda.whyItMatters && (
        <div className="mb-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 p-2.5 sm:p-3">
          <div className="flex items-start gap-2">
            <Target className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${theme.accent}`} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-0.5">
                Core Reason & Impact
              </p>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {agenda.whyItMatters}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Target Outcome */}
      {agenda.targetOutcome && (
        <div className="mb-3 text-[12px] text-neutral-300 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">Deliverable:</span>
          <span className="font-medium text-neutral-100 truncate">{agenda.targetOutcome}</span>
        </div>
      )}

      {/* Progress Bar & Milestones Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1.5">
            <span>Milestone Execution</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-300 font-tabular">{agenda.milestones.filter(m => m.done).length}/{agenda.milestones.length}</span>
          </span>
          <span className="font-tabular font-semibold text-neutral-200">{Math.round(progressPercent)}%</span>
        </div>

        {/* Progress track */}
        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.bar} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestones list */}
        {agenda.milestones.length > 0 && (
          <div className="mt-2.5 space-y-1.5">
            {agenda.milestones.map((milestone) => (
              <button
                key={milestone.id}
                onClick={() => {
                  soundManager.playTap();
                  onToggleMilestone(milestone.id);
                }}
                className={`w-full text-left flex items-start gap-2 py-1 px-2 rounded-lg transition-colors group ${
                  milestone.done ? 'bg-neutral-900/40 text-neutral-500' : 'hover:bg-neutral-900/60 text-neutral-200'
                }`}
              >
                {milestone.done ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${theme.milestoneCheck}`} />
                ) : (
                  <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
                )}
                <span className={`text-[12px] leading-snug ${milestone.done ? 'line-through text-neutral-500' : ''}`}>
                  {milestone.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/80">
        <button
          onClick={() => {
            soundManager.playTap();
            onStartFocus();
          }}
          className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-neutral-800/90 hover:bg-neutral-750 text-neutral-100 text-xs font-semibold active:scale-[0.98] transition-all border border-neutral-700/60 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>Enter Focus Mode</span>
        </button>

        <button
          onClick={handleCompleteClick}
          className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-xs font-bold active:scale-[0.98] transition-all shadow-sm ${
            agenda.completed
              ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700'
              : `${theme.button} shadow-amber-500/10`
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{agenda.completed ? 'Reopen Agenda' : 'Complete Agenda'}</span>
        </button>
      </div>
    </div>
  );
};
