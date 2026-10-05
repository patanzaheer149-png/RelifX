export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export type TaskCategory = 
  | 'operations' 
  | 'relief' 
  | 'deep_work' 
  | 'meeting' 
  | 'logistics' 
  | 'personal';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface AgendaTask {
  id: string;
  title: string;
  description?: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  durationMinutes: number;
  priority: PriorityLevel;
  category: TaskCategory;
  isMainAgendaFocus: boolean; // Highlights task as directly executing the Main Agenda!
  completed: boolean;
  subtasks: SubTask[];
  locationOrResource?: string;
  notes?: string;
}

export interface MainAgenda {
  title: string;
  subtitle?: string;
  whyItMatters: string;
  targetOutcome: string;
  colorTheme: 'amber' | 'emerald' | 'indigo' | 'rose' | 'cyan';
  completed: boolean;
  completedAt?: string;
  deadlineTime: string; // e.g. "17:00"
  milestones: {
    id: string;
    text: string;
    done: boolean;
  }[];
}

export interface DayAgendaData {
  dateString: string; // YYYY-MM-DD
  mainAgenda: MainAgenda;
  tasks: AgendaTask[];
  notes?: string;
  reflectionScore?: number; // 1-5
  reflectionNote?: string;
}

export interface FocusSessionStats {
  totalMinutes: number;
  sessionsCompleted: number;
  streakDays: number;
  mainAgendaCompletions: number;
}
