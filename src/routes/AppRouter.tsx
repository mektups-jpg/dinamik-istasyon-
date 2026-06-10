import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { modules, type ModuleMeta } from '../registry/moduleRegistry';
import Dashboard from './Dashboard';
import EmbedLayout from './EmbedLayout';
import ReviewWorkbench from './ReviewWorkbench';
import { GlobalAstroBot } from '../components/ui/GlobalAstroBot';
import { getWorkflowScopeDescription, getWorkflowScopeLabel, isModuleInScope, useWorkflowScope } from './workflowScope';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <GlobalAstroBot />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/review-workbench" element={<ReviewWorkbench />} />
        
        {/* Embed Routes */}
        <Route path="/embed" element={<EmbedLayout />}>
          <Route path="numbers/quantum-filter-station" element={<Navigate to="/embed/numbers/divisibility-workshop" replace />} />
          <Route path="numbers/gcd-lcm-workshop" element={<Navigate to="/embed/numbers/lcm-workshop" replace />} />
          {modules.map((mod) => (
            <Route 
              key={mod.id} 
              path={mod.path.replace('/embed/', '')} 
              element={<ScopedEmbedModule mod={mod} />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ScopedEmbedModule({ mod }: { mod: ModuleMeta }) {
  const location = useLocation();
  const { scope } = useWorkflowScope();
  const [allowOnce, setAllowOnce] = useState(false);
  const isInScope = isModuleInScope(mod, scope);
  const ModuleComponent = mod.component;

  useEffect(() => {
    setAllowOnce(false);
  }, [location.pathname, scope]);

  if (!isInScope && !allowOnce) {
    return <OutOfScopeGate mod={mod} onOpenAnyway={() => setAllowOnce(true)} />;
  }

  return (
    <Suspense fallback={<ModuleLoading />}>
      <ModuleComponent />
    </Suspense>
  );
}

function ModuleLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0B0C10] text-[#00E5FF]">
      Yükleniyor...
    </div>
  );
}

function OutOfScopeGate({ mod, onOpenAnyway }: { mod: ModuleMeta; onOpenAnyway: () => void }) {
  const navigate = useNavigate();
  const { scope } = useWorkflowScope();
  const scopeLabel = getWorkflowScopeLabel(scope);

  return (
    <main
      data-testid="scope-gate"
      className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_10%,rgba(0,229,255,0.18),transparent_30%),linear-gradient(135deg,#070B12,#141827_52%,#24122f)] p-5 text-white"
    >
      <section className="w-full max-w-2xl rounded-[32px] border border-[#00E5FF]/22 bg-[#07101d]/90 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#00E5FF]">
          Hat dışı modül
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Bu modül hat dışında</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/66 sm:text-base">
          Şu anda {scopeLabel} çalışma hattı açık. {getWorkflowScopeDescription(scope)} Seçilen modül ise {mod.grade}. sınıf
          alanında: <span className="font-black text-white">{mod.title}</span>.
        </p>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/42">Route</p>
          <p className="mt-2 break-all font-mono text-sm text-[#00E5FF]">{mod.path}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            data-testid="scope-return"
            onClick={() => navigate('/')}
            className="rounded-2xl border border-[#00E5FF]/35 bg-[#00E5FF]/12 px-5 py-3 text-sm font-black text-cyan-50 transition hover:bg-[#00E5FF]/18"
          >
            {scopeLabel} hattına dön
          </button>
          <button
            type="button"
            data-testid="scope-open-anyway"
            onClick={onOpenAnyway}
            className="rounded-2xl border border-white/12 bg-white/8 px-5 py-3 text-sm font-black text-white transition hover:border-white/28 hover:bg-white/12"
          >
            Yine de aç
          </button>
        </div>
      </section>
    </main>
  );
}
