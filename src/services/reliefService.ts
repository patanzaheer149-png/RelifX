import { 
  ResourceRequestModel, 
  WarehouseStockModel, 
  DispatchAllocationModel, 
  ResourceGapSummaryModel, 
  ResourceTypeEnum, 
  PriorityEnum, 
  AllocationStatusEnum,
  RESOURCE_TYPE_LABELS 
} from '../types/relief';

const RELIEF_REQUESTS_KEY = 'relief_app_requests_v1';
const WAREHOUSE_STOCKS_KEY = 'relief_app_stocks_v1';
const ALLOCATIONS_KEY = 'relief_app_allocations_v1';

export interface HttpLogEntry {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  statusText: string;
  timestamp: string;
  requestBody?: unknown;
  responseBody?: unknown;
}

const INITIAL_REQUESTS: ResourceRequestModel[] = [
  {
    id: 'req-1',
    locationName: 'Sector 4 High School Stadium',
    region: 'North Flooded Sector',
    resourceType: 'POTABLE_WATER',
    quantityRequested: 200,
    quantityFulfilled: 0,
    priority: 'CRITICAL',
    notes: 'Urgent potable water for 450 displaced families; municipal line severed.',
    isMainAgendaFocus: true,
    createdAt: '2026-10-05T08:15:00Z',
  },
  {
    id: 'req-2',
    locationName: 'Sector 4 Triage Clinic',
    region: 'North Flooded Sector',
    resourceType: 'TRAUMA_MEDICAL_KITS',
    quantityRequested: 60,
    quantityFulfilled: 20,
    priority: 'CRITICAL',
    notes: 'Trauma dressings and IV fluids for field clinic.',
    isMainAgendaFocus: true,
    createdAt: '2026-10-05T08:30:00Z',
  },
  {
    id: 'req-3',
    locationName: 'Riverside Community Shelter',
    region: 'East Riverbank Zone',
    resourceType: 'FOOD_RATIONS',
    quantityRequested: 150,
    quantityFulfilled: 50,
    priority: 'HIGH',
    notes: 'High-calorie ration packs for evacuation camp.',
    isMainAgendaFocus: false,
    createdAt: '2026-10-05T09:00:00Z',
  },
  {
    id: 'req-4',
    locationName: 'Sector 4 Field Hospital',
    region: 'North Flooded Sector',
    resourceType: 'POWER_GENERATORS',
    quantityRequested: 4,
    quantityFulfilled: 0,
    priority: 'HIGH',
    notes: 'Power backup for vaccine and blood refrigeration.',
    isMainAgendaFocus: false,
    createdAt: '2026-10-05T09:20:00Z',
  },
  {
    id: 'req-5',
    locationName: 'Highland Evacuation Center',
    region: 'South Mountain Zone',
    resourceType: 'EMERGENCY_TENTS',
    quantityRequested: 40,
    quantityFulfilled: 0,
    priority: 'MEDIUM',
    notes: 'Weatherproof shelter for families awaiting resettlement.',
    isMainAgendaFocus: false,
    createdAt: '2026-10-05T10:00:00Z',
  }
];

