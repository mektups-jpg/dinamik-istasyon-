import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { modules } from '../registry/moduleRegistry';
import Dashboard from './Dashboard';
import EmbedLayout from './EmbedLayout';
import { GlobalAstroBot } from '../components/ui/GlobalAstroBot';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <GlobalAstroBot />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Embed Routes */}
        <Route path="/embed" element={<EmbedLayout />}>
          {modules.map((mod) => (
            <Route 
              key={mod.id} 
              path={mod.path.replace('/embed/', '')} 
              element={
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-[#0B0C10] text-[#00E5FF]">Yükleniyor...</div>}>
                  <mod.component />
                </Suspense>
              } 
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
