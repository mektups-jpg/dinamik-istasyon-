import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { modules, type ModuleMeta } from '../registry/moduleRegistry';
import Dashboard from './Dashboard';
import EmbedLayout from './EmbedLayout';
import ReviewWorkbench from './ReviewWorkbench';
import { GlobalAstroBot } from '../components/ui/GlobalAstroBot';
import { getBandForGrade, getWorkflowScopeLabel, isModuleAllowedInScope, readWorkflowScope } from './workflowScope';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <GlobalAstroBot />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/review-workbench" element={<ReviewWorkbench />} />
        
        {/* Embed Routes */}
        <Route path="/embed" element={<EmbedLayout />}>
          {modules.map((mod) => (
            <Route 
              key={mod.id} 
              path={mod.path.replace('/embed/', '')} 
              element={<ScopedModuleRoute module={mod} />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ScopedModuleRoute({ module }: { module: ModuleMeta }) {
  const [isBypassed, setIsBypassed] = useState(false);
  const scope = readWorkflowScope();

  if (!isBypassed && !isModuleAllowedInScope(module, scope)) {
    return <ScopeGuardScreen module={module} scopeLabel={getWorkflowScopeLabel(scope)} onContinue={() => setIsBypassed(true)} />;
  }

  const ModuleComponent = module.component;

  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-[#0B0C10] text-[#00E5FF]">Yükleniyor...</div>}>
      <ModuleComponent />
    </Suspense>
  );
}

function ScopeGuardScreen({
  module,
  scopeLabel,
  onContinue,
}: {
  module: ModuleMeta;
  scopeLabel: string;
  onContinue: () => void;
}) {
  return (
    <div className="grid h-full w-full place-items-center bg-[#070B12] px-5 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_24%_14%,rgba(0,229,255,0.14),transparent_32%),radial-gradient(circle_at_78%_28%,rgba(179,136,255,0.12),transparent_30%)]" />
      <section className="relative w-full max-w-xl rounded-3xl border border-[#00E5FF]/20 bg-[#0B1220]/92 p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.45)] md:p-8">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#00E5FF]">
          {scopeLabel} açık
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Bu modül hat dışında</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/62 md:text-base">
          Şu an {scopeLabel.toLocaleLowerCase('tr-TR')}nda çalışıyorsun. Açmak istediğin modül {module.grade}. sınıf · {getBandForGrade(module.grade)}.
        </p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
          <p className="text-lg font-black text-white">{module.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/56">{module.description}</p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white/78 transition hover:border-[#00E5FF]/45 hover:text-[#00E5FF]"
          >
            {scopeLabel === 'Tüm sınıflar' ? 'Ana laboratuvara dön' : `${scopeLabel}na dön`}
          </Link>
          <button
            type="button"
            onClick={onContinue}
            className="min-h-12 flex-1 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#B388FF] px-5 py-3 text-sm font-black text-[#07101d] shadow-[0_0_28px_rgba(0,229,255,0.24)] transition hover:scale-[1.01]"
          >
            Yine de aç
          </button>
        </div>
      </section>
    </div>
  );
}
