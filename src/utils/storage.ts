import { DayAgendaData, AgendaTask, FocusSessionStats } from '../types/agenda';

const STORAGE_KEY = 'agenda_app_days_data_v1';
const STATS_KEY = 'agenda_app_stats_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(dateStr: string): { dayName: string; dayNumber: string; monthName: string; isToday: boolean } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const todayStr = getTodayDateString();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return {
    dayName: dayNames[date.getDay()],
    dayNumber: String(d),
    monthName: monthNames[date.getMonth()],
    isToday: dateStr === todayStr,
  };
}

export function getSurroundingDates(centerDateStr: string, count: number = 7): string[] {
  const [y, m, d] = centerDateStr.split('-').map(Number);
  const center = new Date(y, m - 1, d);
  const dates: string[] = [];

  // 3 days before, center, 3 days after
  const offset = Math.floor(count / 2);
  for (let i = -offset; i <= offset; i++) {
    const cur = new Date(center);
    cur.setDate(center.getDate() + i);
    const cy = cur.getFullYear();
    const cm = String(cur.getMonth() + 1).padStart(2, '0');
    const cd = String(cur.getDate()).padStart(2, '0');
    dates.push(`${cy}-${cm}-${cd}`);
  }

  return dates;
}

export const PRESET_RELIEF: DayAgendaData = {
  dateString: getTodayDateString(),
  mainAgenda: {
    title: "Resolve Critical Water & Medical Shortage in Sector 4",
    subtitle: "Emergency Disaster Resource Coordination",
    whyItMatters: "Over 450 displaced families in Sector 4 urgently require clean hydration and trauma dressings.",
    targetOutcome: "Dispatch 200 emergency hydration units & trauma kits from Central Depot to Sector 4 Hub.",
    colorTheme: "amber",
    completed: false,
    deadlineTime: "17:30",
    milestones: [
      { id: "m1", text: "Audit warehouse stock & confirm 200 water pallets available", done: true },
      { id: "m2", text: "Assign convoy drivers & confirm route clearance with civil defense", done: false },
      { id: "m3", text: "Verify physical intake handover at Sector 4 Relief Camp", done: false },
    ],
  },
  tasks: [
    {
      id: "task-1",
      title: "Central Warehouse Inventory Gap Audit",
      description: "Cross-check emergency triage supplies, IV fluids, and bottled water rations against dispatch requests.",
      startTime: "08:30",
      endTime: "09:45",
      durationMinutes: 75,
      priority: "urgent",
      category: "operations",
      isMainAgendaFocus: true,
      completed: true,
      locationOrResource: "Central Warehouse Bay 3",
      subtasks: [
        { id: "st-1", title: "Count 200 pallet units of potable water", completed: true },
        { id: "st-2", title: "Verify expiration dates on 60 trauma kits", completed: true },
        { id: "st-3", title: "Sign release manifest with warehouse lead", completed: true },
      ],
    },
    {
      id: "task-2",
      title: "Dispatch Fleet Coordination & Convoy Briefing",
      description: "Brief 3 heavy truck drivers on safe detour routes around flooded bridge #2.",
      startTime: "10:15",
      endTime: "11:30",
      durationMinutes: 75,
      priority: "urgent",
      category: "logistics",
      isMainAgendaFocus: true,
      completed: false,
      locationOrResource: "Fleet Depot Terminal A",
      subtasks: [
        { id: "st-4", title: "Provide satellite GPS routing sheet", completed: true },
        { id: "st-5", title: "Issue emergency radio comms channel #4", completed: false },
      ],
    },
    {
      id: "task-3",
      title: "Inter-Agency Relief Briefing Call",
      description: "Status update with Municipal Emergency Operations Center & Red Cross Coordinators.",
      startTime: "12:00",
      endTime: "12:45",
      durationMinutes: 45,
      priority: "high",
      category: "meeting",
      isMainAgendaFocus: false,
      completed: false,
      locationOrResource: "Emergency Radio Link / Virtual",
      subtasks: [],
    },
    {
      id: "task-4",
      title: "Supervise Checkpoint Intake at Sector 4 Camp",
      description: "Direct handover to camp medical doctor and triage volunteers.",
      startTime: "14:15",
      endTime: "16:00",
      durationMinutes: 105,
      priority: "urgent",
      category: "relief",
      isMainAgendaFocus: true,
      completed: false,
      locationOrResource: "Sector 4 High School Stadium",
      subtasks: [
        { id: "st-6", title: "Inspect condition of seals upon arrival", completed: false },
        { id: "st-7", title: "Log receipt in municipal relief tracker", completed: false },
      ],
    },
    {
      id: "task-5",
      title: "Field Situation Log & Reallocation Planning",
      description: "Reconcile remaining stock gaps and prepare tomorrow morning's supply orders.",
      startTime: "16:45",
      endTime: "17:45",
      durationMinutes: 60,
      priority: "medium",
      category: "operations",
      isMainAgendaFocus: false,
      completed: false,
      locationOrResource: "Field Command Desk",
      subtasks: [],
    },
  ],
  reflectionScore: 0,
  reflectionNote: "",
};

