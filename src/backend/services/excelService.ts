import * as xlsx from 'xlsx';

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

export class ExcelService {
  /**
   * Parses an Excel buffer into standardized JobbookRow records.
   */
  public static parseJobbook(buffer: Buffer): JobbookRow[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('Nenhuma planilha encontrada no arquivo Excel enviado.');
    }

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error('Planilha inválida.');
    }

    // Convert to JSON with raw headers
    const rawRows = xlsx.utils.sheet_to_json<any>(sheet, { defval: '' });

    return rawRows.map((row) => {
      // Flexible key matcher to handle case variations and accents
      const getVal = (possibleKeys: string[]): string => {
        for (const key of possibleKeys) {
          const foundKey = Object.keys(row).find(
            (k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, '')
          );
          if (foundKey) return String(row[foundKey]).trim();
        }
        return '';
      };

      const getNum = (possibleKeys: string[]): number => {
        const val = getVal(possibleKeys);
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      return {
        projectId: getVal(['ProjectID', 'Project ID', 'ProjetoId', 'Projeto ID']),
        functionCode: getVal(['FunctionCode', 'Function Code', 'CodigoFuncao', 'FuncaoCodigo']),
        functionDescription: getVal(['FunctionDescription', 'Function Description', 'DescricaoFuncao', 'Descricao']),
        partId: getVal(['PartID', 'Part ID', 'PecaId', 'PartNumber', 'Peca ID']),
        codigoSap: getVal(['Codigo Sap', 'CodigoSap', 'SAPCode', 'SAP Code', 'Codigo_Sap']),
        qtyDemand: getNum(['QtyDemand', 'Qty Demand', 'QtdDemanda', 'Qtd Demandada', 'Demand', 'QuantidadeDemandada']),
        qtyShipped: getNum(['QtyShipped', 'Qty Shipped', 'QtdEnviada', 'Qtd Enviada', 'Shipped', 'QuantidadeEnviada']),
        uom: getVal(['UoM', 'UOM', 'Unidade', 'Unit', 'UnidadeMedida']),
        shipmentId: getVal(['ShipmentID', 'Shipment ID', 'EnvioId', 'Shipment ID']),
        shipmentStatus: getVal(['ShipmentStatus', 'Shipment Status', 'StatusEnvio', 'Status']),
        note: getVal(['Note', 'Notas', 'Observacao', 'Note', 'Observacoes']),
        drawingNo: getVal(['DrawingNo', 'Drawing No', 'DesenhoNo', 'Desenho Numero', 'Drawing_No']),
        pos: getVal(['Pos', 'POS', 'Posicao', 'PosicaoDesenho']),
        itemId: getVal(['ItemID', 'Item ID', 'Item_Id', 'ItemId']),
        itemCollectedIn: getVal(['ItemCollectedIn', 'Item Collected In', 'ItemColetadoEm']),
        supplierPartNumber: getVal(['SupplierPartNumber', 'Supplier Part Number', 'PecaFornecedor', 'SupplierPartNo']),
        shipmentTransportCode: getVal(['ShipmentTransportCode', 'Shipment Transport Code', 'TransporteCodigo']),
        shipmentTransportNumber: getVal(['ShipmentTransportNumber', 'Shipment Transport Number', 'TransporteNumero'])
      };
    });
  }
}
