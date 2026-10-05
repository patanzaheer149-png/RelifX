import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  LayoutDashboard, 
  ClipboardPenLine, 
  Timer,
  Workflow, 
  Smartphone, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Wifi, 
  Battery,
  Bot
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export type AppTabType = 'agenda' | 'dashboard' | 'operator' | 'rag' | 'timer' | 'n8n';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
  onAddTask: () => void;
  dateTitle: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  onAddTask,
  dateTitle,
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return false;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.soundEnabled);
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    soundManager.soundEnabled = next;
    setSoundEnabled(next);
    if (next) soundManager.playTap();
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start text-neutral-100 selection:bg-amber-400 selection:text-neutral-950">
      {/* Top Device Toolbar for Desktop/Inspectors */}
      <div className="w-full max-w-lg hidden sm:flex items-center justify-between px-4 py-2 text-xs text-neutral-400 border-b border-neutral-900 bg-neutral-950/90 z-20">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-200">Disaster Relief Coordination & Agenda</span>
          <span className="text-neutral-600">·</span>
          <span className="text-[11px] text-neutral-400 font-tabular">{dateTitle}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 hover:text-neutral-200 transition-colors p-1"
            title={soundEnabled ? 'Mute Haptics & Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
            <span className="text-[11px]">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            {deviceFrameMode ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span className="text-[11px]">Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span className="text-[11px]">Shell</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col relative ${
          deviceFrameMode
            ? 'max-w-[430px] my-3 rounded-[48px] border-[10px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-neutral-950 ring-1 ring-neutral-700/50 overflow-hidden min-h-[880px]'
            : 'max-w-md min-h-screen bg-neutral-950'
        }`}
      >
        {/* iOS-Style Status Bar */}
        <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none border-b border-neutral-900/60">
          <span className="font-tabular font-bold tracking-tight text-neutral-200">
            {currentTime}
          </span>

          {/* Dynamic Island Capsule */}
          <div className="w-24 h-4 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800/80 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-neutral-950 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-neutral-200" />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 px-4 pt-3 pb-24 overflow-y-auto">
          {children}
        </div>

        {/* Fixed Mobile Bottom Tab Bar (Thumb Zone - 5 Core Modules) */}
        <div className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-1 py-1.5 select-none">
          <div className="grid grid-cols-5 items-center max-w-sm mx-auto">
            {/* Tab 1: Today's Mission Agenda */}
            <button
              onClick={() => {
                soundManager.playTap();
                onTabChange('agenda');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
                activeTab === 'agenda'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-[9px] tracking-tight mt-1">Agenda</span>
            </button>

            {/* Tab 2: Disaster Dashboard (Gaps & Allocations) */}
            <button
              onClick={() => {
                soundManager.playTap();
                onTabChange('dashboard');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[9px] tracking-tight mt-1">Gaps</span>
            </button>

            {/* Tab 3: Operator & Warehouse Entry */}
            <button
              onClick={() => {
                soundManager.playTap();
                onTabChange('operator');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
                activeTab === 'operator'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ClipboardPenLine className="w-4 h-4" />
              <span className="text-[9px] tracking-tight mt-1">Input</span>
            </button>

            {/* Tab 4: RAG AI Assistant */}
            <button
              onClick={() => {
                soundManager.playTap();
                onTabChange('rag');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
                activeTab === 'rag'
                  ? 'text-blue-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="text-[9px] tracking-tight mt-1">RAG AI</span>
            </button>

            {/* Tab 5: Focus Timer */}
            <button
              onClick={() => {
                soundManager.playTap();
                onTabChange('timer');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
                activeTab === 'timer'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span className="text-[9px] tracking-tight mt-1">Focus</span>
            </button>

            {/* Tab 5: n8n Workflow Automation */}
            <button
              onClick={() => {
                soundManager.playTap();
                onTabChange('n8n');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
                activeTab === 'n8n'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span className="text-[9px] tracking-tight mt-1">n8n</span>
            </button>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-28 h-1 bg-neutral-700/60 rounded-full mx-auto mt-1" />
        </div>
      </div>
    </div>
  );
};
