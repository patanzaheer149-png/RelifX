import React from 'react';
import { DayAgendaData } from '../types/agenda';
import { formatDateLabel } from '../utils/storage';
import { Calendar, CheckCircle2, Circle, Flame, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WeeklyPlanTabProps {
  dates: string[];
  daysData: Record<string, DayAgendaData>;
  currentDate: string;
  onSelectDate: (date: string) => void;
}

export const WeeklyPlanTab: React.FC<WeeklyPlanTabProps> = ({
  dates,
  daysData,
  currentDate,
  onSelectDate,
}) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-neutral-100">
            Weekly Main Agendas
          </h3>
          <p className="text-xs text-neutral-400">
            Your single high-impact mission planned for every day
          </p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      {/* Week Cards */}
      <div className="space-y-2.5">
        {dates.map((dateStr) => {
          const { dayName, dayNumber, monthName, isToday } = formatDateLabel(dateStr);
          const day = daysData[dateStr];
          const isSelected = dateStr === currentDate;
          const mainAgenda = day?.mainAgenda;
          const isCompleted = mainAgenda?.completed;
          const taskCount = day?.tasks?.length || 0;

          return (
            <div
              key={dateStr}
              onClick={() => {
                soundManager.playTap();
                onSelectDate(dateStr);
              }}
              className={`group relative rounded-2xl p-3.5 border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900/90 border-amber-500/40 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/5'
                  : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/80'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Date badge */}
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                    : isToday
                    ? 'bg-neutral-800 text-amber-400 border-neutral-700'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                }`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{dayName}</span>
                  <span className="font-tabular text-sm font-extrabold leading-none">{dayNumber}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 fill-current" />
                      Main Agenda
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Today
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs sm:text-sm font-semibold text-neutral-100 truncate leading-snug ${
                    isCompleted ? 'line-through text-neutral-400' : ''
                  }`}>
                    {mainAgenda?.title || 'No Main Agenda Defined'}
                  </h4>

                  {mainAgenda?.targetOutcome && (
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      Target: {mainAgenda.targetOutcome}
                    </p>
                  )}

                  {/* Footer metadata */}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Accomplished</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3 h-3 text-neutral-600" />
                          <span>In progress</span>
                        </>
                      )}
                    </span>
                    <span>·</span>
                    <span>{taskCount} scheduled tasks</span>
                    <span>·</span>
                    <span>{monthName} {dayNumber}</span>
                  </div>
                </div>

                <div className="self-center">
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
