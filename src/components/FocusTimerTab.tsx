import React, { useState, useEffect } from 'react';
import { MainAgenda } from '../types/agenda';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, Flame, Bell } from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FocusTimerTabProps {
  mainAgenda: MainAgenda;
  onSessionComplete: (minutes: number) => void;
  onToggleMilestone: (id: string) => void;
}

export const FocusTimerTab: React.FC<FocusTimerTabProps> = ({
  mainAgenda,
  onSessionComplete,
  onToggleMilestone,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'binaural' | 'white'>('off');

  // Sync when selectedDuration changes (if stopped)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning]);

  // Tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session!
      setIsRunning(false);
      soundManager.stopAmbient();
      setAmbientSound('off');
      soundManager.playTimerBell();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
      onSessionComplete(selectedDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, selectedDuration, onSessionComplete]);

  // Ambient sound management
  const handleToggleAmbient = (type: 'off' | 'rain' | 'binaural' | 'white') => {
    soundManager.playTap();
    if (type === 'off' || ambientSound === type) {
      soundManager.stopAmbient();
      setAmbientSound('off');
    } else {
      soundManager.startAmbient(type);
      setAmbientSound(type);
    }
  };

  const toggleTimer = () => {
    soundManager.playTap();
    if (!isRunning) {
      if (ambientSound !== 'off') {
        soundManager.startAmbient(ambientSound);
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    soundManager.playTap();
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    soundManager.stopAmbient();
    setAmbientSound('off');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalSeconds = selectedDuration * 60;
  const progressRatio = (totalSeconds - timeLeft) / totalSeconds;
  const strokeDashoffset = 440 * (1 - progressRatio);

  return (
    <div className="space-y-5 pb-20">
      {/* Anchor Card: Main Agenda */}
      <div className="rounded-2xl bg-neutral-900/90 border border-amber-500/30 p-4 shadow-lg shadow-amber-500/5 relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Anchored Focus Mission</span>
        </div>
        <h3 className="font-display text-base font-bold text-neutral-100 leading-snug">
          {mainAgenda.title}
        </h3>
        {mainAgenda.targetOutcome && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
            Target: {mainAgenda.targetOutcome}
          </p>
        )}
      </div>

      {/* Preset Duration Buttons */}
      <div className="flex items-center justify-center gap-2">
        {[15, 25, 45, 60].map((mins) => (
          <button
            key={mins}
            disabled={isRunning}
            onClick={() => {
              soundManager.playTap();
              setSelectedDuration(mins);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-tabular transition-all ${
              selectedDuration === mins
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 disabled:opacity-50'
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Circular Progress Timer */}
      <div className="relative flex items-center justify-center py-4">
        <svg className="w-64 h-64 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-900"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-amber-500 transition-all duration-300 ease-linear"
            fill="transparent"
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-tabular text-4xl sm:text-5xl font-extrabold text-neutral-100 tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {isRunning ? 'Deep Focus Session' : 'Ready to Start'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 flex items-center justify-center transition-all active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          className={`h-14 px-8 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
            isRunning
              ? 'bg-neutral-800 text-amber-400 border border-amber-500/40 shadow-neutral-950'
              : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            soundManager.playTimerBell();
          }}
          className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 flex items-center justify-center transition-all active:scale-95"
          title="Test Bell"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Ambient Soundscape Generator */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            {ambientSound !== 'off' ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
            )}
            <span>Ambient Soundscapes</span>
          </div>
          <span className="text-[10px] text-neutral-500">Synthesized audio</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[
            { id: 'off', label: 'Mute' },
            { id: 'rain', label: 'Rain' },
            { id: 'binaural', label: 'Alpha' },
            { id: 'white', label: 'White' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggleAmbient(item.id as 'off' | 'rain' | 'binaural' | 'white')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-colors ${
                ambientSound === item.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Milestones Checkbox during Focus */}
      {mainAgenda.milestones.length > 0 && (
        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Main Agenda Milestones
          </p>
          <div className="space-y-1.5">
            {mainAgenda.milestones.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  soundManager.playTap();
                  onToggleMilestone(m.id);
                }}
                className={`w-full text-left flex items-start gap-2 p-2 rounded-xl transition-colors ${
                  m.done ? 'bg-neutral-950/40 text-neutral-500' : 'bg-neutral-950/80 text-neutral-200 hover:bg-neutral-950'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${m.done ? 'text-amber-400' : 'text-neutral-600'}`} />
                <span className={`text-xs ${m.done ? 'line-through text-neutral-500' : ''}`}>
                  {m.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
