import { useState, useMemo } from 'react';
import { ReconciledItem, ItemStatus } from '../types';
import { Search, Filter, ShieldAlert, CheckCircle, HelpCircle, Ship, MinusCircle, ArrowUpDown } from 'lucide-react';

interface ReconciliationTableProps {
  items: ReconciledItem[];
}

export default function ReconciliationTable({ items }: ReconciliationTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof ReconciledItem>('pos');
  const [sortAsc, setSortAsc] = useState(true);

  // Status style helper
  const getStatusConfig = (status: ItemStatus) => {
    switch (status) {
      case 'OK':
        return {
          label: 'Conforme',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle
        };
      case 'QUANTITY_MISMATCH':
        return {
          label: 'Divergência de Qtd.',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: ShieldAlert
        };
      case 'MISSING_IN_JOBBOOK':
        return {
          label: 'Fora do Jobbook',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
          icon: MinusCircle
        };
      case 'PENDING_SHIPMENT':
        return {
          label: 'Envio Pendente',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Ship
        };
      case 'UNEXPECTED_ITEM':
        return {
          label: 'Item Inesperado',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: HelpCircle
        };
    }
  };

  const handleSort = (field: keyof ReconciledItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedItems = useMemo(() => {
    let result = [...items];

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        item =>
          item.partId.toLowerCase().includes(q) ||
          item.codigoSap.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.pos.toLowerCase().includes(q)
      );
    }

    // Apply Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numerical sort for POS if it is clean
      if (sortField === 'pos') {
        const aNum = parseInt(a.pos, 10);
        const bNum = parseInt(b.pos, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          aVal = aNum;
          bVal = bNum;
        }
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [items, search, statusFilter, sortField, sortAsc]);

  return (
    <div className="space-y-4" id="table-reconciliation-wrapper">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm" id="table-filters-container">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por Código, POS, SAP ou Descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            id="search-input-field"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2" id="filter-dropdown-wrapper">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            id="status-filter-select"
          >
            <option value="ALL">Todos os Status</option>
            <option value="OK">Conforme (OK)</option>
            <option value="QUANTITY_MISMATCH">Divergência de Qtd.</option>
            <option value="MISSING_IN_JOBBOOK">Fora do Jobbook</option>
            <option value="PENDING_SHIPMENT">Envio Pendente</option>
            <option value="UNEXPECTED_ITEM">Item Inesperado</option>
          </select>
        </div>
      </div>

      {/* Responsive Table Grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm" id="table-scroll-container">
        <table className="w-full text-left border-collapse" id="reconciliation-data-table">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th onClick={() => handleSort('pos')} className="p-4 cursor-pointer hover:bg-slate-100 transition-colors w-20">
                <div className="flex items-center gap-1.5">
                  POS
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th onClick={() => handleSort('partId')} className="p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-1.5">
                  PartID / SAP
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="p-4">Descrição</th>
              <th className="p-4 text-center">Qtd. Desenho</th>
              <th className="p-4 text-center">Qtd. Jobbook</th>
              <th className="p-4 text-center">Qtd. Enviada</th>
              <th onClick={() => handleSort('status')} className="p-4 cursor-pointer hover:bg-slate-100 transition-colors text-center w-40">
                <div className="flex items-center justify-center gap-1.5">
                  Status
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {processedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                  Nenhum material encontrado com os critérios de filtro selecionados.
                </td>
              </tr>
            ) : (
              processedItems.map((item, index) => {
                const config = getStatusConfig(item.status);
                const StatusIcon = config.icon;
                return (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-slate-700 font-bold">{item.pos}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="font-mono text-slate-900 font-semibold">{item.partId}</div>
                      {item.codigoSap && (
                        <div className="text-[11px] font-mono text-slate-400">SAP: {item.codigoSap}</div>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="text-slate-800 font-medium truncate" title={item.description}>
                        {item.description}
                      </div>
                      {item.note && (
                        <div className="text-[11px] text-slate-400 italic truncate" title={item.note}>
                          Nota: {item.note}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-800">
                      {item.qtyDemandDrawing}
                    </td>
                    <td className="p-4 text-center font-mono font-semibold text-slate-600">
                      {item.qtyDemandJobbook}
                    </td>
                    <td className="p-4 text-center font-mono text-slate-600">
                      <span className={item.qtyShippedJobbook < item.qtyDemandJobbook ? 'text-blue-600 font-bold' : 'text-slate-500'}>
                        {item.qtyShippedJobbook}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config.badgeClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
