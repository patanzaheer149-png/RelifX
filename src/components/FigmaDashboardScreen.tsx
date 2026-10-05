import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  ArrowLeftRight, 
  BarChart2, 
  User, 
  Wifi, 
  Battery, 
  CheckCircle2, 
  Sparkles,
  Flame,
  ArrowUpRight,
  Truck,
  AlertTriangle,
  ArrowRight,
  Bot
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { 
  ResourceGapSummaryModel, 
  DispatchAllocationModel, 
  WarehouseStockModel, 
  ResourceRequestModel,
  AllocationStatusEnum,
  RESOURCE_TYPE_LABELS
} from '../types/relief';
import { MainAgenda } from '../types/agenda';
import { UtilityPageType } from './StandardUtilityPages';
import confetti from 'canvas-confetti';

interface FigmaDashboardScreenProps {
  appName?: string;
  userEmail?: string;
  gapData: {
    gaps: ResourceGapSummaryModel[];
    totalPending: number;
    criticalCount: number;
    totalAvailable: number;
    inTransitCount: number;
  };
  allocations: DispatchAllocationModel[];
  stocks: WarehouseStockModel[];
  requests: ResourceRequestModel[];
  mainAgenda: MainAgenda;
  onOpenSignIn: () => void;
  onTriggerAllocation: () => void;
  onUpdateAllocationStatus: (id: string, status: AllocationStatusEnum) => void;
  onOpenFocusTimer: () => void;
  onToggleMainAgenda: () => void;
  onOpenUtilityPage?: (page: UtilityPageType) => void;
  onOpenRagAssistant?: () => void;
}

