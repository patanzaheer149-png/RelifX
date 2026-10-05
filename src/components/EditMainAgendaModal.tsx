import React, { useState, useEffect } from 'react';
import { MainAgenda } from '../types/agenda';
import { X, Sparkles, Plus, Trash2, Clock, Palette } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EditMainAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agenda: MainAgenda) => void;
  initialAgenda: MainAgenda;
}

export const EditMainAgendaModal: React.FC<EditMainAgendaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAgenda,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [colorTheme, setColorTheme] = useState<'amber' | 'emerald' | 'indigo' | 'rose' | 'cyan'>('amber');
  const [deadlineTime, setDeadlineTime] = useState('17:30');
  const [milestones, setMilestones] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  useEffect(() => {
    if (initialAgenda) {
      setTitle(initialAgenda.title || '');
      setSubtitle(initialAgenda.subtitle || '');
      setWhyItMatters(initialAgenda.whyItMatters || '');
      setTargetOutcome(initialAgenda.targetOutcome || '');
      setColorTheme(initialAgenda.colorTheme || 'amber');
      setDeadlineTime(initialAgenda.deadlineTime || '17:30');
      setMilestones(initialAgenda.milestones || []);
    }
  }, [initialAgenda, isOpen]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    soundManager.playTap();
    setMilestones([
      ...milestones,
      {
        id: 'm-' + Date.now(),
        text: newMilestoneText.trim(),
        done: false,
      },
    ]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id: string) => {
    soundManager.playTap();
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.playSuccess();
    const updated: MainAgenda = {
      ...initialAgenda,
      title: title.trim(),
      subtitle: subtitle.trim(),
      whyItMatters: whyItMatters.trim(),
      targetOutcome: targetOutcome.trim(),
      colorTheme,
      deadlineTime,
      milestones,
    };
    onSave(updated);
    onClose();
  };

  const THEMES: { id: 'amber' | 'emerald' | 'indigo' | 'rose' | 'cyan'; name: string; bg: string }[] = [
    { id: 'amber', name: 'Amber Glow', bg: 'bg-amber-500' },
    { id: 'emerald', name: 'Emerald Focus', bg: 'bg-emerald-500' },
    { id: 'indigo', name: 'Indigo Deep', bg: 'bg-indigo-500' },
    { id: 'rose', name: 'Rose Emergency', bg: 'bg-rose-500' },
    { id: 'cyan', name: 'Cyan Modern', bg: 'bg-cyan-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-neutral-100">
                Main Agenda of the Day
              </h3>
              <p className="text-[11px] text-neutral-400">
                The single high-impact mission that anchors your entire day
              </p>
            </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Main Title */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              The Main Agenda Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Resolve Critical Water Shortage in Sector 4"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
            />
          </div>

          {/* Subtitle / Domain */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Domain / Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Disaster Relief Coordination / Strategic Sprint"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Why It Matters */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Why It Matters Today (North Star Purpose) *
            </label>
            <textarea
              rows={2}
              required
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              placeholder="Describe why this is the highest leverage item. What happens if this succeeds?"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 leading-relaxed"
            />
          </div>

          {/* Target Outcome */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Concrete Deliverable / Target Outcome
            </label>
            <input
              type="text"
              value={targetOutcome}
              onChange={(e) => setTargetOutcome(e.target.value)}
              placeholder="e.g. 200 water pallets received by Sector 4 Hub with signed manifest"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Deadline & Color Theme */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                Target Deadline
              </label>
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-tabular text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Palette className="w-3 h-3 text-neutral-400" />
                Highlight Theme
              </label>
              <div className="flex items-center gap-2 pt-1">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setColorTheme(theme.id);
                    }}
                    title={theme.name}
                    className={`w-6 h-6 rounded-full ${theme.bg} transition-all ${
                      colorTheme === theme.id ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Milestones / Checklist */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Key Milestone Steps ({milestones.length})
            </label>

            <div className="space-y-1.5 mb-2.5">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                  <span className="flex-1 text-neutral-200">{m.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Add milestone requirement..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
            >
              Update Main Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
