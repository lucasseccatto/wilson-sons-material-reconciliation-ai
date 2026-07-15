export interface JobbookRow {
  projectId: string;
  functionCode: string;
  functionDescription: string;
  partId: string;
  codigoSap: string;
  qtyDemand: number;
  qtyShipped: number;
  uom: string;
  shipmentId: string;
  shipmentStatus: string;
  note: string;
  drawingNo: string;
  pos: string;
  itemId: string;
  itemCollectedIn: string;
  supplierPartNumber: string;
  shipmentTransportCode: string;
  shipmentTransportNumber: string;
}

export interface ReconciliationSummary {
  totalDrawingItemsCount: number;
  totalJobbookItemsCount: number;
  reconciledCount: number;
  discrepanciesCount: number;
  completenessRate: number;
  globalStatus: string;
}

export type ItemStatus = 'OK' | 'QUANTITY_MISMATCH' | 'MISSING_IN_JOBBOOK' | 'PENDING_SHIPMENT' | 'UNEXPECTED_ITEM';

export interface ReconciledItem {
  pos: string;
  partId: string;
  codigoSap: string;
  description: string;
  qtyDemandDrawing: number;
  qtyDemandJobbook: number;
  qtyShippedJobbook: number;
  status: ItemStatus;
  note: string;
}

export interface ReconciliationReport {
  summary: ReconciliationSummary;
  items: ReconciledItem[];
  recommendations: string[];
}
