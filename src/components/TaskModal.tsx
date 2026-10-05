import React, { useState, useEffect } from 'react';
import { AgendaTask, PriorityLevel, TaskCategory, SubTask } from '../types/agenda';
import { X, Star, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: AgendaTask) => void;
  onDelete?: (taskId: string) => void;
  initialTask?: AgendaTask | null;
  defaultHour?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTask,
  defaultHour,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [category, setCategory] = useState<TaskCategory>('operations');
  const [isMainAgendaFocus, setIsMainAgendaFocus] = useState(false);
  const [locationOrResource, setLocationOrResource] = useState('');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStartTime(initialTask.startTime || '09:00');
      setEndTime(initialTask.endTime || '10:00');
      setDurationMinutes(initialTask.durationMinutes || 60);
      setPriority(initialTask.priority || 'high');
      setCategory(initialTask.category || 'operations');
      setIsMainAgendaFocus(initialTask.isMainAgendaFocus || false);
      setLocationOrResource(initialTask.locationOrResource || '');
      setSubtasks(initialTask.subtasks || []);
    } else {
      const defaultStart = defaultHour || '09:00';
      const [h, m] = defaultStart.split(':').map(Number);
      const endH = String((h + 1) % 24).padStart(2, '0');
      const defaultEnd = `${endH}:${String(m).padStart(2, '0')}`;

      setTitle('');
      setDescription('');
      setStartTime(defaultStart);
      setEndTime(defaultEnd);
      setDurationMinutes(60);
      setPriority('high');
      setCategory('operations');
      setIsMainAgendaFocus(false);
      setLocationOrResource('');
      setSubtasks([]);
    }
  }, [initialTask, defaultHour, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    soundManager.playTap();
    setSubtasks([
      ...subtasks,
      {
        id: 'sub-' + Date.now(),
        title: newSubtaskText.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (id: string) => {
    soundManager.playTap();
    setSubtasks(
      subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    );
  };

  const handleRemoveSubtask = (id: string) => {
    soundManager.playTap();
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.playSuccess();
    const task: AgendaTask = {
      id: initialTask?.id || 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 60,
      priority,
      category,
      isMainAgendaFocus,
      completed: initialTask?.completed || false,
      locationOrResource: locationOrResource.trim() || undefined,
      subtasks,
    };

    onSave(task);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle for touch mobile */}
        <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
          <h3 className="font-display text-base font-bold text-neutral-100">
            {initialTask ? 'Edit Agenda Task' : 'New Agenda Task'}
          </h3>
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
          {/* Main Agenda Highlight Switch */}
          <div 
            onClick={() => {
              soundManager.playTap();
              setIsMainAgendaFocus(!isMainAgendaFocus);
            }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isMainAgendaFocus
                ? 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isMainAgendaFocus ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}>
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                  Highlight for Main Agenda of the Day
                </p>
                <p className="text-[11px] text-neutral-400">
                  Directly advances today&apos;s core mission & anchors the schedule
                </p>
              </div>
            </div>

            <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
              isMainAgendaFocus ? 'bg-amber-500' : 'bg-neutral-800'
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isMainAgendaFocus ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inspect Central Warehouse Stock"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
            />
          </div>

          {/* Time & Duration Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                Start
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs font-tabular text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                End
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs font-tabular text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs font-tabular text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
              >
                <option value="urgent">Urgent Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
              >
                <option value="operations">Operations / Execution</option>
                <option value="relief">Relief / Dispatch</option>
                <option value="deep_work">Deep Work / Focus</option>
                <option value="logistics">Logistics & Supply</option>
                <option value="meeting">Briefing & Comms</option>
                <option value="personal">Personal Routine</option>
              </select>
            </div>
          </div>

          {/* Location or Resource Note */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              Location / Warehouse / Room
            </label>
            <input
              type="text"
              value={locationOrResource}
              onChange={(e) => setLocationOrResource(e.target.value)}
              placeholder="e.g. Sector 4 High School Hub or Central Depot Bay 3"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Task Notes / Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key instructions, contacts, or equipment needed..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Subtasks Section */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Action Checklist / Subtasks ({subtasks.length})
            </label>

            {/* List */}
            <div className="space-y-1.5 mb-2.5">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleToggleSubtask(st.id)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-neutral-900 border-neutral-700"
                  />
                  <span className={`text-xs flex-1 ${st.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                    {st.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask item..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-800">
            {initialTask && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  onDelete(initialTask.id);
                  onClose();
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Delete Task
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                {initialTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
