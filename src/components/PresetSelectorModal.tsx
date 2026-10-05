import React from 'react';
import { X, ShieldAlert, Rocket, Briefcase, Sparkles, Check } from 'lucide-react';
import { PRESET_RELIEF, PRESET_EXECUTIVE, PRESET_DEEP_ENGINEERING } from '../utils/storage';
import { DayAgendaData } from '../types/agenda';
import { soundManager } from '../utils/audio';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: DayAgendaData) => void;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      id: 'relief',
      title: 'Disaster Relief Coordination',
      categoryBadge: 'Emergency Logistics',
      icon: ShieldAlert,
      iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      description: 'Coordinates affected location resources, warehouse inventory gap audits, and convoy dispatch status.',
      mainAgendaPreview: PRESET_RELIEF.mainAgenda.title,
      taskCount: PRESET_RELIEF.tasks.length,
      data: PRESET_RELIEF,
    },
    {
      id: 'executive',
      title: 'Strategic Executive Day',
      categoryBadge: 'Leadership & Board',
      icon: Briefcase,
      iconColor: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/40',
      description: 'Q4 strategic roadmap presentation, leadership alignment, and resource allocation sign-off.',
      mainAgendaPreview: PRESET_EXECUTIVE.mainAgenda.title,
      taskCount: PRESET_EXECUTIVE.tasks.length,
      data: PRESET_EXECUTIVE,
    },
    {
      id: 'engineering',
      title: 'Deep Engineering Sprint',
      categoryBadge: 'Software Architecture',
      icon: Rocket,
      iconColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
      description: 'Zero-latency sync engine implementation, stress testing, and staging benchmarks.',
      mainAgendaPreview: PRESET_DEEP_ENGINEERING.mainAgenda.title,
      taskCount: PRESET_DEEP_ENGINEERING.tasks.length,
      data: PRESET_DEEP_ENGINEERING,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full mx-auto my-2.5 sm:hidden" />

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-display text-base font-bold text-neutral-100">
              Load Agenda Preset
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

        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Choose a preset template to populate today&apos;s Main Agenda and supporting task schedule. You can edit any field anytime.
          </p>

          <div className="space-y-2.5">
            {presets.map((preset) => {
              const Icon = preset.icon;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    soundManager.playSuccess();
                    onSelectPreset(preset.data);
                    onClose();
                  }}
                  className="rounded-2xl p-4 bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-950 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${preset.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {preset.categoryBadge}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-tabular">
                          {preset.taskCount} tasks
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                        {preset.title}
                      </h4>

                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {preset.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span className="truncate">Main Agenda: &quot;{preset.mainAgendaPreview}&quot;</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
