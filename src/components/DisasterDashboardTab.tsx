import React, { useState } from 'react';
import { 
  ResourceGapSummaryModel, 
  DispatchAllocationModel, 
  WarehouseStockModel, 
  ResourceRequestModel,
  AllocationStatusEnum,
  RESOURCE_TYPE_LABELS
} from '../types/relief';
import { 
  AlertTriangle, 
  Truck, 
  Boxes, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DisasterDashboardTabProps {
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
  onTriggerAllocation: () => void;
  onUpdateStatus: (id: string, status: AllocationStatusEnum) => void;
  onNavigateToOperator: () => void;
}

export const DisasterDashboardTab: React.FC<DisasterDashboardTabProps> = ({
  gapData,
  allocations,
  stocks,
  requests,
  onTriggerAllocation,
  onUpdateStatus,
  onNavigateToOperator,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | AllocationStatusEnum>('ALL');

  const filteredAllocations = allocations.filter(a => {
    if (selectedStatusFilter === 'ALL') return true;
    return a.status === selectedStatusFilter;
  });

  const handleRunAllocation = () => {
    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8']
      });
    } catch {}
    onTriggerAllocation();
  };

  const getStatusBadge = (status: AllocationStatusEnum) => {
    switch (status) {
      case 'SUGGESTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">SUGGESTED</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">APPROVED</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"><Truck className="w-2.5 h-2.5 animate-pulse" /> DISPATCHED</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> DELIVERED</span>;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Platform Header */}
      <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-xs font-bold text-neutral-100">
              Disaster Relief Resource Coordination
            </h3>
            <p className="text-[11px] text-neutral-400">
              Demand · Supply · Gap Calculation · Suggested Allocation
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAllocation}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all active:scale-95"
          title="Run Spring Boot greedy allocation matching algorithm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Allocate</span>
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-neutral-400 font-medium">Critical Gaps</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-tabular text-2xl font-extrabold text-rose-400">
              {gapData.criticalCount}
            </span>
            <span className="text-[11px] text-neutral-500">shortage zones</span>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-neutral-400 font-medium">Active Dispatches</span>
            <Truck className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-tabular text-2xl font-extrabold text-neutral-100">
              {gapData.inTransitCount}
            </span>
            <span className="text-[11px] text-neutral-500">en route convoys</span>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-neutral-400 font-medium">Pending Requests</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-tabular text-2xl font-extrabold text-neutral-100">
              {gapData.totalPending}
            </span>
            <span className="text-[11px] text-neutral-500">affected areas</span>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-neutral-400 font-medium">Warehouse Stock</span>
            <Boxes className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-tabular text-2xl font-extrabold text-emerald-400">
              {gapData.totalAvailable}
            </span>
            <span className="text-[11px] text-neutral-500">available units</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Aggregate Resource Gaps (Gap = max(Required - Available, 0)) */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-neutral-100">
              1. Resource Gap Calculation
            </h4>
            <p className="text-[11px] text-neutral-400">
              Formula: <code className="text-amber-400">Gap = max(Required - Available, 0)</code>
            </p>
          </div>
          <button
            onClick={onNavigateToOperator}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
          >
            <span>+ Add Request</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {gapData.gaps.map((item) => {
            const hasDeficit = item.deficitGap > 0;
            const ratio = item.totalRequested > 0 
              ? Math.min(100, Math.round((item.totalAvailableStock / item.totalRequested) * 100))
              : 100;

            return (
              <div 
                key={item.resourceType}
                className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-200">
                    {item.resourceName}
                  </span>
                  {hasDeficit ? (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                      ⚠️ SHORTAGE (Gap: {item.deficitGap} {item.unit})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      🟢 SURPLUS (+{item.surplus} {item.unit})
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      hasDeficit ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-tabular">
                  <span>Required: <strong className="text-neutral-200">{item.totalRequested}</strong></span>
                  <span>Available: <strong className="text-neutral-200">{item.totalAvailableStock}</strong></span>
                  <span className="text-neutral-500 font-sans">{ratio}% fulfilled</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Area-by-Area Demand Status (The core user input requirement) */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-neutral-100">
              2. Affected Areas Demand & Status
            </h4>
            <p className="text-[11px] text-neutral-400">
              Entered by relief operators on the ground
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-tabular font-medium">
            {requests.length} areas
          </span>
        </div>

        <div className="space-y-2">
          {requests.map((req) => {
            const meta = RESOURCE_TYPE_LABELS[req.resourceType];
            const unfulfilled = req.quantityRequested - req.quantityFulfilled;
            const isFulfilled = unfulfilled <= 0;

            return (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                      <span>{req.locationName}</span>
                      {req.isMainAgendaFocus && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                          MAIN AGENDA
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-neutral-400">
                      {req.region} · Needed: <span className="text-neutral-200 font-semibold">{meta.name}</span>
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    req.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-neutral-800 text-neutral-400'
                  }`}>
                    {req.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-900 font-tabular">
                  <span>Demand: <strong className="text-neutral-200">{req.quantityRequested}</strong></span>
                  <span>Dispatched: <strong className="text-emerald-400">{req.quantityFulfilled}</strong></span>
                  <span>
                    {isFulfilled ? (
                      <span className="text-emerald-400 font-bold font-sans">✓ Full</span>
                    ) : (
                      <span className="text-rose-400 font-bold font-sans">Gap: {unfulfilled}</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Suggested Allocation & Dispatch Pipeline */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-neutral-100">
              3. Suggested Allocation & Dispatch
            </h4>
            <p className="text-[11px] text-neutral-400">
              Warehouse source → Affected area convoy status
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-tabular font-medium">
            {allocations.length} records
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
          {(['ALL', 'SUGGESTED', 'APPROVED', 'IN_TRANSIT', 'DELIVERED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                soundManager.playTap();
                setSelectedStatusFilter(st);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedStatusFilter === st
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Allocation chain cards */}
        <div className="space-y-2">
          {filteredAllocations.length === 0 ? (
            <div className="text-center py-6 px-3 rounded-xl bg-neutral-950/40 border border-neutral-800 text-xs text-neutral-500">
              No dispatches currently matching this filter. Tap &quot;Auto-Allocate&quot; above to run the matching engine.
            </div>
          ) : (
            filteredAllocations.map((alloc) => (
              <div
                key={alloc.id}
                className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-xs text-neutral-300 font-semibold truncate">
                      <span className="text-amber-400 truncate">{alloc.warehouseName}</span>
                      <ArrowRight className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="text-white truncate">{alloc.locationName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 font-tabular">
                      Allocated: <span className="text-amber-300 font-bold">{alloc.allocatedQuantity} units</span> · {alloc.fleetIdentifier}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(alloc.status)}
                  </div>
                </div>

                {/* Dispatch Progression Step Bar */}
                <div className="flex items-center justify-between gap-1 text-[10px] pt-1 border-t border-neutral-900 font-medium">
                  <span className={alloc.status === 'SUGGESTED' ? 'text-amber-400 font-bold' : 'text-neutral-500'}>1. Suggested</span>
                  <span className="text-neutral-600">→</span>
                  <span className={alloc.status === 'APPROVED' ? 'text-sky-400 font-bold' : 'text-neutral-500'}>2. Approved</span>
                  <span className="text-neutral-600">→</span>
                  <span className={alloc.status === 'IN_TRANSIT' ? 'text-indigo-400 font-bold' : 'text-neutral-500'}>3. Dispatched</span>
                  <span className="text-neutral-600">→</span>
                  <span className={alloc.status === 'DELIVERED' ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>4. Delivered</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {alloc.status === 'SUGGESTED' && (
                    <button
                      onClick={() => {
                        soundManager.playTap();
                        onUpdateStatus(alloc.id, 'APPROVED');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40 transition-colors"
                    >
                      Approve Allocation
                    </button>
                  )}
                  {alloc.status === 'APPROVED' && (
                    <button
                      onClick={() => {
                        soundManager.playTap();
                        onUpdateStatus(alloc.id, 'IN_TRANSIT');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 transition-colors"
                    >
                      Dispatch Convoy
                    </button>
                  )}
                  {alloc.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => {
                        soundManager.playSuccess();
                        onUpdateStatus(alloc.id, 'DELIVERED');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 4: Warehouse Stocks Overview */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-2.5">
        <h4 className="font-display text-xs font-bold text-neutral-200 uppercase tracking-wider">
          4. Warehouse Inventory Reserves
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {stocks.map((stock) => (
            <div 
              key={stock.id}
              className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-semibold text-neutral-200">{stock.warehouseName}</p>
                <p className="text-[10px] text-neutral-500">{stock.warehouseLocation}</p>
              </div>

              <div className="text-right">
                <span className="font-tabular font-bold text-neutral-100">
                  {stock.availableQuantity - stock.reservedQuantity} usable
                </span>
                {stock.reservedQuantity > 0 && (
                  <p className="text-[10px] text-amber-400 font-tabular">
                    ({stock.reservedQuantity} reserved)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