const INITIAL_STOCKS: WarehouseStockModel[] = [
  {
    id: 'wh-1',
    warehouseName: 'Central Depot Terminal A',
    warehouseLocation: 'Central Industrial Zone Bay 3',
    resourceType: 'POTABLE_WATER',
    availableQuantity: 280,
    reservedQuantity: 0,
    lastUpdated: '2026-10-05T07:45:00Z',
  },
  {
    id: 'wh-2',
    warehouseName: 'Central Depot Terminal A',
    warehouseLocation: 'Central Industrial Zone Bay 3',
    resourceType: 'TRAUMA_MEDICAL_KITS',
    availableQuantity: 85,
    reservedQuantity: 20,
    lastUpdated: '2026-10-05T08:00:00Z',
  },
  {
    id: 'wh-3',
    warehouseName: 'Harbor Logistics Warehouse',
    warehouseLocation: 'Dock 4 Maritime Compound',
    resourceType: 'FOOD_RATIONS',
    availableQuantity: 320,
    reservedQuantity: 50,
    lastUpdated: '2026-10-05T08:10:00Z',
  },
  {
    id: 'wh-4',
    warehouseName: 'Harbor Logistics Warehouse',
    warehouseLocation: 'Dock 4 Maritime Compound',
    resourceType: 'EMERGENCY_TENTS',
    availableQuantity: 25,
    reservedQuantity: 0,
    lastUpdated: '2026-10-05T08:20:00Z',
  },
  {
    id: 'wh-5',
    warehouseName: 'Northern Logistics Sub-Hub',
    warehouseLocation: 'Highway 9 North Junction',
    resourceType: 'POWER_GENERATORS',
    availableQuantity: 2,
    reservedQuantity: 0,
    lastUpdated: '2026-10-05T08:40:00Z',
  }
];

const INITIAL_ALLOCATIONS: DispatchAllocationModel[] = [
  {
    id: 'alloc-1',
    requestId: 'req-2',
    locationName: 'Sector 4 Triage Clinic',
    warehouseName: 'Central Depot Terminal A',
    resourceType: 'TRAUMA_MEDICAL_KITS',
    allocatedQuantity: 20,
    status: 'IN_TRANSIT',
    transportLeadTimeHours: 1.5,
    fleetIdentifier: 'CONVOY-RELIEF-101',
    allocatedAt: '2026-10-05T09:15:00Z',
  },
  {
    id: 'alloc-2',
    requestId: 'req-3',
    locationName: 'Riverside Community Shelter',
    warehouseName: 'Harbor Logistics Warehouse',
    resourceType: 'FOOD_RATIONS',
    allocatedQuantity: 50,
    status: 'APPROVED',
    transportLeadTimeHours: 2.2,
    fleetIdentifier: 'CONVOY-RELIEF-102',
    allocatedAt: '2026-10-05T09:40:00Z',
  }
];

class DisasterReliefService {
  private httpLogs: HttpLogEntry[] = [];
  private onLogsChangedCallback?: () => void;

  public setOnLogsChanged(cb: () => void) {
    this.onLogsChangedCallback = cb;
  }

