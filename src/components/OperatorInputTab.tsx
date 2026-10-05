import React, { useState } from 'react';
import { ResourceTypeEnum, PriorityEnum, RESOURCE_TYPE_LABELS } from '../types/relief';
import { 
  Building2, 
  MapPin, 
  Flame, 
  CheckCircle2, 
  Warehouse, 
  Send 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface OperatorInputTabProps {
  onSubmitRequest: (data: {
    locationName: string;
    region?: string;
    resourceType: ResourceTypeEnum;
    quantityRequested: number;
    priority: PriorityEnum;
    notes?: string;
    isMainAgendaFocus?: boolean;
  }) => void;
  onSubmitStock: (data: {
    warehouseName: string;
    warehouseLocation: string;
    resourceType: ResourceTypeEnum;
    availableQuantity: number;
  }) => void;
  onSuccessRedirect: () => void;
}

export const OperatorInputTab: React.FC<OperatorInputTabProps> = ({
  onSubmitRequest,
  onSubmitStock,
  onSuccessRedirect,
}) => {
  const [activeForm, setActiveForm] = useState<'operator' | 'warehouse'>('operator');

  // Relief Operator Form State
  const [locationName, setLocationName] = useState('');
  const [region, setRegion] = useState('Sector 4 Flooded Zone');
  const [resourceType, setResourceType] = useState<ResourceTypeEnum>('POTABLE_WATER');
  const [quantity, setQuantity] = useState<number>(100);
  const [priority, setPriority] = useState<PriorityEnum>('CRITICAL');
  const [notes, setNotes] = useState('');
  const [isMainAgenda, setIsMainAgenda] = useState(true);

  // Warehouse Form State
  const [warehouseName, setWarehouseName] = useState('Central Depot Terminal A');
  const [warehouseLocation, setWarehouseLocation] = useState('Central Industrial Zone Bay 3');
  const [whResourceType, setWhResourceType] = useState<ResourceTypeEnum>('POTABLE_WATER');
  const [whQuantity, setWhQuantity] = useState<number>(200);

  // Feedback states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!locationName.trim()) {
      setErrorMessage('Validation Error: Affected location name cannot be blank (Spring Boot @NotBlank validation).');
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('Validation Error: Quantity requested must be at least 1 (Spring Boot @Min validation).');
      return;
    }

    try {
      soundManager.playSuccess();
      onSubmitRequest({
        locationName: locationName.trim(),
        region,
        resourceType,
        quantityRequested: Number(quantity),
        priority,
        notes: notes.trim(),
        isMainAgendaFocus: isMainAgenda,
      });

      setSuccessMessage(`HTTP 201 Created: Relief request for ${locationName} registered successfully!`);
      setLocationName('');
      setNotes('');
      setTimeout(() => {
        setSuccessMessage(null);
        onSuccessRedirect();
      }, 1500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit request');
    }
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!warehouseName.trim()) {
      setErrorMessage('Validation Error: Warehouse name is required.');
      return;
    }
    if (whQuantity < 0) {
      setErrorMessage('Validation Error: Available stock cannot be negative.');
      return;
    }

    try {
      soundManager.playSuccess();
      onSubmitStock({
        warehouseName: warehouseName.trim(),
        warehouseLocation: warehouseLocation.trim(),
        resourceType: whResourceType,
        availableQuantity: Number(whQuantity),
      });

      setSuccessMessage(`HTTP 201 Created: ${warehouseName} stock updated for ${whResourceType}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onSuccessRedirect();
      }, 1500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update stock');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Form Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <button
          onClick={() => {
            soundManager.playTap();
            setActiveForm('operator');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeForm === 'operator'
              ? 'bg-amber-500 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Relief Operator Entry</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setActiveForm('warehouse');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeForm === 'warehouse'
              ? 'bg-amber-500 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          <span>Warehouse Stock Entry</span>
        </button>
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORM 1: Relief Operator Entry */}
      {activeForm === 'operator' ? (
        <form onSubmit={handleRequestSubmit} className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-3.5">
          <div>
            <h3 className="font-display text-sm font-bold text-neutral-100">
              Relief Operator Resource Request
            </h3>
            <p className="text-[11px] text-neutral-400">
              Submits payload to Spring Boot <code className="text-amber-400">POST /api/v1/relief-requests</code>
            </p>
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              Affected Location / Camp *
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Sector 4 High School Stadium or Riverside Camp"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Region */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Region / Sector Zone
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. North Flooded Sector"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Resource Type & Quantity */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Required Resource *
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceTypeEnum)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
              >
                {Object.entries(RESOURCE_TYPE_LABELS).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.name} ({meta.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Quantity Needed *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-tabular text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Urgency & Priority *
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    setPriority(lvl);
                  }}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    priority === lvl
                      ? lvl === 'CRITICAL'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : lvl === 'HIGH'
                        ? 'bg-amber-500 text-neutral-950 shadow-sm'
                        : 'bg-sky-500 text-neutral-950 shadow-sm'
                      : 'bg-neutral-950 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Main Agenda Toggle */}
          <div 
            onClick={() => {
              soundManager.playTap();
              setIsMainAgenda(!isMainAgenda);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              isMainAgenda
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-current" />
              <div>
                <p className="text-xs font-bold text-neutral-200">
                  Highlight on Today&apos;s Main Agenda
                </p>
                <p className="text-[10px] text-neutral-400">
                  Anchors this mission as the primary day dispatch objective
                </p>
              </div>
            </div>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              isMainAgenda ? 'bg-amber-500' : 'bg-neutral-800'
            }`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isMainAgenda ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Field Situation Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Flood water receded 10 inches; road accessible via Detour #4."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Resource Request to Spring Boot</span>
          </button>
        </form>
      ) : (
        /* FORM 2: Warehouse Stock Entry */
        <form onSubmit={handleStockSubmit} className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-3.5">
          <div>
            <h3 className="font-display text-sm font-bold text-neutral-100">
              Warehouse Stock Registration
            </h3>
            <p className="text-[11px] text-neutral-400">
              Submits payload to Spring Boot <code className="text-amber-400">POST /api/v1/warehouse-stocks</code>
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Warehouse Facility Name *
            </label>
            <input
              type="text"
              required
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              placeholder="e.g. Central Depot Terminal A"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Facility Address / Location *
            </label>
            <input
              type="text"
              required
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              placeholder="e.g. Central Industrial Zone Bay 3"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Resource Category *
              </label>
              <select
                value={whResourceType}
                onChange={(e) => setWhResourceType(e.target.value as ResourceTypeEnum)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400/60"
              >
                {Object.entries(RESOURCE_TYPE_LABELS).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.name} ({meta.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Available In Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={whQuantity}
                onChange={(e) => setWhQuantity(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-tabular text-neutral-100 focus:outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Update Warehouse Inventory Stock</span>
          </button>
        </form>
      )}
    </div>
  );
};