export const PRESET_EXECUTIVE: DayAgendaData = {
  dateString: getTodayDateString(),
  mainAgenda: {
    title: "Finalize & Deliver Q4 Strategic Roadmap Keynote",
    subtitle: "Executive Milestone",
    whyItMatters: "Aligns all 14 engineering and business leads on the next 6-month growth objectives.",
    targetOutcome: "Unanimous approval of roadmap and budget allocation from board members.",
    colorTheme: "indigo",
    completed: false,
    deadlineTime: "16:00",
    milestones: [
      { id: "em-1", text: "Incorporate CFO feedback on infrastructure margin targets", done: true },
      { id: "em-2", text: "Rehearse executive presentation with VP of Product", done: false },
      { id: "em-3", text: "Deliver 45-min live keynote & capture action items", done: false },
    ],
  },
  tasks: [
    {
      id: "ex-1",
      title: "Deep Work: Polish Keynote Deck & Narrative",
      description: "Tighten visual hierarchy on slide 8 through 14 and verify Q3 metrics.",
      startTime: "09:00",
      endTime: "11:00",
      durationMinutes: 120,
      priority: "urgent",
      category: "deep_work",
      isMainAgendaFocus: true,
      completed: false,
      locationOrResource: "Quiet Office",
      subtasks: [
        { id: "ex-s1", title: "Review cloud margin slides", completed: true },
        { id: "ex-s2", title: "Check team headcount numbers", completed: false },
      ],
    },
    {
      id: "ex-2",
      title: "Dry Run Rehearsal with VP Product",
      description: "Pacing check and Q&A challenge simulation.",
      startTime: "11:30",
      endTime: "12:30",
      durationMinutes: 60,
      priority: "high",
      category: "meeting",
      isMainAgendaFocus: true,
      completed: false,
      subtasks: [],
    },
    {
      id: "ex-3",
      title: "Live Q4 Strategic All-Hands Keynote",
      description: "Present roadmap, address team concerns, set next quarter North Star.",
      startTime: "14:00",
      endTime: "15:30",
      durationMinutes: 90,
      priority: "urgent",
      category: "deep_work",
      isMainAgendaFocus: true,
      completed: false,
      subtasks: [],
    },
    {
      id: "ex-4",
      title: "Executive Debrief & Action Items Signoff",
      description: "Send out distilled decisions list to stakeholders.",
      startTime: "16:15",
      endTime: "17:00",
      durationMinutes: 45,
      priority: "medium",
      category: "operations",
      isMainAgendaFocus: false,
      completed: false,
      subtasks: [],
    },
  ],
};