  private logHttp(method: HttpLogEntry['method'], endpoint: string, status: number, statusText: string, req?: unknown, res?: unknown) {
    const entry: HttpLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      method,
      endpoint,
      status,
      statusText,
      timestamp: new Date().toLocaleTimeString(),
      requestBody: req,
      responseBody: res,
    };
    this.httpLogs.unshift(entry);
    if (this.httpLogs.length > 30) this.httpLogs.pop();
    if (this.onLogsChangedCallback) this.onLogsChangedCallback();
  }

  public getHttpLogs(): HttpLogEntry[] {
    return [...this.httpLogs];
  }

  public getRequests(): ResourceRequestModel[] {
    try {
      const raw = localStorage.getItem(RELIEF_REQUESTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(RELIEF_REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  }

  public getStocks(): WarehouseStockModel[] {
    try {
      const raw = localStorage.getItem(WAREHOUSE_STOCKS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(WAREHOUSE_STOCKS_KEY, JSON.stringify(INITIAL_STOCKS));
    return INITIAL_STOCKS;
  }

  public getAllocations(): DispatchAllocationModel[] {
    try {
      const raw = localStorage.getItem(ALLOCATIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(ALLOCATIONS_KEY, JSON.stringify(INITIAL_ALLOCATIONS));
    return INITIAL_ALLOCATIONS;
  }

  public createRequest(data: {
    locationName: string;
    region?: string;
    resourceType: ResourceTypeEnum;
    quantityRequested: number;
    priority: PriorityEnum;
    notes?: string;
    isMainAgendaFocus?: boolean;
  }): ResourceRequestModel {
    if (!data.locationName.trim() || !data.quantityRequested || data.quantityRequested <= 0) {
      this.logHttp('POST', '/api/v1/relief-requests', 400, 'Bad Request', data, { error: 'Validation failed' });
      throw new Error('Validation failed: Location and positive quantity are required');
    }

    const current = this.getRequests();
    const newReq: ResourceRequestModel = {
      id: 'req-' + Date.now(),
      locationName: data.locationName.trim(),
      region: data.region?.trim() || 'Sector Zone 1',
      resourceType: data.resourceType,
      quantityRequested: Number(data.quantityRequested),
      quantityFulfilled: 0,
      priority: data.priority,
      notes: data.notes?.trim() || '',
      isMainAgendaFocus: data.priority === 'CRITICAL' || Boolean(data.isMainAgendaFocus),
      createdAt: new Date().toISOString(),
    };

    const updated = [newReq, ...current];
    localStorage.setItem(RELIEF_REQUESTS_KEY, JSON.stringify(updated));
    this.logHttp('POST', '/api/v1/relief-requests', 201, 'Created', data, newReq);
    return newReq;
  }

  public addOrUpdateStock(data: {
    warehouseName: string;
    warehouseLocation: string;
    resourceType: ResourceTypeEnum;
    availableQuantity: number;
  }): WarehouseStockModel {
    if (!data.warehouseName.trim() || data.availableQuantity < 0) {
      this.logHttp('POST', '/api/v1/warehouse-stocks', 400, 'Bad Request', data, { error: 'Invalid stock values' });
      throw new Error('Validation failed: Valid warehouse name and non-negative quantity required');
    }

    const stocks = this.getStocks();
    const existingIndex = stocks.findIndex(
      s => s.warehouseName.toLowerCase() === data.warehouseName.toLowerCase() && s.resourceType === data.resourceType
    );

    let savedStock: WarehouseStockModel;
    if (existingIndex >= 0) {
      stocks[existingIndex].availableQuantity = Number(data.availableQuantity);
      stocks[existingIndex].lastUpdated = new Date().toISOString();
      savedStock = stocks[existingIndex];
    } else {
      savedStock = {
        id: 'wh-' + Date.now(),
        warehouseName: data.warehouseName.trim(),
        warehouseLocation: data.warehouseLocation.trim() || 'Logistics Zone',
        resourceType: data.resourceType,
        availableQuantity: Number(data.availableQuantity),
        reservedQuantity: 0,
        lastUpdated: new Date().toISOString(),
      };
      stocks.push(savedStock);
    }

    localStorage.setItem(WAREHOUSE_STOCKS_KEY, JSON.stringify(stocks));
    this.logHttp('POST', '/api/v1/warehouse-stocks', 201, 'Created/Updated', data, savedStock);
    return savedStock;
  }

  public calculateGaps(): {
    gaps: ResourceGapSummaryModel[];
    totalPending: number;
    criticalCount: number;
    totalAvailable: number;
    inTransitCount: number;
  } {
    const requests = this.getRequests();
    const stocks = this.getStocks();
    const allocations = this.getAllocations();

    const resourceTypes: ResourceTypeEnum[] = [
      'POTABLE_WATER',
      'TRAUMA_MEDICAL_KITS',
      'FOOD_RATIONS',
      'EMERGENCY_TENTS',
      'POWER_GENERATORS',
      'BLANKETS'
    ];

    const gaps: ResourceGapSummaryModel[] = resourceTypes.map(rt => {
      const reqTotal = requests
        .filter(r => r.resourceType === rt)
        .reduce((sum, r) => sum + Math.max(0, r.quantityRequested - r.quantityFulfilled), 0);

      const stockTotal = stocks
        .filter(s => s.resourceType === rt)
        .reduce((sum, s) => sum + Math.max(0, s.availableQuantity - s.reservedQuantity), 0);

      const deficit = Math.max(0, reqTotal - stockTotal);
      const surplus = Math.max(0, stockTotal - reqTotal);

      let severity: 'CRITICAL_DEFICIT' | 'MODERATE_DEFICIT' | 'SURPLUS' = 'SURPLUS';
      if (deficit > 30) severity = 'CRITICAL_DEFICIT';
      else if (deficit > 0) severity = 'MODERATE_DEFICIT';

      const meta = RESOURCE_TYPE_LABELS[rt];

      return {
        resourceType: rt,
        resourceName: meta.name,
        unit: meta.unit,
        totalRequested: reqTotal,
        totalAvailableStock: stockTotal,
        deficitGap: deficit,
        surplus: surplus,
        statusSeverity: severity,
      };
    });

    const totalPending = requests.filter(r => r.quantityFulfilled < r.quantityRequested).length;
    const criticalCount = requests.filter(r => r.priority === 'CRITICAL' && r.quantityFulfilled < r.quantityRequested).length;
    const totalAvailable = stocks.reduce((sum, s) => sum + s.availableQuantity, 0);
    const inTransitCount = allocations.filter(a => a.status === 'IN_TRANSIT').length;

    this.logHttp('GET', '/api/v1/dashboard/gaps', 200, 'OK', null, { totalPending, gapsCount: gaps.length });

    return {
      gaps,
      totalPending,
      criticalCount,
      totalAvailable,
      inTransitCount,
    };
  }

  public runAutoAllocation(): DispatchAllocationModel[] {
    const requests = [...this.getRequests()];
    const stocks = [...this.getStocks()];
    const allocations = this.getAllocations();

    // Sort requests by priority (CRITICAL -> HIGH -> MEDIUM -> LOW)
    const priorityWeight: Record<PriorityEnum, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };
    requests.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    const newAllocations: DispatchAllocationModel[] = [];

    for (const req of requests) {
      let needed = req.quantityRequested - req.quantityFulfilled;
      if (needed <= 0) continue;

      for (const st of stocks) {
        const usable = st.availableQuantity - st.reservedQuantity;
        if (st.resourceType === req.resourceType && usable > 0) {
          const allocQty = Math.min(needed, usable);
          st.reservedQuantity += allocQty;
          req.quantityFulfilled += allocQty;

          const alloc: DispatchAllocationModel = {
            id: 'alloc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            requestId: req.id,
            locationName: req.locationName,
            warehouseName: st.warehouseName,
            resourceType: req.resourceType,
            allocatedQuantity: allocQty,
            status: 'SUGGESTED',
            transportLeadTimeHours: parseFloat((1.5 + Math.random() * 1.5).toFixed(1)),
            fleetIdentifier: 'CONVOY-RELIEF-' + (100 + allocations.length + newAllocations.length + 1),
            allocatedAt: new Date().toISOString(),
          };

          newAllocations.push(alloc);
          needed -= allocQty;
          if (needed <= 0) break;
        }
      }
    }

    const updatedAllocations = [...newAllocations, ...allocations];
    localStorage.setItem(RELIEF_REQUESTS_KEY, JSON.stringify(requests));
    localStorage.setItem(WAREHOUSE_STOCKS_KEY, JSON.stringify(stocks));
    localStorage.setItem(ALLOCATIONS_KEY, JSON.stringify(updatedAllocations));

    this.logHttp('POST', '/api/v1/dashboard/calculate-allocations', 200, 'OK', null, { created: newAllocations.length });
    return newAllocations;
  }

  public updateAllocationStatus(id: string, newStatus: AllocationStatusEnum): DispatchAllocationModel {
    const allocations = this.getAllocations();
    const target = allocations.find(a => a.id === id);
    if (!target) {
      this.logHttp('PATCH', `/api/v1/dashboard/allocations/${id}/status`, 404, 'Not Found');
      throw new Error('Allocation not found');
    }

    target.status = newStatus;
    localStorage.setItem(ALLOCATIONS_KEY, JSON.stringify(allocations));
    this.logHttp('PATCH', `/api/v1/dashboard/allocations/${id}/status`, 200, 'OK', { newStatus }, target);
    return target;
  }
}

export const reliefService = new DisasterReliefService();
