import React, { useState } from 'react';
import { FocusSessionStats, DayAgendaData } from '../types/agenda';
import { Flame, Clock, Award, CheckCircle2, Star, Sparkles, BookOpen, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StatsTabProps {
  stats: FocusSessionStats;
  todayData: DayAgendaData;
  onSaveReflection: (score: number, note: string) => void;
  onOpenPresets: () => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  stats,
  todayData,
  onSaveReflection,
  onOpenPresets,
}) => {
  const [score, setScore] = useState<number>(todayData.reflectionScore || 0);
  const [note, setNote] = useState<string>(todayData.reflectionNote || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const mainAgendaTasks = todayData.tasks.filter(t => t.isMainAgendaFocus);
  const completedMainAgendaTasks = mainAgendaTasks.filter(t => t.completed);
  const alignmentPercent = mainAgendaTasks.length > 0 
    ? Math.round((completedMainAgendaTasks.length / mainAgendaTasks.length) * 100) 
    : 0;

  const handleSave = () => {
    soundManager.playSuccess();
    onSaveReflection(score, note);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner: Streaks & Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-current" />
            <span className="font-semibold">Main Agenda Streak</span>
          </div>
          <div>
            <span className="font-tabular text-2xl font-extrabold text-neutral-100">
              {stats.streakDays}
            </span>
            <span className="text-xs text-neutral-500 ml-1">consecutive days</span>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="font-semibold">Deep Focus Time</span>
          </div>
          <div>
            <span className="font-tabular text-2xl font-extrabold text-neutral-100">
              {stats.totalMinutes}
            </span>
            <span className="text-xs text-neutral-500 ml-1">minutes logged</span>
          </div>
        </div>
      </div>

      {/* Main Agenda Alignment Health */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200">
                Main Agenda Execution Health
              </h4>
              <p className="text-[11px] text-neutral-400">
                Tasks aligned with today&apos;s core mission
              </p>
            </div>
          </div>
          <span className="font-tabular text-sm font-bold text-amber-400">
            {alignmentPercent}%
          </span>
        </div>

        {/* Progress meter */}
        <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
            style={{ width: `${alignmentPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>{completedMainAgendaTasks.length} of {mainAgendaTasks.length} mission tasks completed</span>
          <span className="font-tabular">{todayData.tasks.length} total tasks</span>
        </div>
      </div>

      {/* Quick Template Switcher */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-200">
              Agenda Templates & Presets
            </h4>
            <p className="text-[11px] text-neutral-400">
              Disaster relief, product sprint, or executive
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            soundManager.playTap();
            onOpenPresets();
          }}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
        >
          Load Presets
        </button>
      </div>

      {/* Daily Reflection & Debrief Form */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-200">
              Daily Debrief & Reflection
            </h4>
            <p className="text-[11px] text-neutral-400">
              Did you conquer today&apos;s Main Agenda?
            </p>
          </div>
        </div>

        {/* Rating buttons */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
            Mission Fulfillment Rating (1-5)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  setScore(star);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  score >= star
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'bg-neutral-950 text-neutral-500 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                ★ {star}
              </button>
            ))}
          </div>
        </div>

        {/* Reflection Note */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
            Debrief Notes & Lessons
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What went well today? What blocked the main agenda? What carries over to tomorrow?"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Debrief saved
            </span>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-750 text-neutral-100 transition-colors border border-neutral-700"
            >
              Save Reflection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
