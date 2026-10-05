import React from 'react';
import { AgendaTask } from '../types/agenda';
import { Check, Star, MapPin, ListChecks, Plus } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TimelineViewProps {
  tasks: AgendaTask[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: AgendaTask) => void;
  onAddTaskAtHour: (hour: string) => void;
}

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00'
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  onAddTaskAtHour,
}) => {
  // Map tasks to their hour slot
  const getTasksForHour = (hourPrefix: string) => {
    const targetHourNum = parseInt(hourPrefix.split(':')[0], 10);
    return tasks.filter(t => {
      if (!t.startTime) return false;
      const taskHourNum = parseInt(t.startTime.split(':')[0], 10);
      return taskHourNum === targetHourNum;
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-semibold text-rose-400">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-semibold text-amber-400">High</span>;
      case 'medium':
        return <span className="text-[10px] font-medium text-sky-400">Medium</span>;
      default:
        return <span className="text-[10px] text-neutral-400">Low</span>;
    }
  };

  return (
    <div className="relative pl-2 pr-1 pb-16">
      {/* Vertical continuous timeline guide */}
      <div className="absolute left-[3.25rem] top-3 bottom-8 w-[1.5px] bg-neutral-800/80" />

      <div className="space-y-4">
        {HOURS.map((hour) => {
          const hourTasks = getTasksForHour(hour);

          return (
            <div key={hour} className="relative flex items-start gap-3 group">
              {/* Hour Label */}
              <div className="w-10 pt-1 text-right shrink-0">
                <span className="font-tabular text-[12px] font-semibold text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  {hour}
                </span>
              </div>

              {/* Timeline marker node */}
              <div className="relative z-10 mt-2">
                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                  hourTasks.length > 0 
                    ? hourTasks.some(t => t.isMainAgendaFocus) 
                      ? 'border-amber-400 bg-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'border-neutral-400 bg-neutral-900'
                    : 'border-neutral-700 bg-neutral-950 group-hover:border-neutral-500'
                }`} />
              </div>

              {/* Hour Slot Content */}
              <div className="flex-1 space-y-2 min-w-0">
                {hourTasks.length > 0 ? (
                  hourTasks.map((task) => {
                    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;

                    return (
                      <div
                        key={task.id}
                        className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-200 border ${
                          task.isMainAgendaFocus
                            ? 'bg-neutral-900/90 border-amber-500/35 shadow-[0_4px_20px_-6px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20'
                            : 'bg-neutral-900/60 border-neutral-800/90 hover:border-neutral-700'
                        } ${task.completed ? 'opacity-65' : ''}`}
                      >
                        {/* Main Agenda connection badge */}
                        {task.isMainAgendaFocus && (
                          <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Aligned with Main Agenda</span>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-2.5">
                          {/* Checkbox */}
                          <button
                            onClick={() => {
                              soundManager.playSuccess();
                              onToggleTask(task.id);
                            }}
                            className={`w-6 h-6 rounded-lg mt-0.5 shrink-0 flex items-center justify-center border transition-all ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                                : task.isMainAgendaFocus
                                ? 'border-amber-400/60 hover:border-amber-400 text-transparent hover:text-amber-400/40 bg-neutral-950/60'
                                : 'border-neutral-700 hover:border-neutral-500 text-transparent hover:text-neutral-500 bg-neutral-950/60'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          {/* Task details */}
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => onEditTask(task)}
                          >
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className={`text-sm font-semibold text-neutral-100 leading-snug truncate ${
                                task.completed ? 'line-through text-neutral-400' : ''
                              }`}>
                                {task.title}
                              </h4>
                            </div>

                            {task.description && (
                              <p className="text-xs text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {/* Metadata row */}
                            <div className="flex items-center gap-2 flex-wrap text-[11px] text-neutral-400">
                              <span className="font-tabular font-medium text-neutral-300">
                                {task.startTime} - {task.endTime} ({task.durationMinutes}m)
                              </span>
                              <span className="text-neutral-600">·</span>
                              {getPriorityBadge(task.priority)}

                              {task.locationOrResource && (
                                <>
                                  <span className="text-neutral-600">·</span>
                                  <span className="inline-flex items-center gap-1 text-neutral-300 truncate max-w-[130px]">
                                    <MapPin className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                                    <span className="truncate">{task.locationOrResource}</span>
                                  </span>
                                </>
                              )}

                              {totalSubtasks > 0 && (
                                <>
                                  <span className="text-neutral-600">·</span>
                                  <span className="inline-flex items-center gap-1 text-neutral-400">
                                    <ListChecks className="w-3 h-3 text-neutral-400" />
                                    <span>{completedSubtasks}/{totalSubtasks}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Empty hour slot - tap to add task */
                  <button
                    onClick={() => {
                      soundManager.playTap();
                      onAddTaskAtHour(hour);
                    }}
                    className="w-full text-left py-2 px-3 rounded-xl border border-dashed border-neutral-800/60 hover:border-neutral-700/80 hover:bg-neutral-900/40 text-neutral-500 hover:text-neutral-300 text-xs flex items-center justify-between transition-all"
                  >
                    <span>Free slot</span>
                    <Plus className="w-3.5 h-3.5 opacity-50" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
