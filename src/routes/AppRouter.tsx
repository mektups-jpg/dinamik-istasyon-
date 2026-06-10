import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { modules, type ModuleMeta } from '../registry/moduleRegistry';
import Dashboard from './Dashboard';
import EmbedLayout from './EmbedLayout';
import ReviewWorkbench from './ReviewWorkbench';
import { GlobalAstroBot } from '../components/ui/GlobalAstroBot';
import {
  WORKFLOW_SCOPE_EVENT,
  getStoredWorkflowScope,
  isGradeInWorkflowScope,
  workflowScopeCopy,
  type WorkflowScope,
} from './workflowScope';

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
  const navigate = useNavigate();
  const [scope, setScope] = useState<WorkflowScope>(() => getStoredWorkflowScope());
  const [allowOnce, setAllowOnce] = useState(false);
  const inScope = isGradeInWorkflowScope(module.grade, scope);
  const backLabel = scope === 'Lise'
    ? 'Lise hattına dön'
    : scope === 'Ortaokul'
      ? 'Ortaokul hattına dön'
      : scope === 'İlkokul'
        ? 'İlkokul hattına dön'
        : 'Laboratuvara dön';

  useEffect(() => {
    setAllowOnce(false);
  }, [module.id]);

  useEffect(() => {
    const syncScope = () => setScope(getStoredWorkflowScope());
    window.addEventListener('storage', syncScope);
    window.addEventListener(WORKFLOW_SCOPE_EVENT, syncScope);
    return () => {
      window.removeEventListener('storage', syncScope);
      window.removeEventListener(WORKFLOW_SCOPE_EVENT, syncScope);
    };
  }, []);

  if (inScope || allowOnce) {
    return (
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-[#0B0C10] text-[#00E5FF]">Yükleniyor...</div>}>
        <module.component />
      </Suspense>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#050812] px-6 py-10 text-white">
      <div className="w-full max-w-xl rounded-[32px] border border-amber-300/24 bg-[linear-gradient(180deg,rgba(18,24,38,0.98),rgba(5,8,18,0.96))] p-7 text-center shadow-[0_32px_90px_rgba(0,0,0,0.46)]">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-amber-200/80">Hat dışı modül</p>
        <h1 className="mt-3 text-3xl font-black">Bu modül hat dışında</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/62">
          Şu anda {workflowScopeCopy[scope].label.toLocaleLowerCase('tr-TR')}. {module.grade}. sınıf modülü bu çalışma hattına ait değil.
          Modülü tek seferlik açabilir veya dashboard'da hattına dönebilirsin.
        </p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
          <p className="text-sm font-black text-white">{module.title}</p>
          <p className="mt-1 text-xs text-white/46">{module.grade}. sınıf · {module.category}</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="min-h-12 rounded-2xl border border-[#00E5FF]/24 bg-[#00E5FF]/10 px-4 text-sm font-black text-cyan-100 transition hover:border-[#00E5FF]/55"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={() => setAllowOnce(true)}
            className="min-h-12 rounded-2xl border border-amber-200/24 bg-amber-200/10 px-4 text-sm font-black text-amber-100 transition hover:border-amber-200/55"
          >
            Yine de aç
          </button>
        </div>
      </div>
    </div>
  );
}
