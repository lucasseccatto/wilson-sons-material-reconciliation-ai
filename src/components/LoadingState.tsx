import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Anchor, Cpu, Compass, HardHat, ShieldCheck } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  icon: any;
}

const STEPS: Step[] = [
  { id: 1, label: 'Lendo e extraindo dados do Jobbook (.xlsx)...', icon: Anchor },
  { id: 2, label: 'Alimentando o motor de Inteligência Artificial Google Gemini...', icon: Cpu },
  { id: 3, label: 'Inspecionando desenho técnico naval e extraindo lista de materiais...', icon: Compass },
  { id: 4, label: 'Cruzando referências, posições e códigos SAP das peças...', icon: HardHat },
  { id: 5, label: 'Consolidando as divergências e gerando relatório final...', icon: ShieldCheck }
];

export default function LoadingState() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const intervals = [3000, 5000, 7000, 6000, 4000];
    let step = 0;

    const runTimer = () => {
      if (step < STEPS.length - 1) {
        step++;
        setCurrentStepIdx(step);
        setTimeout(runTimer, intervals[step]);
      }
    };

    const timer = setTimeout(runTimer, intervals[0]);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 max-w-xl mx-auto text-center space-y-8" id="loading-state-view">
      <div className="relative flex items-center justify-center w-24 h-24" id="pulsing-loader-wrapper">
        {/* Radar concentric wave animation */}
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-blue-500/10"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute inset-2 rounded-full bg-blue-500/20"
        />
        <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Anchor className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-800">Reconciliando via IA</h3>
        <p className="text-sm text-slate-500">Isso pode levar de 15 a 45 segundos dependendo do tamanho do desenho.</p>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden" id="progressbar-track">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepIdx + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="bg-blue-600 h-full rounded-full"
        />
      </div>

      <div className="w-full min-h-[60px]" id="loading-steps-ticker">
        <AnimatePresence mode="wait">
          {STEPS.map((step, idx) => {
            if (idx !== currentStepIdx) return null;
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 text-slate-700 bg-slate-50 py-3 px-6 rounded-2xl border border-slate-100"
                id={`loading-step-${step.id}`}
              >
                <Icon className="w-5 h-5 text-blue-600 shrink-0 animate-bounce" />
                <span className="text-sm font-medium">{step.label}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
