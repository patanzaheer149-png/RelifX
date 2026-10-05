/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  getTodayDateString, 
  loadAllDaysData, 
  saveDayData, 
  getDayData, 
  loadFocusStats, 
  updateFocusStats, 
  incrementMainAgendaWin, 
  getSurroundingDates,
  formatDateLabel
} from './utils/storage';
import { DayAgendaData, AgendaTask, MainAgenda, FocusSessionStats } from './types/agenda';
import { reliefService, HttpLogEntry } from './services/reliefService';
import { 
  ResourceTypeEnum, 
  PriorityEnum, 
  AllocationStatusEnum, 
  ResourceGapSummaryModel, 
  DispatchAllocationModel, 
  WarehouseStockModel,
  ResourceRequestModel 
} from './types/relief';
import { MobileFrame, AppTabType } from './components/MobileFrame';
import { FigmaDashboardScreen } from './components/FigmaDashboardScreen';
import { FigmaAuthScreen } from './components/FigmaAuthScreen';
import { StandardUtilityPages, UtilityPageType } from './components/StandardUtilityPages';
import { DateRibbon } from './components/DateRibbon';
import { MainAgendaHero } from './components/MainAgendaHero';
import { TimelineView } from './components/TimelineView';
import { TaskListView } from './components/TaskListView';
import { TaskModal } from './components/TaskModal';
import { EditMainAgendaModal } from './components/EditMainAgendaModal';
import { FocusTimerTab } from './components/FocusTimerTab';
import { DisasterDashboardTab } from './components/DisasterDashboardTab';
import { OperatorInputTab } from './components/OperatorInputTab';
import { N8nWorkflowTab } from './components/N8nWorkflowTab';
import { RagAssistantTab } from './components/RagAssistantTab';
import { PresetSelectorModal } from './components/PresetSelectorModal';
import { BriefingShareModal } from './components/BriefingShareModal';
import { Calendar, ListFilter, Share2, Sparkles, Plus, Layout, Lock, SlidersHorizontal, Bot, ArrowLeft } from 'lucide-react';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [daysData, setDaysData] = useState<Record<string, DayAgendaData>>({});
  const [stats, setStats] = useState<FocusSessionStats>({ totalMinutes: 145, sessionsCompleted: 6, streakDays: 4, mainAgendaCompletions: 3 });
  
  // High-Level Screen Mode matching the user's uploaded Figma wireframes + RAG app!
  const [currentScreen, setCurrentScreen] = useState<'figma_dashboard' | 'figma_auth' | 'advanced_console' | 'rag_assistant'>('figma_dashboard');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('operator@relief.org');
  const [selectedUtilityPage, setSelectedUtilityPage] = useState<UtilityPageType | null>(null);

  // Navigation Tabs in Advanced Mode
  const [activeTab, setActiveTab] = useState<AppTabType>('agenda');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  // Disaster Relief Platform State
  const [gapData, setGapData] = useState<{
    gaps: ResourceGapSummaryModel[];
    totalPending: number;
    criticalCount: number;
    totalAvailable: number;
    inTransitCount: number;
  }>(() => reliefService.calculateGaps());
  const [allocations, setAllocations] = useState<DispatchAllocationModel[]>(() => reliefService.getAllocations());
  const [stocks, setStocks] = useState<WarehouseStockModel[]>(() => reliefService.getStocks());
  const [requests, setRequests] = useState<ResourceRequestModel[]>(() => reliefService.getRequests());
  const [httpLogs, setHttpLogs] = useState<HttpLogEntry[]>(() => reliefService.getHttpLogs());

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgendaTask | null>(null);
  const [defaultHour, setDefaultHour] = useState<string | undefined>(undefined);
  const [isEditMainAgendaOpen, setIsEditMainAgendaOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedDays = loadAllDaysData();
    setDaysData(loadedDays);
    const loadedStats = loadFocusStats();
    setStats(loadedStats);

    reliefService.setOnLogsChanged(() => {
      setHttpLogs(reliefService.getHttpLogs());
    });
  }, []);

  const refreshDisasterData = () => {
    setGapData(reliefService.calculateGaps());
    setAllocations(reliefService.getAllocations());
    setStocks(reliefService.getStocks());
    setRequests(reliefService.getRequests());
  };

  // Current day data
  const currentDay: DayAgendaData = daysData[currentDate] || getDayData(currentDate);

  // Save current day updates
  const handleUpdateCurrentDay = (updated: DayAgendaData) => {
    const nextDays = { ...daysData, [currentDate]: updated };
    setDaysData(nextDays);
    saveDayData(updated);
  };

  // Toggle Main Agenda accomplishment
  const handleToggleMainAgendaComplete = () => {
    const isNowCompleted = !currentDay.mainAgenda.completed;
    const updatedAgenda: MainAgenda = {
      ...currentDay.mainAgenda,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date().toISOString() : undefined,
    };

    if (isNowCompleted) {
      const nextStats = incrementMainAgendaWin();
      setStats(nextStats);
    }

    handleUpdateCurrentDay({
      ...currentDay,
      mainAgenda: updatedAgenda,
    });
  };

  // Toggle Main Agenda Milestone
  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = currentDay.mainAgenda.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );

    const allDone = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.done);

    handleUpdateCurrentDay({
      ...currentDay,
      mainAgenda: {
        ...currentDay.mainAgenda,
        milestones: updatedMilestones,
        completed: allDone ? true : currentDay.mainAgenda.completed,
      },
    });
  };

  // Save edited Main Agenda
  const handleSaveMainAgenda = (updatedAgenda: MainAgenda) => {
    handleUpdateCurrentDay({
      ...currentDay,
      mainAgenda: updatedAgenda,
    });
  };

  // Task Actions
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = currentDay.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    handleUpdateCurrentDay({
      ...currentDay,
      tasks: updatedTasks,
    });
  };

  const handleSaveTask = (task: AgendaTask) => {
    const existingIndex = currentDay.tasks.findIndex((t) => t.id === task.id);
    let updatedTasks: AgendaTask[];
    if (existingIndex >= 0) {
      updatedTasks = [...currentDay.tasks];
      updatedTasks[existingIndex] = task;
    } else {
      updatedTasks = [...currentDay.tasks, task];
    }

    updatedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));

    handleUpdateCurrentDay({
      ...currentDay,
      tasks: updatedTasks,
    });
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = currentDay.tasks.filter((t) => t.id !== taskId);
    handleUpdateCurrentDay({
      ...currentDay,
      tasks: updatedTasks,
    });
  };

  const handleAddTaskAtHour = (hour: string) => {
    setSelectedTask(null);
    setDefaultHour(hour);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: AgendaTask) => {
    setSelectedTask(task);
    setDefaultHour(undefined);
    setIsTaskModalOpen(true);
  };

  // Date Navigation
  const surroundingDates = getSurroundingDates(currentDate, 7);

  const handleSelectDate = (dateStr: string) => {
    setCurrentDate(dateStr);
  };

  const handlePreviousDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const prevStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setCurrentDate(prevStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const nextStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setCurrentDate(nextStr);
  };

  const handleJumpToday = () => {
    setCurrentDate(getTodayDateString());
  };

  // Load Preset
  const handleSelectPreset = (preset: DayAgendaData) => {
    const updatedPreset: DayAgendaData = {
      ...preset,
      dateString: currentDate,
    };
    handleUpdateCurrentDay(updatedPreset);
  };

  // Focus Timer Completion
  const handleSessionComplete = (minutes: number) => {
    const nextStats = updateFocusStats(minutes);
    setStats(nextStats);
  };

  // Disaster Relief Handlers
  const handleTriggerAllocation = () => {
    reliefService.runAutoAllocation();
    refreshDisasterData();
  };

  const handleUpdateAllocationStatus = (id: string, newStatus: AllocationStatusEnum) => {
    reliefService.updateAllocationStatus(id, newStatus);
    refreshDisasterData();
  };

  const handleCreateReliefRequest = (data: {
    locationName: string;
    region?: string;
    resourceType: ResourceTypeEnum;
    quantityRequested: number;
    priority: PriorityEnum;
    notes?: string;
    isMainAgendaFocus?: boolean;
  }) => {
    reliefService.createRequest(data);
    refreshDisasterData();
  };

  const handleCreateWarehouseStock = (data: {
    warehouseName: string;
    warehouseLocation: string;
    resourceType: ResourceTypeEnum;
    availableQuantity: number;
  }) => {
    reliefService.addOrUpdateStock(data);
    refreshDisasterData();
  };

  // Calculate Main Agenda Progress
  const milestones = currentDay.mainAgenda.milestones || [];
  const completedMilestones = milestones.filter((m) => m.done).length;
  const progressPercent = milestones.length > 0 
    ? (completedMilestones / milestones.length) * 100 
    : (currentDay.mainAgenda.completed ? 100 : 0);

  const { dayName, dayNumber, monthName } = formatDateLabel(currentDate);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-start selection:bg-neutral-800 selection:text-white">
      {/* Top Navigation Mode Switcher: Lets user easily switch between wireframe screens */}
      <header className="w-full max-w-lg px-4 py-2 bg-neutral-950/90 border-b border-neutral-800 text-xs flex items-center justify-between z-50">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-neutral-200">View Screen:</span>
        </div>

        <nav aria-label="Screen View Navigation" className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedUtilityPage(null);
              setCurrentScreen('figma_dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              !selectedUtilityPage && currentScreen === 'figma_dashboard'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layout className="w-3 h-3" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedUtilityPage(null);
              setCurrentScreen('figma_auth');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              !selectedUtilityPage && currentScreen === 'figma_auth'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedUtilityPage(null);
              setCurrentScreen('advanced_console');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              !selectedUtilityPage && currentScreen === 'advanced_console'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Operations</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedUtilityPage(null);
              setCurrentScreen('rag_assistant');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              !selectedUtilityPage && currentScreen === 'rag_assistant'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-blue-400 hover:text-white'
            }`}
          >
            <Bot className="w-3 h-3" />
            <span>RAG / SLM</span>
          </button>

          {/* Quick Dropdown for all 11 Utility & Legal Pages */}
          <select
            value={selectedUtilityPage || ''}
            onChange={(e) => {
              soundManager.playTap();
              const val = e.target.value as UtilityPageType;
              setSelectedUtilityPage(val || null);
            }}
            className="bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none focus:border-white transition-colors"
          >
            <option value="">Pages (11) ▼</option>
            <option value="404_not_found">1. 404 Page (Not Found)</option>
            <option value="privacy_policy">2. Privacy Policy</option>
            <option value="terms_conditions">3. Terms & Conditions</option>
            <option value="cookie_preferences">4. Cookie Preferences</option>
            <option value="refund_cancellation">5. Refund & Cancellation</option>
            <option value="payment_failed">6. Payment Failed Page</option>
            <option value="password_reset">7. Password Reset / Failed</option>
            <option value="email_verification">8. Email Verification (OTP)</option>
            <option value="access_denied">9. Access Denied (403)</option>
            <option value="maintenance_mode">10. Maintenance Mode</option>
            <option value="help_support">11. Help & Support</option>
          </select>
        </nav>
      </header>

      {/* Main Screen Container: Max 430px smartphone shell */}
      <main className="w-full max-w-[430px] my-3 rounded-[44px] border-[8px] border-neutral-800 shadow-2xl bg-white overflow-hidden min-h-[850px] relative">
        {/* UTILITY PAGES (When user selects 404, privacy, terms, cookies, refund, payment failed, password reset, etc.) */}
        {selectedUtilityPage ? (
          <StandardUtilityPages
            pageType={selectedUtilityPage}
            onBack={() => setSelectedUtilityPage(null)}
            onNavigateToPage={(p) => setSelectedUtilityPage(p)}
          />
        ) : (
          <>
            {/* SCREEN 1: Dashboard Mockup (Matching WhatsApp Image 1) */}
            {currentScreen === 'figma_dashboard' && (
              <FigmaDashboardScreen
                appName="App name"
                userEmail={currentUserEmail}
                gapData={gapData}
                allocations={allocations}
                stocks={stocks}
                requests={requests}
                mainAgenda={currentDay.mainAgenda}
                onOpenSignIn={() => setCurrentScreen('figma_auth')}
                onTriggerAllocation={handleTriggerAllocation}
                onUpdateAllocationStatus={handleUpdateAllocationStatus}
                onOpenFocusTimer={() => {
                  setCurrentScreen('advanced_console');
                  setActiveTab('timer');
                }}
                onToggleMainAgenda={handleToggleMainAgendaComplete}
                onOpenUtilityPage={(page) => setSelectedUtilityPage(page)}
                onOpenRagAssistant={() => setCurrentScreen('rag_assistant')}
              />
            )}

            {/* SCREEN 2: Sign In Mockup (Matching WhatsApp Image 2) */}
            {currentScreen === 'figma_auth' && (
              <FigmaAuthScreen
                onSignInSuccess={(email) => {
                  setCurrentUserEmail(email);
                  setCurrentScreen('figma_dashboard');
                }}
                onSkipToDashboard={() => setCurrentScreen('figma_dashboard')}
                onOpenUtilityPage={(page) => setSelectedUtilityPage(page)}
              />
            )}

            {/* SCREEN 3: Advanced Console Mode (Disaster Operations & n8n) */}
            {currentScreen === 'advanced_console' && (
              <MobileFrame
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddTask={() => {
                  setSelectedTask(null);
                  setDefaultHour(undefined);
                  setIsTaskModalOpen(true);
                }}
                dateTitle={`${dayName}, ${monthName} ${dayNumber}`}
              >
                {/* Tab 1: Today's Mission Agenda */}
                {activeTab === 'agenda' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 pt-1 pb-1">
                      <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl">
                        <button
                          onClick={() => {
                            soundManager.playTap();
                            setViewMode('timeline');
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'timeline'
                              ? 'bg-amber-500 text-neutral-950 shadow-sm'
                              : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Timeline</span>
                        </button>
                        <button
                          onClick={() => {
                            soundManager.playTap();
                            setViewMode('list');
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'list'
                              ? 'bg-amber-500 text-neutral-950 shadow-sm'
                              : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <ListFilter className="w-3.5 h-3.5" />
                          <span>Task List</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            soundManager.playTap();
                            setIsPresetModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                          title="Load Disaster or Executive Presets"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden xs:inline">Presets</span>
                        </button>

                        <button
                          onClick={() => {
                            soundManager.playTap();
                            setIsShareModalOpen(true);
                          }}
                          className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                          title="Share Daily Briefing"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <DateRibbon
                      dates={surroundingDates}
                      currentDate={currentDate}
                      onSelectDate={handleSelectDate}
                      daysData={daysData}
                      onPreviousDay={handlePreviousDay}
                      onNextDay={handleNextDay}
                      onJumpToday={handleJumpToday}
                    />

                    <MainAgendaHero
                      agenda={currentDay.mainAgenda}
                      onToggleComplete={handleToggleMainAgendaComplete}
                      onToggleMilestone={handleToggleMilestone}
                      onStartFocus={() => setActiveTab('timer')}
                      onEdit={() => setIsEditMainAgendaOpen(true)}
                      progressPercent={progressPercent}
                    />

                    <div 
                      onClick={() => setActiveTab('dashboard')}
                      className="p-3 rounded-2xl bg-neutral-900/70 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs font-semibold text-neutral-200">
                          Live Resource Gap: {gapData.criticalCount} Critical Shortages in Sector 4
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400">View Gaps →</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 pb-1 border-b border-neutral-900">
                      <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                        {viewMode === 'timeline' ? 'Day Schedule & Time Blocks' : 'All Day Tasks'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400 font-tabular font-medium">
                          {currentDay.tasks.length} tasks scheduled
                        </span>
                        <button
                          onClick={() => {
                            soundManager.playTap();
                            setSelectedTask(null);
                            setDefaultHour(undefined);
                            setIsTaskModalOpen(true);
                          }}
                          className="p-1 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white"
                          title="Add Task"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {viewMode === 'timeline' ? (
                      <TimelineView
                        tasks={currentDay.tasks}
                        onToggleTask={handleToggleTask}
                        onEditTask={handleEditTask}
                        onAddTaskAtHour={handleAddTaskAtHour}
                      />
                    ) : (
                      <TaskListView
                        tasks={currentDay.tasks}
                        onToggleTask={handleToggleTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onAddTask={() => {
                          setSelectedTask(null);
                          setDefaultHour(undefined);
                          setIsTaskModalOpen(true);
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Tab 2: Disaster Relief Dashboard (Gaps, Stock, Allocations) */}
                {activeTab === 'dashboard' && (
                  <DisasterDashboardTab
                    gapData={gapData}
                    allocations={allocations}
                    stocks={stocks}
                    requests={requests}
                    onTriggerAllocation={handleTriggerAllocation}
                    onUpdateStatus={handleUpdateAllocationStatus}
                    onNavigateToOperator={() => setActiveTab('operator')}
                  />
                )}

                {/* Tab 3: Operator & Warehouse Input Forms */}
                {activeTab === 'operator' && (
                  <OperatorInputTab
                    onSubmitRequest={handleCreateReliefRequest}
                    onSubmitStock={handleCreateWarehouseStock}
                    onSuccessRedirect={() => setActiveTab('dashboard')}
                  />
                )}

                {/* Tab 4: RAG AI Assistant */}
                {activeTab === 'rag' && (
                  <RagAssistantTab />
                )}

                {/* Tab 5: n8n Workflow Automation */}
                {activeTab === 'n8n' && (
                  <N8nWorkflowTab />
                )}

                {/* Focus Timer View */}
                {activeTab === 'timer' && (
                  <FocusTimerTab
                    mainAgenda={currentDay.mainAgenda}
                    onSessionComplete={handleSessionComplete}
                    onToggleMilestone={handleToggleMilestone}
                  />
                )}
              </MobileFrame>
            )}

            {/* SCREEN 4: Full RAG Application */}
            {currentScreen === 'rag_assistant' && (
              <div className="w-full min-h-[850px] bg-[#F8F9FA] text-neutral-900 flex flex-col justify-between select-none font-sans relative">
                {/* iOS Top Status Bar (9:41) */}
                <div className="sticky top-0 z-30 bg-[#F8F9FA]/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs text-neutral-800 border-b border-neutral-200/50">
                  <span className="font-bold tracking-tight text-sm">9:41</span>
                  <div className="flex items-center gap-1.5 text-neutral-800">
                    <div className="flex items-end gap-0.5 h-3">
                      <div className="w-0.5 h-1 bg-neutral-900 rounded-sm" />
                      <div className="w-0.5 h-1.5 bg-neutral-900 rounded-sm" />
                      <div className="w-0.5 h-2 bg-neutral-900 rounded-sm" />
                      <div className="w-0.5 h-2.5 bg-neutral-900 rounded-sm" />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 flex items-center justify-between border-b border-neutral-200 bg-white">
                  <button
                    onClick={() => {
                      soundManager.playTap();
                      setCurrentScreen('figma_dashboard');
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <h1 className="font-bold text-sm text-neutral-900">RAG AI Assistant</h1>
                  <div className="w-12" />
                </div>

                <div className="flex-1 px-5 pt-3 overflow-y-auto">
                  <RagAssistantTab />
                </div>

                {/* iOS Home Indicator */}
                <div className="w-32 h-1 bg-neutral-300 rounded-full mx-auto my-2" />
              </div>
            )}
      </>
    )}
  </main>

      {/* Modals & Drawers */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={selectedTask}
        defaultHour={defaultHour}
      />

      <EditMainAgendaModal
        isOpen={isEditMainAgendaOpen}
        onClose={() => setIsEditMainAgendaOpen(false)}
        onSave={handleSaveMainAgenda}
        initialAgenda={currentDay.mainAgenda}
      />

      <PresetSelectorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <BriefingShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        dayData={currentDay}
      />
    </div>
  );
}
