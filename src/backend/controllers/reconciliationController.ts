import { Request, Response, NextFunction } from 'express';
import { ExcelService } from '../services/excelService';
import { AnalysisService, ReconciliationReport } from '../services/analysisService';
import { AppError } from '../utils/errorHandler';

// Simple in-memory storage for the latest report
let latestReport: ReconciliationReport | null = null;

export class ReconciliationController {
  /**
   * Endpoint to parse the uploaded Jobbook (Excel) file and return structured records.
   * POST /api/upload
   */
  public static async uploadJobbook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('Nenhum arquivo enviado. Por favor, envie a planilha do Jobbook (.xlsx, .xls).', 400);
      }

      const rows = ExcelService.parseJobbook(req.file.buffer);

      res.status(200).json({
        status: 'success',
        results: rows.length,
        data: {
          rows
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint to execute multimodal AI reconciliation.
   * POST /api/analyze
   */
  public static async analyzeReconciliation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || !files.drawing || !files.drawing[0]) {
        throw new AppError('O desenho técnico (.pdf, .png, .jpg) é obrigatório para a análise.', 400);
      }

      if (!files.jobbook || !files.jobbook[0]) {
        throw new AppError('A planilha do Jobbook (.xlsx) é obrigatória para a análise.', 400);
      }

      const drawingFile = files.drawing[0];
      const jobbookFile = files.jobbook[0];

      // Step 1: Parse the Excel Jobbook rows first in Node
      const parsedJobbookRows = ExcelService.parseJobbook(jobbookFile.buffer);

      if (parsedJobbookRows.length === 0) {
        throw new AppError('Nenhum registro válido foi encontrado na planilha do Jobbook enviada.', 400);
      }

      // Step 2: Use Gemini vision/doc model to extract drawing items and reconcile them
      const report = await AnalysisService.reconcile(
        drawingFile.buffer,
        drawingFile.mimetype,
        parsedJobbookRows
      );

      // Save in our in-memory store for subsequent report retrievals
      latestReport = report;

      res.status(200).json({
        status: 'success',
        data: {
          report
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint to retrieve the latest reconciliation report.
   * GET /api/report
   */
  public static async getLatestReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!latestReport) {
        res.status(200).json({
          status: 'success',
          message: 'Nenhum relatório gerado ainda. Por favor, execute uma análise de reconciliação primeiro.',
          data: {
            report: null
          }
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          report: latestReport
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
