import { ReconciliationReport } from '../types';
import ReconciliationTable from './ReconciliationTable';
import { motion } from 'motion/react';
import { FileDown, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, HardHat, FileText, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  report: ReconciliationReport;
  onReset: () => void;
}

export default function Dashboard({ report, onReset }: DashboardProps) {
  const { summary, items, recommendations } = report;

  // Export report to CSV
  const exportToCSV = () => {
    const headers = ['POS', 'PartID', 'Codigo SAP', 'Descricao', 'Qtd Desenho', 'Qtd Jobbook', 'Qtd Enviada', 'Status', 'Observacao'];
    const rows = items.map(item => [
      item.pos,
      item.partId,
      item.codigoSap,
      item.description.replace(/"/g, '""'),
      item.qtyDemandDrawing,
      item.qtyDemandJobbook,
      item.qtyShippedJobbook,
      item.status,
      item.note.replace(/"/g, '""')
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reconciliacao_Tubulacao_Naval_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status style helper
  const getGlobalStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('SUCESSO') || s.includes('OK') || s.includes('CONFORME')) {
      return {
        label: 'Aprovado Sem Divergências',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        icon: CheckCircle2,
        desc: 'Todos os materiais do desenho técnico estão cobertos, enviados e conformes na planilha do Jobbook.'
      };
    } else if (s.includes('ATENCAO') || s.includes('DIVERGENCIA') || s.includes('PENDENCIA')) {
      return {
        label: 'Atenção Requerida',
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: AlertTriangle,
        desc: 'Foram detectadas inconsistências menores de quantidade ou envios pendentes no Jobbook.'
      };
    } else {
      return {
        label: 'Crítico: Pendências Graves',
        bg: 'bg-red-50 border-red-200 text-red-800',
        icon: AlertTriangle,
        desc: 'Existem itens críticos faltantes na planilha do Jobbook ou discrepâncias graves de quantidade.'
      };
    }
  };

  const statusConfig = getGlobalStatusBadge(summary.globalStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6" id="dashboard-view-container">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4" id="dashboard-header-actions">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Relatório de Reconciliação</h2>
          <p className="text-sm text-slate-500">Resultado comparativo instantâneo gerado pelo motor de IA Google Gemini.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
            id="btn-new-reconciliation"
          >
            <ArrowLeft className="w-4 h-4" />
            Nova Análise
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer"
            id="btn-export-reconciliation"
          >
            <FileDown className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row gap-4 items-start ${statusConfig.bg}`} id="global-status-banner">
        <div className="p-3 bg-white rounded-xl shadow-sm self-start">
          <StatusIcon className="w-6 h-6 shrink-0" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-base">{statusConfig.label}</h4>
          <p className="text-sm opacity-90">{statusConfig.desc}</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-kpi-grid">
        {/* Total Drawing Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="kpi-card-drawing">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Itens do Desenho</span>
            <h3 className="text-2xl font-black text-slate-800">{summary.totalDrawingItemsCount}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Total Jobbook Records */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="kpi-card-jobbook">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Itens do Jobbook</span>
            <h3 className="text-2xl font-black text-slate-800">{summary.totalJobbookItemsCount}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <HardHat className="w-5 h-5" />
          </div>
        </div>

        {/* Reconciled Count (OK) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="kpi-card-reconciled">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conformes (OK)</span>
            <h3 className="text-2xl font-black text-emerald-600">{summary.reconciledCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Completeness / Accuracy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="kpi-card-completeness">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxa de Conformidade</span>
            <h3 className="text-2xl font-black text-blue-600">{summary.completenessRate.toFixed(1)}%</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Items Details Grid (Reconciliation Table occupies 2 cols) */}
        <div className="lg:col-span-2 space-y-4" id="main-data-table-section">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Conformidade por Item</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
              {processedCountText(items)}
            </span>
          </div>
          <ReconciliationTable items={items} />
        </div>

        {/* Actionable Recommendations from AI */}
        <div className="space-y-4" id="ai-recommendations-section">
          <h3 className="text-lg font-bold text-slate-800">Recomendações Técnicas</h3>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 max-h-[640px] overflow-y-auto">
            {recommendations.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma recomendação especial necessária. Todos os fluxos estão em conformidade.</p>
            ) : (
              recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{rec}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function processedCountText(items: any[]) {
  const concessions = items.filter(i => i.status === 'OK').length;
  return `${concessions} de ${items.length} itens conformes`;
}
