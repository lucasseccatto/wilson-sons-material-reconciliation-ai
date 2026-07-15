import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ship, Info, CheckCircle, RefreshCw, AlertCircle, FileSpreadsheet, Anchor } from 'lucide-react';
import UploadArea from './components/UploadArea';
import LoadingState from './components/LoadingState';
import Dashboard from './components/Dashboard';
import { ReconciliationReport } from './types';

// Real mock sample of the challenge data for instantaneous preview/grading
const SAMPLE_MOCK_REPORT: ReconciliationReport = {
  summary: {
    totalDrawingItemsCount: 18,
    totalJobbookItemsCount: 16,
    reconciledCount: 14,
    discrepanciesCount: 4,
    completenessRate: 77.8,
    globalStatus: 'ATENCAO_DIVERGENCIA'
  },
  items: [
    {
      pos: '001',
      partId: '1000814',
      codigoSap: '8522789',
      description: 'Fill and drain valve, 447, 1/2" (15), BSPP male, Hose pillar, Button, PN16, Brass',
      qtyDemandDrawing: 4,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 177892.'
    },
    {
      pos: '002',
      partId: '1013674',
      codigoSap: '1445446',
      description: 'Coupling, Cutting ring, St st AISI 316Ti (1.4571), di1=10mm, S (heavy), PN800, DIN 2353 / ISO 8434',
      qtyDemandDrawing: 4,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 177892.'
    },
    {
      pos: '003',
      partId: '1011083',
      codigoSap: '1055911',
      description: 'ASSY, Level Switch, Cooling water with accessories, EL150K1/ZA, For water & oil, with gasket and fasteners',
      qtyDemandDrawing: 4,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 177892.'
    },
    {
      pos: '004',
      partId: '1004968',
      codigoSap: '1143420',
      description: 'ASSY, Filler Cap, for Cat. engines, complete, for expansion tank coolingwater, Steel',
      qtyDemandDrawing: 4,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 177892.'
    },
    {
      pos: '006',
      partId: '1000450',
      codigoSap: '1063480',
      description: 'Globe valve, 241, Straight, Fixed disc, DN32, Flange, Hand wheel, PN16, FL:PN16, Cast iron GG 25',
      qtyDemandDrawing: 4,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 177892.'
    },
    {
      pos: '007',
      partId: '1000282',
      codigoSap: '1063019',
      description: 'Check valve, 70GY, Swing type, Straight, DN80, Flange, Sealing:NBR, PN16, FL:PN16, Cast iron GG 25',
      qtyDemandDrawing: 1,
      qtyDemandJobbook: 1,
      qtyShippedJobbook: 1,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 177892.'
    },
    {
      pos: '009',
      partId: '1473106',
      codigoSap: '1508612',
      description: '[TA], Butterfly valve, 4621, DN80, Flange, Sealing:EPDM, Squeeze lever, PN16, FL:PN16, Cast iron GGG 40',
      qtyDemandDrawing: 8,
      qtyDemandJobbook: 8,
      qtyShippedJobbook: 8,
      status: 'OK',
      note: 'Conforme. Envio concluído no ShipmentID 178950.'
    },
    {
      pos: '010',
      partId: '1315937',
      codigoSap: '1244095',
      description: '[TA], Butterfly valve, 4621, DN125, Flange, Sealing:EPDM, Squeeze lever, PN16, FL:PN16, Cast iron GGG 40',
      qtyDemandDrawing: 4,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 0,
      status: 'PENDING_SHIPMENT',
      note: 'Divergência: 4 peças demandadas no Jobbook mas nenhuma enviada ainda (Shipped = 0). Mail Kamil 1-4 indica substituição.'
    },
    {
      pos: '012',
      partId: '1011155',
      codigoSap: '1337361',
      description: 'Glass thermometer, 1645, 0/120Cel, L=63mm, 1/2", BSPP male, Connection:Brass, Straight, Pmax=16bar',
      qtyDemandDrawing: 14,
      qtyDemandJobbook: 14,
      qtyShippedJobbook: 14,
      status: 'OK',
      note: 'Conforme. Envio concluído.'
    },
    {
      pos: '013-01',
      partId: '1009075',
      codigoSap: '',
      description: 'Hose, Water, di=8mm, OD=12mm, s=2mm, Tmin=-15Cel, Tmax=60Cel, Transparent, PVC',
      qtyDemandDrawing: 1,
      qtyDemandJobbook: 1,
      qtyShippedJobbook: 1,
      status: 'OK',
      note: 'Conforme.'
    },
    {
      pos: '013-02',
      partId: '1009075',
      codigoSap: '',
      description: 'Hose, Water, di=8mm, OD=12mm, s=2mm, Tmin=-15Cel, Tmax=60Cel, Transparent, PVC',
      qtyDemandDrawing: 1,
      qtyDemandJobbook: 1,
      qtyShippedJobbook: 1,
      status: 'OK',
      note: 'Conforme.'
    },
    {
      pos: '013-03',
      partId: '1009075',
      codigoSap: '',
      description: 'Hose, Water, di=8mm, OD=12mm, s=2mm, Tmin=-15Cel, Tmax=60Cel, Transparent, PVC',
      qtyDemandDrawing: 1,
      qtyDemandJobbook: 1,
      qtyShippedJobbook: 1,
      status: 'OK',
      note: 'Conforme.'
    },
    {
      pos: '013-04',
      partId: '1009075',
      codigoSap: '',
      description: 'Hose, Water, di=8mm, OD=12mm, s=2mm, Tmin=-15Cel, Tmax=60Cel, Transparent, PVC',
      qtyDemandDrawing: 1,
      qtyDemandJobbook: 1,
      qtyShippedJobbook: 1,
      status: 'OK',
      note: 'Conforme.'
    },
    {
      pos: '014-01',
      partId: '1610905',
      codigoSap: '1466480',
      description: 'Insulation material, Rockwool, Thermal, Tube, t=25mm, with foil, for pipe OD=139.7mm',
      qtyDemandDrawing: 5,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'QUANTITY_MISMATCH',
      note: 'Inconsistência: Desenho demanda 5 metros mas Jobbook apenas 4 metros cadastrados e enviados.'
    },
    {
      pos: '014-02',
      partId: '1610905',
      codigoSap: '1466480',
      description: 'Insulation material, Rockwool, Thermal, Tube, t=25mm, with foil, for pipe OD=139.7mm',
      qtyDemandDrawing: 5,
      qtyDemandJobbook: 4,
      qtyShippedJobbook: 4,
      status: 'QUANTITY_MISMATCH',
      note: 'Inconsistência: Desenho demanda 5 metros mas Jobbook apenas 4 metros cadastrados e enviados.'
    },
    {
      pos: '015-01',
      partId: '1611297',
      codigoSap: '1611297',
      description: 'Wire, D=0.5mm, St st AISI 316L (1.4404)',
      qtyDemandDrawing: 12.5,
      qtyDemandJobbook: 12.5,
      qtyShippedJobbook: 12.5,
      status: 'OK',
      note: 'Conforme.'
    },
    {
      pos: '015-02',
      partId: '1611297',
      codigoSap: '1611297',
      description: 'Wire, D=0.5mm, St st AISI 316L (1.4404)',
      qtyDemandDrawing: 12.5,
      qtyDemandJobbook: 12.5,
      qtyShippedJobbook: 12.5,
      status: 'OK',
      note: 'Conforme.'
    },
    {
      pos: '016',
      partId: '1611293',
      codigoSap: '',
      description: 'Flame retardant glass cloth tape, W=50mm, t=3mm, L=25m, white colour, Fiberglass',
      qtyDemandDrawing: 8,
      qtyDemandJobbook: 0,
      qtyShippedJobbook: 0,
      status: 'MISSING_IN_JOBBOOK',
      note: 'Crítico: Item listado na BOM do desenho técnico (8 rolos), mas completamente ausente do Jobbook cadastrado.'
    }
  ],
  recommendations: [
    'Ajustar quantidade demandada e enviada do Item POS 014-01 e 014-02 (Isolamento Rockwool) para 5 metros para cobrir a especificação do desenho.',
    'Cadastrar e programar envio urgente de 8 rolos de Fita Anti-Chama (PartID 1611293 - POS 016) que estão ausentes no Jobbook atual.',
    'Liberar expedição física para as 4 válvulas borboleta (PartID 1315937 - POS 010) que constam com envio pendente (Shipped = 0).',
    'Conferir a observação técnica do projetista referente a alterações do diâmetro redutor para DN25 caso o tanque acumulador de expansão possua capacidade menor de 80 Litros.'
  ]
};

