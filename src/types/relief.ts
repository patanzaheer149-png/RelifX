export type ResourceTypeEnum = 
  | 'POTABLE_WATER' 
  | 'TRAUMA_MEDICAL_KITS' 
  | 'FOOD_RATIONS' 
  | 'EMERGENCY_TENTS' 
  | 'POWER_GENERATORS' 
  | 'BLANKETS';

export type PriorityEnum = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AllocationStatusEnum = 'SUGGESTED' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED';

export interface AffectedLocationModel {
  id: string;
  name: string;
  region: string;
  displacedPopulation: number;
  emergencyContact: string;
}

export interface ResourceRequestModel {
  id: string;
  locationName: string;
  region: string;
  resourceType: ResourceTypeEnum;
  quantityRequested: number;
  quantityFulfilled: number;
  priority: PriorityEnum;
  notes?: string;
  isMainAgendaFocus: boolean;
  createdAt: string;
}

export interface WarehouseStockModel {
  id: string;
  warehouseName: string;
  warehouseLocation: string;
  resourceType: ResourceTypeEnum;
  availableQuantity: number;
  reservedQuantity: number;
  lastUpdated: string;
}

export interface DispatchAllocationModel {
  id: string;
  requestId: string;
  locationName: string;
  warehouseName: string;
  resourceType: ResourceTypeEnum;
  allocatedQuantity: number;
  status: AllocationStatusEnum;
  transportLeadTimeHours: number;
  fleetIdentifier: string;
  allocatedAt: string;
}

export interface ResourceGapSummaryModel {
  resourceType: ResourceTypeEnum;
  resourceName: string;
  unit: string;
  totalRequested: number;
  totalAvailableStock: number;
  deficitGap: number;
  surplus: number;
  statusSeverity: 'CRITICAL_DEFICIT' | 'MODERATE_DEFICIT' | 'SURPLUS';
}

export const RESOURCE_TYPE_LABELS: Record<ResourceTypeEnum, { name: string; unit: string; icon: string }> = {
  POTABLE_WATER: { name: 'Clean Potable Water', unit: 'Pallets', icon: 'Droplets' },
  TRAUMA_MEDICAL_KITS: { name: 'Trauma & Medical Kits', unit: 'Kits', icon: 'HeartPulse' },
  FOOD_RATIONS: { name: 'Emergency Food Rations', unit: 'Boxes', icon: 'Utensils' },
  EMERGENCY_TENTS: { name: 'Shelter Tents', unit: 'Tents', icon: 'Home' },
  POWER_GENERATORS: { name: 'Diesel Generators', unit: 'Units', icon: 'Zap' },
  BLANKETS: { name: 'Thermal Blankets', unit: 'Pieces', icon: 'Shield' },
};
