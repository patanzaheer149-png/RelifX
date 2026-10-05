import React from 'react';
import { formatDateLabel } from '../utils/storage';
import { DayAgendaData } from '../types/agenda';
import { CheckCircle2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DateRibbonProps {
  dates: string[];
  currentDate: string;
  onSelectDate: (date: string) => void;
  daysData: Record<string, DayAgendaData>;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onJumpToday: () => void;
}

export const DateRibbon: React.FC<DateRibbonProps> = ({
  dates,
  currentDate,
  onSelectDate,
  daysData,
  onPreviousDay,
  onNextDay,
  onJumpToday,
}) => {
  const currentFormatted = formatDateLabel(currentDate);

  return (
    <div className="mb-4 space-y-2.5">
      {/* Month & Jump-to-Today Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <h2 className="font-display text-sm font-bold text-neutral-100">
            {currentFormatted.monthName} {currentFormatted.dayNumber}
            {currentFormatted.isToday && (
              <span className="ml-1.5 text-[11px] font-semibold text-amber-400 font-sans">
                · Today
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {!currentFormatted.isToday && (
            <button
              onClick={() => {
                soundManager.playTap();
                onJumpToday();
              }}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded-md hover:bg-neutral-900 transition-colors"
            >
              Back to Today
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playTap();
              onPreviousDay();
            }}
            className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              onNextDay();
            }}
            className="p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Date Picker Scroller */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
        {dates.map((dateStr) => {
          const { dayName, dayNumber, isToday } = formatDateLabel(dateStr);
          const isSelected = dateStr === currentDate;
          const isCompleted = daysData[dateStr]?.mainAgenda?.completed;

          return (
            <button
              key={dateStr}
              onClick={() => {
                soundManager.playTap();
                onSelectDate(dateStr);
              }}
              className={`flex-1 min-w-[42px] max-w-[50px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all relative ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                  : isToday
                  ? 'bg-neutral-900 border border-amber-500/40 text-neutral-200'
                  : 'bg-neutral-900/60 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold leading-tight">
                {dayName}
              </span>
              <span className="font-tabular text-sm font-extrabold mt-0.5 leading-none">
                {dayNumber}
              </span>

              {/* Status indicator dot or checkmark */}
              {isCompleted ? (
                <div className="absolute -top-1 -right-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 bg-neutral-950 rounded-full" />
                </div>
              ) : isToday ? (
                <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-neutral-950' : 'bg-amber-400'}`} />
              ) : (
                <div className="w-1 h-1 rounded-full mt-1 opacity-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
