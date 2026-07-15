import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { FileText, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface UploadAreaProps {
  onAnalyze: (drawing: File, jobbook: File) => void;
  isAnalyzing: boolean;
}

export default function UploadArea({ onAnalyze, isAnalyzing }: UploadAreaProps) {
  const [drawing, setDrawing] = useState<File | null>(null);
  const [jobbook, setJobbook] = useState<File | null>(null);
  const [isDrawingOver, setIsDrawingOver] = useState(false);
  const [isJobbookOver, setIsJobbookOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawingInputRef = useRef<HTMLInputElement>(null);
  const jobbookInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetDrawing = (file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('O desenho técnico deve ser um arquivo PDF ou uma Imagem (PNG/JPG).');
      return;
    }
    setDrawing(file);
  };

  const validateAndSetJobbook = (file: File) => {
    setError(null);
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    if (!isValidExtension) {
      setError('O Jobbook deve ser uma planilha Excel (.xlsx, .xls).');
      return;
    }
    setJobbook(file);
  };

  // Drag handlers for Drawing
  const handleDrawingDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrawingOver(true);
  };

  const handleDrawingDragLeave = () => {
    setIsDrawingOver(false);
  };

  const handleDrawingDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrawingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetDrawing(e.dataTransfer.files[0]);
    }
  };

  // Drag handlers for Jobbook
  const handleJobbookDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsJobbookOver(true);
  };

  const handleJobbookDragLeave = () => {
    setIsJobbookOver(false);
  };

  const handleJobbookDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsJobbookOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetJobbook(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (drawing && jobbook) {
      onAnalyze(drawing, jobbook);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="upload-area-container">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm"
          id="upload-error-banner"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drawing Upload Card */}
        <div
          onDragOver={handleDrawingDragOver}
          onDragLeave={handleDrawingDragLeave}
          onDrop={handleDrawingDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
            drawing
              ? 'border-emerald-300 bg-emerald-50/20'
              : isDrawingOver
              ? 'border-blue-500 bg-blue-50/40 scale-[1.01]'
              : 'border-slate-300 hover:border-slate-400 bg-white hover:shadow-md'
          }`}
          onClick={() => drawingInputRef.current?.click()}
          id="drawing-dropzone"
        >
          <input
            type="file"
            ref={drawingInputRef}
            onChange={(e) => e.target.files?.[0] && validateAndSetDrawing(e.target.files[0])}
            accept=".pdf,image/*"
            className="hidden"
          />

          <div className="mb-4 p-4 rounded-full bg-slate-50 text-slate-600 transition-colors">
            {drawing ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            ) : (
              <FileText className={`w-10 h-10 ${isDrawingOver ? 'text-blue-500' : 'text-slate-400'}`} />
            )}
          </div>

          <h3 className="font-semibold text-slate-800 text-base mb-1">
            {drawing ? 'Desenho Técnico Carregado' : 'Desenho Técnico (P&ID)'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-4">
            {drawing ? drawing.name : 'Arraste e solte o arquivo PDF ou Imagem, ou clique para explorar.'}
          </p>

          {drawing && (
            <span className="text-[11px] font-mono bg-emerald-100/50 text-emerald-800 px-2.5 py-1 rounded-full">
              {(drawing.size / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>

        {/* Jobbook Upload Card */}
        <div
          onDragOver={handleJobbookDragOver}
          onDragLeave={handleJobbookDragLeave}
          onDrop={handleJobbookDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
            jobbook
              ? 'border-emerald-300 bg-emerald-50/20'
              : isJobbookOver
              ? 'border-blue-500 bg-blue-50/40 scale-[1.01]'
              : 'border-slate-300 hover:border-slate-400 bg-white hover:shadow-md'
          }`}
          onClick={() => jobbookInputRef.current?.click()}
          id="jobbook-dropzone"
        >
          <input
            type="file"
            ref={jobbookInputRef}
            onChange={(e) => e.target.files?.[0] && validateAndSetJobbook(e.target.files[0])}
            accept=".xlsx,.xls"
            className="hidden"
          />

          <div className="mb-4 p-4 rounded-full bg-slate-50 text-slate-600 transition-colors">
            {jobbook ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            ) : (
              <FileSpreadsheet className={`w-10 h-10 ${isJobbookOver ? 'text-blue-500' : 'text-slate-400'}`} />
            )}
          </div>

          <h3 className="font-semibold text-slate-800 text-base mb-1">
            {jobbook ? 'Jobbook Carregado' : 'Planilha Jobbook'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-4">
            {jobbook ? jobbook.name : 'Arraste e solte a planilha Excel (.xlsx), ou clique para explorar.'}
          </p>

          {jobbook && (
            <span className="text-[11px] font-mono bg-emerald-100/50 text-emerald-800 px-2.5 py-1 rounded-full">
              {(jobbook.size / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4" id="upload-action-bar">
        <motion.button
          whileHover={{ scale: drawing && jobbook ? 1.02 : 1 }}
          whileTap={{ scale: drawing && jobbook ? 0.98 : 1 }}
          onClick={handleAnalyzeClick}
          disabled={!drawing || !jobbook || isAnalyzing}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white transition-all duration-300 shadow-md ${
            drawing && jobbook && !isAnalyzing
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-500/20'
              : 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
          }`}
          id="btn-trigger-reconciliation"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analisando e Conciliando...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              <span>Iniciar Conciliação via IA</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
