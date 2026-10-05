import React, { useState } from 'react';
import { DayAgendaData } from '../types/agenda';
import { formatDateLabel } from '../utils/storage';
import { X, Copy, Check, Share2, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BriefingShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayAgendaData;
}

export const BriefingShareModal: React.FC<BriefingShareModalProps> = ({
  isOpen,
  onClose,
  dayData,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const { dayName, dayNumber, monthName } = formatDateLabel(dayData.dateString);
  const mainAgenda = dayData.mainAgenda;

  const briefingText = `DAILY AGENDA BRIEFING · ${dayName}, ${monthName} ${dayNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
★ MAIN AGENDA OF THE DAY:
${mainAgenda.title}
Status: ${mainAgenda.completed ? 'Accomplished ✓' : 'In Progress (Target: ' + mainAgenda.deadlineTime + ')'}

CORE IMPACT & REASON:
${mainAgenda.whyItMatters}

TARGET OUTCOME:
${mainAgenda.targetOutcome || 'N/A'}

MILESTONES:
${mainAgenda.milestones.map(m => `[${m.done ? 'X' : ' '}] ${m.text}`).join('\n')}

SCHEDULED TASKS (${dayData.tasks.length}):
${dayData.tasks.map(t => `${t.completed ? '[✓]' : '[ ]'} ${t.startTime} - ${t.endTime}: ${t.title}${t.isMainAgendaFocus ? ' (★ Main Agenda)' : ''}${t.locationOrResource ? ' @ ' + t.locationOrResource : ''}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via Agenda Focus`;

  const handleCopy = async () => {
    soundManager.playTap();
    try {
      await navigator.clipboard.writeText(briefingText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full mx-auto my-2.5 sm:hidden" />

        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <h3 className="font-display text-base font-bold text-neutral-100">
              Daily Mission Briefing
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 whitespace-pre-wrap leading-relaxed select-all">
            {briefingText}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Ready for team dispatch or personal log</span>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Briefing</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
