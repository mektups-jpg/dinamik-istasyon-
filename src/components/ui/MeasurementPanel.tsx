import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target } from 'lucide-react';

interface MeasurementPanelProps {
    visible: boolean;
    protractorPlaced: boolean;
    phase: number;
    angleInputValue: string;
    setAngleInputValue: (val: string) => void;
    handlePlaceProtractor: () => void;
    handleVerifyAngle: () => void;
    rayAngleKind?: string;
    segmentAngleKind?: string;
}

export function MeasurementPanel({ visible, protractorPlaced, phase, angleInputValue, setAngleInputValue, handlePlaceProtractor, handleVerifyAngle, rayAngleKind = 'geniş', segmentAngleKind = 'dar' }: MeasurementPanelProps) {
    const promptText = phase === 4
        ? 'Seçtiğin açının ölçüsü kaç derece?'
        : phase === 7
            ? `Işının mavi doğruyla yaptığı ${rayAngleKind} açı kaç derece?`
            : `Doğru parçasının mor doğruyla yaptığı ${segmentAngleKind} açı kaç derece?`;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} className="bg-[#12121A]/80 backdrop-blur-xl border border-[#B388FF]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B388FF]/5 to-transparent"></div>
                    <h3 className="text-xs font-bold text-[#B388FF] uppercase tracking-widest border-b border-[#B388FF]/20 pb-2 relative z-10 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Açıyı Ölç & Gir
                    </h3>
                    <div className="relative z-10 w-full flex flex-col gap-3">
                    {!protractorPlaced ? (
                        <button onClick={handlePlaceProtractor} className="py-3 px-4 w-full bg-[#B388FF]/20 text-[#B388FF] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#B388FF]/40 hover:bg-[#B388FF]/40 hover:text-white transition-colors">
                            İletkiyi Aç
                        </button>
                    ) : (
                        <div className="p-3 bg-black/50 rounded-xl border border-gray-800">
                            <p className="mb-2 text-sm font-bold leading-snug text-[#D7FFF5]">
                                {promptText}
                            </p>
                            <div className="flex gap-2 mb-3">
                                <input type="number" value={angleInputValue} onChange={e => setAngleInputValue(e.target.value)}
                                    className="flex-1 w-full bg-[#12121A] border border-[#B388FF]/50 rounded-lg px-4 py-2 text-xl font-mono text-white focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] text-center transition-all"
                                    placeholder="derece"
                                />
                                    <div className="flex items-center justify-center w-12 bg-[#12121A] rounded-lg border border-gray-800 text-gray-500 font-black text-xl">°</div>
                            </div>
                            <button onClick={handleVerifyAngle} className="w-full py-3 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-wider rounded-lg transition-colors">
                                Kontrol et
                            </button>
                        </div>
                    )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
