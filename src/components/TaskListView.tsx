import React, { useState } from 'react';
import { AgendaTask } from '../types/agenda';
import { Check, Star, Search, MapPin, ListChecks, Trash2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TaskListViewProps {
  tasks: AgendaTask[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: AgendaTask) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

type FilterType = 'all' | 'main_agenda' | 'urgent' | 'pending' | 'completed';

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchLoc = task.locationOrResource?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    // Tab filter
    if (filter === 'main_agenda') return task.isMainAgendaFocus;
    if (filter === 'urgent') return task.priority === 'urgent' || task.priority === 'high';
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const mainAgendaCount = tasks.filter(t => t.isMainAgendaFocus).length;

  return (
    <div className="space-y-3 pb-16">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, locations, notes..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
        />
      </div>

      {/* Segmented Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => {
            soundManager.playTap();
            setFilter('all');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-neutral-800 text-white border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          All ({tasks.length})
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setFilter('main_agenda');
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'main_agenda'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-neutral-400 hover:text-amber-300 hover:bg-neutral-900'
          }`}
        >
          <Star className="w-3 h-3 fill-current text-amber-400" />
          <span>Main Agenda ({mainAgendaCount})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setFilter('pending');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'pending'
              ? 'bg-neutral-800 text-white border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setFilter('urgent');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'urgent'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-neutral-400 hover:text-rose-300 hover:bg-neutral-900'
          }`}
        >
          Urgent
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setFilter('completed');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-neutral-400 hover:text-emerald-300 hover:bg-neutral-900'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <p className="text-sm font-medium text-neutral-300 mb-1">No tasks found</p>
            <p className="text-xs text-neutral-500 mb-4">
              {searchQuery ? 'Try clearing your search filters' : 'Ready to plan? Add your first task for today'}
            </p>
            <button
              onClick={() => {
                soundManager.playTap();
                onAddTask();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
            >
              Add New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const completedSubs = task.subtasks?.filter(s => s.completed).length || 0;
            const totalSubs = task.subtasks?.length || 0;

            return (
              <div
                key={task.id}
                className={`group relative rounded-2xl p-3 sm:p-3.5 transition-all duration-200 border ${
                  task.isMainAgendaFocus
                    ? 'bg-neutral-900/90 border-amber-500/35 ring-1 ring-amber-500/20 shadow-[0_4px_16px_-6px_rgba(245,158,11,0.15)]'
                    : 'bg-neutral-900/60 border-neutral-800/90 hover:border-neutral-700'
                } ${task.completed ? 'opacity-60' : ''}`}
              >
                {task.isMainAgendaFocus && (
                  <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Main Agenda Anchor</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  {/* Complete checkbox */}
                  <button
                    onClick={() => {
                      soundManager.playSuccess();
                      onToggleTask(task.id);
                    }}
                    className={`w-6 h-6 rounded-lg mt-0.5 shrink-0 flex items-center justify-center border transition-all ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                        : task.isMainAgendaFocus
                        ? 'border-amber-400/60 hover:border-amber-400 text-transparent hover:text-amber-400/30 bg-neutral-950/60'
                        : 'border-neutral-700 hover:border-neutral-500 text-transparent hover:text-neutral-500 bg-neutral-950/60'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Main content click area */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onEditTask(task)}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-semibold text-neutral-100 truncate leading-snug ${
                          task.completed ? 'line-through text-neutral-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span className="font-tabular text-[11px] text-neutral-400 shrink-0">
                        {task.startTime}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-neutral-400">
                      <span className="font-tabular font-medium text-neutral-300">
                        {task.startTime} - {task.endTime} ({task.durationMinutes}m)
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span
                        className={`font-semibold capitalize ${
                          task.priority === 'urgent'
                            ? 'text-rose-400'
                            : task.priority === 'high'
                            ? 'text-amber-400'
                            : task.priority === 'medium'
                            ? 'text-sky-400'
                            : 'text-neutral-400'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {task.locationOrResource && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <span className="inline-flex items-center gap-1 text-neutral-300 truncate max-w-[140px]">
                            <MapPin className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{task.locationOrResource}</span>
                          </span>
                        </>
                      )}

                      {totalSubs > 0 && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <span className="inline-flex items-center gap-1 text-neutral-400">
                            <ListChecks className="w-3 h-3 text-neutral-400" />
                            <span>
                              {completedSubs}/{totalSubs}
                            </span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playTap();
                      onDeleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-all"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