export const FigmaDashboardScreen: React.FC<FigmaDashboardScreenProps> = ({
  appName = "App name",
  userEmail = "operator@relief.org",
  gapData,
  allocations,
  stocks,
  requests,
  mainAgenda,
  onOpenSignIn,
  onTriggerAllocation,
  onUpdateAllocationStatus,
  onOpenFocusTimer,
  onToggleMainAgenda,
  onOpenUtilityPage,
  onOpenRagAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<'Tab1' | 'Tab2' | 'Tab3'>('Tab1');
  const [bottomNav, setBottomNav] = useState<'home' | 'search' | 'transfer' | 'stats' | 'profile'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRunAutoAllocation = () => {
    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b'],
      });
    } catch {}
    onTriggerAllocation();
  };

  return (
    <div className="w-full min-h-[850px] bg-[#F8F9FA] text-neutral-900 flex flex-col justify-between select-none font-sans relative">
      {/* iOS Top Status Bar (9:41, Signal, Wifi, Battery) matching Image 1 */}
      <div className="sticky top-0 z-30 bg-[#F8F9FA]/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs text-neutral-800 border-b border-neutral-200/50">
        <span className="font-bold tracking-tight text-sm">9:41</span>
        <div className="flex items-center gap-1.5 text-neutral-800">
          <div className="flex items-end gap-0.5 h-3">
            <div className="w-0.5 h-1 bg-neutral-900 rounded-sm" />
            <div className="w-0.5 h-1.5 bg-neutral-900 rounded-sm" />
            <div className="w-0.5 h-2 bg-neutral-900 rounded-sm" />
            <div className="w-0.5 h-2.5 bg-neutral-900 rounded-sm" />
          </div>
          <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
          <Battery className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* Top App Bar Header (Left menu icon, Center App Name, Right Profile Avatar) */}
      <div className="px-6 py-3 flex items-center justify-between">
        <button 
          onClick={() => {
            soundManager.playTap();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="w-8 h-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors shadow-2xs"
          title="Open Navigation Menu & Legal Hub"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className="font-bold text-base tracking-tight text-neutral-900">
          {appName}
        </h1>

        <button
          onClick={() => {
            soundManager.playTap();
            onOpenSignIn();
          }}
          className="w-8 h-8 rounded-full bg-neutral-800 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden border border-white"
          title={`Signed in as ${userEmail}`}
        >
          <span>{userEmail.substring(0, 2).toUpperCase()}</span>
        </button>
      </div>

      {/* Slide-over Menu Drawer with all requested utility & system pages */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex animate-in fade-in">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{appName}</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">{userEmail}</p>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                >
                  ✕
                </button>
              </div>

              {/* RAG AI Assistant Spotlight */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenRagAssistant && onOpenRagAssistant();
                }}
                className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 hover:border-blue-300 flex items-center justify-between shadow-2xs transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                      RAG & SLM Intelligence
                    </h4>
                    <p className="text-[10px] text-neutral-500">
                      Vector Search & Edge Low-Latency
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full font-mono">
                  RAG / SLM
                </span>
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  System & Error Pages
                </span>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('404_not_found');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>404 Page (Not Found)</span>
                  <span className="text-[10px] text-neutral-400">Error</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('payment_failed');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Payment Failed Page</span>
                  <span className="text-[10px] text-rose-500 font-bold">Failed</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('password_reset');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Password Reset / Failed</span>
                  <span className="text-[10px] text-neutral-400">Auth</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('email_verification');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Email OTP Verification</span>
                  <span className="text-[10px] text-blue-500 font-bold">OTP</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('access_denied');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Access Denied (403 Forbidden)</span>
                  <span className="text-[10px] text-amber-500 font-bold">403</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('maintenance_mode');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Maintenance Mode Page</span>
                  <span className="text-[10px] text-neutral-400">Offline</span>
                </button>
              </div>

              <div className="space-y-1 pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Legal & Preferences
                </span>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('privacy_policy');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Privacy Policy
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('terms_conditions');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Terms & Conditions
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('cookie_preferences');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cookie Preferences
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('refund_cancellation');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Refund & Cancellation Policy
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenUtilityPage && onOpenUtilityPage('help_support');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 font-semibold text-blue-600"
                >
                  Help & Support
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full h-9 rounded-lg bg-neutral-900 text-white text-xs font-bold"
              >
                Sign In Screen →
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}

      {/* Scrollable Dashboard Body */}
      <div className="flex-1 px-6 pt-1 pb-24 overflow-y-auto space-y-4">
        {/* Horizontal Segmented Tabs [Tab 1 (Active)], [Tab 2], [Tab 3] */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('Tab1');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Tab1'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Overview & Agenda
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('Tab2');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Tab2'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Resource Gaps ({gapData.criticalCount})
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('Tab3');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Tab3'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Dispatches ({allocations.length})
          </button>
        </div>

        {/* TAB 1: Overview & Agenda (Exact layout from WhatsApp Image 1) */}
        {activeTab === 'Tab1' && (
          <>
            {/* Highlight: Main Agenda of the Day (Spotlight Mission) */}
            <div className="rounded-2xl bg-white border border-neutral-200/80 p-4 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3 fill-current" />
                  Main Agenda of the Day
                </span>
                <span className="text-[10px] font-bold text-neutral-500 font-mono">
                  Target: {mainAgenda.deadlineTime || "17:30"}
                </span>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 leading-snug mb-1">
                {mainAgenda.title}
              </h3>

              {mainAgenda.whyItMatters && (
                <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
                  {mainAgenda.whyItMatters}
                </p>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => {
                    soundManager.playTap();
                    onOpenFocusTimer();
                  }}
                  className="text-xs font-semibold text-neutral-800 hover:text-black flex items-center gap-1"
                >
                  <span>Focus Mode</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    soundManager.playTap();
                    onToggleMainAgenda();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    mainAgenda.completed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {mainAgenda.completed ? 'Accomplished ✓' : 'Complete Mission'}
                </button>
              </div>
            </div>

            {/* 2-Column Metric Cards ($45,678.90 & 2,405) Exactly matching Image 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
                <span className="text-xs text-neutral-500 font-medium block mb-1">
                  Title
                </span>
                <div className="font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight leading-tight font-tabular">
                  $45,678.90
                </div>
                <span className="text-[11px] text-neutral-500 font-medium block mt-1">
                  +20% month over month
                </span>
              </div>

              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
                <span className="text-xs text-neutral-500 font-medium block mb-1">
                  Title
                </span>
                <div className="font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight leading-tight font-tabular">
                  2,405
                </div>
                <span className="text-[11px] text-neutral-500 font-medium block mt-1">
                  +33% month over month
                </span>
              </div>
            </div>

            {/* Large Chart Card with Blue Wave Curve & Gridlines (Matching Image 1) */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">
                  Title
                </span>
                <button
                  onClick={handleRunAutoAllocation}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Allocate Stock</span>
                </button>
              </div>

              <div className="relative pt-2">
                <div className="flex">
                  <div className="flex flex-col justify-between text-[9px] text-neutral-400 font-mono pr-2 h-36 text-right">
                    <span>$10k</span>
                    <span>$8k</span>
                    <span>$6k</span>
                    <span>$4k</span>
                    <span>$2k</span>
                    <span>$0</span>
                  </div>

                  <div className="flex-1 h-36 relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 280 140" preserveAspectRatio="none">
                      <line x1="0" y1="0" x2="280" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="28" x2="280" y2="28" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="56" x2="280" y2="56" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="84" x2="280" y2="84" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="112" x2="280" y2="112" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="140" x2="280" y2="140" stroke="#e2e8f0" strokeWidth="1" />

                      <defs>
                        <linearGradient id="blueWaveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M 0 135 L 30 130 L 60 120 L 90 100 L 120 95 L 150 78 L 180 65 L 210 82 L 240 70 L 270 20 L 270 140 L 0 140 Z"
                        fill="url(#blueWaveGradient)"
                      />

                      <path
                        d="M 0 135 L 30 130 L 60 120 L 90 100 L 120 95 L 150 78 L 180 65 L 210 82 L 240 70 L 270 20"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle cx="270" cy="20" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-neutral-400 font-medium pl-8 pr-1 pt-2">
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
              </div>
            </div>

            {/* Recent Items List (Matching Image 1 bottom list: Elynn Lee, Oscar Oum...) */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">
                  Title
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Live updates
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      EL
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        Elynn Lee
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Sector 4 Coordinator · Water & Trauma kits
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Dispatched
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      OO
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        Oscar Oum
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Central Warehouse Terminal A · 280 units
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    In Transit
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      HE
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        Highland Camp
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Shelter Tents & Power Generators
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: Resource Gap Calculation (Gap = max(Required - Available, 0)) */}
        {activeTab === 'Tab2' && (
          <div className="space-y-3">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Resource Gap Analysis
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Gap Formula: <code className="font-mono text-blue-600">max(Required - Available, 0)</code>
                  </p>
                </div>
                <button
                  onClick={handleRunAutoAllocation}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs hover:bg-blue-500"
                >
                  Auto-Allocate
                </button>
              </div>

              <div className="space-y-2">
                {gapData.gaps.map((item) => {
                  const hasShortage = item.deficitGap > 0;
                  return (
                    <div 
                      key={item.resourceType}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800">
                          {item.resourceName}
                        </span>
                        {hasShortage ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            ⚠️ SHORTAGE: {item.deficitGap} {item.unit}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            🟢 SURPLUS: +{item.surplus} {item.unit}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 font-tabular">
                        <span>Required: <strong className="text-neutral-800">{item.totalRequested}</strong></span>
                        <span>Available: <strong className="text-neutral-800">{item.totalAvailableStock}</strong></span>
                        <span>Gap: <strong className={hasShortage ? 'text-rose-600 font-bold' : 'text-emerald-600'}>{item.deficitGap}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Affected Areas Demand Breakdown */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Affected Areas Demand Table
              </h3>

              <div className="space-y-2">
                {requests.map((r) => {
                  const unfulfilled = r.quantityRequested - r.quantityFulfilled;
                  return (
                    <div key={r.id} className="p-2.5 rounded-xl border border-neutral-200/60 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-neutral-900">{r.locationName}</p>
                        <p className="text-[10px] text-neutral-500">{RESOURCE_TYPE_LABELS[r.resourceType].name} · Needed: {r.quantityRequested}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {r.priority}
                        </span>
                        <p className="text-[10px] font-tabular mt-0.5 text-neutral-500">
                          {unfulfilled > 0 ? `Shortage: ${unfulfilled}` : 'Fulfilled ✓'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Dispatches & Suggested Multi-Warehouse Allocations */}
        {activeTab === 'Tab3' && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Suggested Allocation & Dispatch Pipeline
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Warehouse Stock → Affected Area Dispatch
                </p>
              </div>

              <button
                onClick={handleRunAutoAllocation}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs hover:bg-blue-500"
              >
                + New Allocation
              </button>
            </div>

            <div className="space-y-2.5">
              {allocations.map((alloc) => (
                <div key={alloc.id} className="p-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-neutral-900">
                        <span className="text-blue-600">{alloc.warehouseName}</span>
                        <ArrowRight className="w-3 h-3 text-neutral-400" />
                        <span>{alloc.locationName}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        {alloc.allocatedQuantity} units · {alloc.fleetIdentifier}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {alloc.status}
                    </span>
                  </div>

                  {/* Status Steps */}
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-200 font-medium">
                    <span className={alloc.status === 'SUGGESTED' ? 'font-bold text-blue-600' : 'text-neutral-400'}>1. Suggested</span>
                    <span>→</span>
                    <span className={alloc.status === 'APPROVED' ? 'font-bold text-blue-600' : 'text-neutral-400'}>2. Approved</span>
                    <span>→</span>
                    <span className={alloc.status === 'IN_TRANSIT' ? 'font-bold text-blue-600' : 'text-neutral-400'}>3. Dispatched</span>
                    <span>→</span>
                    <span className={alloc.status === 'DELIVERED' ? 'font-bold text-emerald-600' : 'text-neutral-400'}>4. Delivered</span>
                  </div>

                  {/* Status Change Buttons */}
                  <div className="flex justify-end gap-1.5 pt-1">
                    {alloc.status === 'SUGGESTED' && (
                      <button
                        onClick={() => {
                          soundManager.playTap();
                          onUpdateAllocationStatus(alloc.id, 'APPROVED');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[10px]"
                      >
                        Approve Allocation
                      </button>
                    )}
                    {alloc.status === 'APPROVED' && (
                      <button
                        onClick={() => {
                          soundManager.playTap();
                          onUpdateAllocationStatus(alloc.id, 'IN_TRANSIT');
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]"
                      >
                        Dispatch Fleet Convoy
                      </button>
                    )}
                    {alloc.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => {
                          soundManager.playSuccess();
                          onUpdateAllocationStatus(alloc.id, 'DELIVERED');
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                      >
                        Confirm Delivery ✓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation Bar with 5 icons matching Image 1 */}
      <div className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-6 py-2 select-none">
        <div className="grid grid-cols-5 items-center max-w-sm mx-auto">
          {/* Icon 1: Home (Filled black when active) */}
          <button
            onClick={() => {
              soundManager.playTap();
              setBottomNav('home');
              setActiveTab('Tab1');
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              bottomNav === 'home' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.5L2 11h3v10h5v-6h4v6h5V11h3L12 2.5z" />
            </svg>
          </button>

          {/* Icon 2: Search */}
          <button
            onClick={() => {
              soundManager.playTap();
              setBottomNav('search');
              setActiveTab('Tab2');
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              bottomNav === 'search' ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Icon 3: Transfer / Middle icon */}
          <button
            onClick={() => {
              soundManager.playTap();
              setBottomNav('transfer');
              setActiveTab('Tab3');
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              bottomNav === 'transfer' ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Icon 4: Analytics / Chart */}
          <button
            onClick={() => {
              soundManager.playTap();
              setBottomNav('stats');
              handleRunAutoAllocation();
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              bottomNav === 'stats' ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <BarChart2 className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Icon 5: Profile / Sign Out */}
          <button
            onClick={() => {
              soundManager.playTap();
              setBottomNav('profile');
              onOpenSignIn();
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              bottomNav === 'profile' ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-neutral-300 rounded-full mx-auto mt-1" />
      </div>
    </div>
  );
};