export const PRESET_DEEP_ENGINEERING: DayAgendaData = {
  dateString: getTodayDateString(),
  mainAgenda: {
    title: "Ship Zero-Latency Real-Time Sync Engine",
    subtitle: "Core Architecture Sprint",
    whyItMatters: "Eliminates 350ms of user round-trip latency and prevents concurrent edit conflicts.",
    targetOutcome: "Merge PR #412 with 100% test coverage and benchmark latency < 25ms.",
    colorTheme: "emerald",
    completed: false,
    deadlineTime: "18:00",
    milestones: [
      { id: "dm-1", text: "Implement optimistic conflict resolution worker", done: true },
      { id: "dm-2", text: "Pass chaos stress test with 10,000 simulated packets", done: false },
      { id: "dm-3", text: "Benchmark staging performance under load", done: false },
    ],
  },
  tasks: [
    {
      id: "de-1",
      title: "Write Stress Test Suite for Conflict Resolution",
      description: "Cover network partitions, packet jitter, and dirty writes.",
      startTime: "09:30",
      endTime: "11:30",
      durationMinutes: 120,
      priority: "urgent",
      category: "deep_work",
      isMainAgendaFocus: true,
      completed: false,
      subtasks: [],
    },
    {
      id: "de-2",
      title: "Staging Cluster Load Benchmark",
      description: "Measure p99 tail latency and memory utilization.",
      startTime: "13:30",
      endTime: "15:30",
      durationMinutes: 120,
      priority: "urgent",
      category: "deep_work",
      isMainAgendaFocus: true,
      completed: false,
      subtasks: [],
    },
    {
      id: "de-3",
      title: "Code Review & PR Merge Ceremony",
      description: "Walk through diff with staff engineer.",
      startTime: "16:00",
      endTime: "17:00",
      durationMinutes: 60,
      priority: "high",
      category: "operations",
      isMainAgendaFocus: true,
      completed: false,
      subtasks: [],
    },
  ],
};

export function loadAllDaysData(): Record<string, DayAgendaData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading agenda storage', e);
  }

  // Initialize with default preset
  const today = getTodayDateString();
  const initialData: Record<string, DayAgendaData> = {
    [today]: {
      ...PRESET_RELIEF,
      dateString: today,
    },
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  } catch {}

  return initialData;
}

export function saveDayData(dayData: DayAgendaData): void {
  if (typeof window === 'undefined') return;
  try {
    const all = loadAllDaysData();
    all[dayData.dateString] = dayData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed saving day agenda', e);
  }
}

export function getDayData(dateString: string): DayAgendaData {
  const all = loadAllDaysData();
  if (all[dateString]) {
    return all[dateString];
  }

  // If new day, return a sensible clean blank slate with an inviting prompt to define the Main Agenda
  return {
    dateString,
    mainAgenda: {
      title: "Define Today's Main Agenda",
      subtitle: "The One Non-Negotiable Mission",
      whyItMatters: "Tap to set the single highest-impact objective that defines today's success.",
      targetOutcome: "Clear criteria for completing this mission.",
      colorTheme: "amber",
      completed: false,
      deadlineTime: "18:00",
      milestones: [
        { id: "m-" + Date.now() + "-1", text: "Identify key requirement", done: false },
        { id: "m-" + Date.now() + "-2", text: "Execute focused block", done: false },
        { id: "m-" + Date.now() + "-3", text: "Verify deliverables", done: false },
      ],
    },
    tasks: [],
    reflectionScore: 0,
    reflectionNote: "",
  };
}

export function loadFocusStats(): FocusSessionStats {
  if (typeof window === 'undefined') {
    return { totalMinutes: 145, sessionsCompleted: 6, streakDays: 4, mainAgendaCompletions: 3 };
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalMinutes: 145, sessionsCompleted: 6, streakDays: 4, mainAgendaCompletions: 3 };
}

export function updateFocusStats(addMinutes: number): FocusSessionStats {
  const stats = loadFocusStats();
  stats.totalMinutes += addMinutes;
  stats.sessionsCompleted += 1;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
  return stats;
}

export function incrementMainAgendaWin(): FocusSessionStats {
  const stats = loadFocusStats();
  stats.mainAgendaCompletions += 1;
  stats.streakDays += 1;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
  return stats;
}