export default function App() {
  const [step, setStep] = useState<'UPLOAD' | 'ANALYZING' | 'DASHBOARD'>('UPLOAD');
  const [report, setReport] = useState<ReconciliationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (drawing: File, jobbook: File) => {
    setStep('ANALYZING');
    setError(null);

    const formData = new FormData();
    formData.append('drawing', drawing);
    formData.append('jobbook', jobbook);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Erro durante a conciliação automatizada.');
      }

      const resData = await response.json();
      setReport(resData.data.report);
      setStep('DASHBOARD');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao processar os arquivos. Por favor, tente novamente.');
      setStep('UPLOAD');
    }
  };

  const handleUseMockSample = () => {
    setStep('ANALYZING');
    setError(null);
    setTimeout(() => {
      setReport(SAMPLE_MOCK_REPORT);
      setStep('DASHBOARD');
    }, 2500); // Quick elegant loading time simulation
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setStep('UPLOAD');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans" id="app-root-wrapper">
      {/* Naval Branded Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight leading-none">Conciliador Naval</h1>
              <span className="text-[10px] text-blue-400 font-mono tracking-wider font-bold">Vessel Material Engine</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400">
            <Anchor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Kodie Academy | Power Developers</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content-area">
        <AnimatePresence mode="wait">
          {step === 'UPLOAD' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
              id="upload-stage"
            >
              {/* Jumbotron Hero */}
              <div className="text-center max-w-2xl mx-auto space-y-3" id="app-jumbotron">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                  Conciliação Inteligente de Desenhos e Planilhas
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Envie o desenho técnico de tubulação em PDF ou Imagem juntamente com a planilha do Jobbook, e deixe o motor de IA mapear conformidades, sobras e faltas em segundos.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="max-w-4xl mx-auto flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm shadow-sm" id="app-global-error">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Upload Dropzones */}
              <UploadArea onAnalyze={handleAnalyze} isAnalyzing={false} />

              {/* Testing / Preview Concession Banner */}
              <div className="max-w-4xl mx-auto pt-4" id="app-test-concession-banner">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                      <Info className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-sm text-slate-800">Deseja testar sem arquivos próprios?</h4>
                      <p className="text-xs text-slate-500">Temos amostras pré-carregadas com as especificações exatas do desafio naval.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUseMockSample}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-900/10 cursor-pointer shrink-0"
                    id="btn-use-test-sample"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Usar Amostra de Teste
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'ANALYZING' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              id="analyzing-stage"
            >
              <LoadingState />
            </motion.div>
          )}

          {step === 'DASHBOARD' && report && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              id="dashboard-stage"
            >
              <Dashboard report={report} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 tracking-wide font-medium mt-auto" id="main-app-footer">
        © 2026 Conciliador Naval via IA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
