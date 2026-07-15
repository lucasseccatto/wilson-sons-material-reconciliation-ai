import { getGeminiClient } from '../config/gemini';
import { JobbookRow } from './excelService';

export interface ReconciliationSummary {
  totalDrawingItemsCount: number;
  totalJobbookItemsCount: number;
  reconciledCount: number;
  discrepanciesCount: number;
  completenessRate: number;
  globalStatus: string;
}

export interface ReconciledItem {
  pos: string;
  partId: string;
  codigoSap: string;
  description: string;
  qtyDemandDrawing: number;
  qtyDemandJobbook: number;
  qtyShippedJobbook: number;
  status: 'OK' | 'QUANTITY_MISMATCH' | 'MISSING_IN_JOBBOOK' | 'PENDING_SHIPMENT' | 'UNEXPECTED_ITEM';
  note: string;
}

export interface ReconciliationReport {
  summary: ReconciliationSummary;
  items: ReconciledItem[];
  recommendations: string[];
}

export class AnalysisService {
  /**
   * Executes AI reconciliation between the uploaded drawing and the parsed Jobbook rows.
   */
  public static async reconcile(
    drawingBuffer: Buffer,
    drawingMimeType: string,
    jobbookData: JobbookRow[]
  ): Promise<ReconciliationReport> {
    const ai = getGeminiClient();

    // Prepare Jobbook dataset for prompt context
    const jobbookJsonString = JSON.stringify(jobbookData, null, 2);

    // Convert Drawing file to base64
    const drawingBase64 = drawingBuffer.toString('base64');

    const prompt = `
Você é um Engenheiro Full Stack Sênior e Especialista de Controle de Materiais de Tubulação Naval.
Sua tarefa é analisar o desenho técnico anexado (PDF ou imagem contendo fluxogramas P&ID e listas de materiais/BOM) e reconciliá-lo detalhadamente com a lista do Jobbook (registros JSON fornecidos abaixo).

### INSTRUÇÕES DE RECONCILIAÇÃO:
1. Extraia todos os itens de materiais especificados no desenho técnico (especialmente a tabela de lista de materiais/BOM, frequentemente localizada nas margens ou em páginas dedicadas do desenho).
2. Para cada item encontrado no desenho, tente localizá-lo no Jobbook fornecido abaixo. O cruzamento deve ser feito de forma inteligente, usando o "PartID" (ou Part ID/Part No), "Pos" (ou POS/Posição no desenho como bolhas/marcações) e Código SAP se disponível.
3. Classifique cada item reconciliado em um dos seguintes status:
   - 'OK': Item presente em ambos, quantidades batem e ShipmentStatus está 'Closed'.
   - 'QUANTITY_MISMATCH': O item está em ambos, mas a quantidade demandada no desenho difere da quantidade demandada ou enviada no Jobbook.
   - 'MISSING_IN_JOBBOOK': O item existe na lista do desenho, mas não consta na lista do Jobbook.
   - 'PENDING_SHIPMENT': O item está no Jobbook com ShipmentStatus diferente de 'Closed' ou QtyShipped < QtyDemand.
   - 'UNEXPECTED_ITEM': O item está listado no Jobbook mas não pertence ao desenho ou disciplina em questão.

4. Calcule os indicadores do resumo de reconciliação:
   - 'totalDrawingItemsCount': Total de itens extraídos do desenho técnico.
   - 'totalJobbookItemsCount': Total de registros correspondentes do Jobbook.
   - 'reconciledCount': Quantidade de itens que foram casados com sucesso e estão 100% corretos ('OK').
   - 'discrepanciesCount': Quantidade de itens com discrepâncias ('QUANTITY_MISMATCH', 'MISSING_IN_JOBBOOK', etc).
   - 'completenessRate': Porcentagem de conclusão da reconciliação (itens com status 'OK' dividido pelo total de itens do desenho * 100).
   - 'globalStatus': Indicação do nível de atenção (ex: 'SUCESSO_COMPLETO', 'ATENCAO_REQUERIDA', 'CRITICO_PENDENCIAS_GRAVES').

5. Forneça recomendações práticas em texto claro sobre quais ações corretivas o projetista ou a equipe de suprimentos deve tomar.

### REGISTROS DO JOBBOOK (JSON):
\`\`\`json
${jobbookJsonString}
\`\`\`

Por favor, retorne a resposta estritamente estruturada em JSON correspondente ao esquema fornecido.
`;

    const reconciliationSchema = {
      type: 'OBJECT',
      properties: {
        summary: {
          type: 'OBJECT',
          properties: {
            totalDrawingItemsCount: { type: 'INTEGER' },
            totalJobbookItemsCount: { type: 'INTEGER' },
            reconciledCount: { type: 'INTEGER' },
            discrepanciesCount: { type: 'INTEGER' },
            completenessRate: { type: 'NUMBER' },
            globalStatus: { type: 'STRING' }
          },
          required: [
            'totalDrawingItemsCount',
            'totalJobbookItemsCount',
            'reconciledCount',
            'discrepanciesCount',
            'completenessRate',
            'globalStatus'
          ]
        },
        items: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              pos: { type: 'STRING' },
              partId: { type: 'STRING' },
              codigoSap: { type: 'STRING' },
              description: { type: 'STRING' },
              qtyDemandDrawing: { type: 'INTEGER' },
              qtyDemandJobbook: { type: 'INTEGER' },
              qtyShippedJobbook: { type: 'INTEGER' },
              status: {
                type: 'STRING',
                enum: ['OK', 'QUANTITY_MISMATCH', 'MISSING_IN_JOBBOOK', 'PENDING_SHIPMENT', 'UNEXPECTED_ITEM']
              },
              note: { type: 'STRING' }
            },
            required: [
              'pos',
              'partId',
              'codigoSap',
              'description',
              'qtyDemandDrawing',
              'qtyDemandJobbook',
              'qtyShippedJobbook',
              'status',
              'note'
            ]
          }
        },
        recommendations: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        }
      },
      required: ['summary', 'items', 'recommendations']
    };

    // Custom Timeout wrapper of 55 seconds to prevent gateway/proxy timeouts
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('O motor de Inteligência Artificial do Google Gemini excedeu o tempo limite de 55 segundos. Por favor, tente novamente com um documento menor ou menos denso.'));
      }, 55000);
    });

    try {
      // Make multimodal request to Gemini 2.5 Flash as recommended, raced with timeout
      const apiCallPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: drawingMimeType,
                  data: drawingBase64
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: reconciliationSchema as any,
          temperature: 0.1 // lower temperature for precise, deterministic extraction
        }
      });

      const response = await Promise.race([apiCallPromise, timeoutPromise]);

      const responseText = response.text;
      if (!responseText) {
        throw new Error('O motor de IA respondeu com um conteúdo vazio.');
      }

      const parsedReport = JSON.parse(responseText) as ReconciliationReport;

      // Strict validation of the returned structure to ensure all keys are correctly populated
      if (!parsedReport || typeof parsedReport !== 'object') {
        throw new Error('A resposta decodificada não é um objeto válido.');
      }

      if (!parsedReport.summary || typeof parsedReport.summary !== 'object') {
        parsedReport.summary = {
          totalDrawingItemsCount: 0,
          totalJobbookItemsCount: jobbookData.length,
          reconciledCount: 0,
          discrepanciesCount: 0,
          completenessRate: 0,
          globalStatus: 'ERRO_DE_ANALISE'
        };
      }

      if (!Array.isArray(parsedReport.items)) {
        parsedReport.items = [];
      }

      if (!Array.isArray(parsedReport.recommendations)) {
        parsedReport.recommendations = [
          'A análise automatizada não gerou recomendações específicas. Revise as discrepâncias da tabela manualmente.'
        ];
      }

      // Ensure primitive typings to prevent front-end render/UI breakage
      parsedReport.summary.totalDrawingItemsCount = Number(parsedReport.summary.totalDrawingItemsCount) || 0;
      parsedReport.summary.totalJobbookItemsCount = Number(parsedReport.summary.totalJobbookItemsCount) || 0;
      parsedReport.summary.reconciledCount = Number(parsedReport.summary.reconciledCount) || 0;
      parsedReport.summary.discrepanciesCount = Number(parsedReport.summary.discrepanciesCount) || 0;
      parsedReport.summary.completenessRate = Number(parsedReport.summary.completenessRate) || 0;
      parsedReport.summary.globalStatus = String(parsedReport.summary.globalStatus || 'ATENCAO_REQUERIDA');

      parsedReport.items = parsedReport.items.map((item: any) => ({
        pos: String(item.pos || ''),
        partId: String(item.partId || ''),
        codigoSap: String(item.codigoSap || ''),
        description: String(item.description || ''),
        qtyDemandDrawing: Number(item.qtyDemandDrawing) || 0,
        qtyDemandJobbook: Number(item.qtyDemandJobbook) || 0,
        qtyShippedJobbook: Number(item.qtyShippedJobbook) || 0,
        status: (['OK', 'QUANTITY_MISMATCH', 'MISSING_IN_JOBBOOK', 'PENDING_SHIPMENT', 'UNEXPECTED_ITEM'].includes(item.status) 
          ? item.status 
          : 'QUANTITY_MISMATCH') as any,
        note: String(item.note || '')
      }));

      parsedReport.recommendations = parsedReport.recommendations.map(r => String(recSafeTruncate(r)));

      return parsedReport;
    } catch (error: any) {
      console.error('Error during AI Reconciliation:', error);
      throw new Error(`Falha na integração com IA: ${error.message || error}`);
    }
  }
}

function recSafeTruncate(str: string): string {
  if (!str) return '';
  return str.length > 500 ? str.slice(0, 497) + '...' : str;
}
