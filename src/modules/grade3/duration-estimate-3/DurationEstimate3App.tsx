import React from 'react';
import { Hourglass } from 'lucide-react';
import { UnitConverter3Experience } from '../unit-converter-3/UnitConverter3App';
import {
  DURATION_ESTIMATE_3_ATOMS,
  createDurationEstimate3Tasks,
} from '../unit-converter-3/unitConverter3Tasks';

const MODULE_ID = 'duration-estimate-3';

export default function DurationEstimate3App() {
  return (
    <UnitConverter3Experience
      moduleId={MODULE_ID}
      title="Süre Tahmin Dedektifi"
      subtitle="İlkokul 3. Sınıf / Günlük Süre Tahmini"
      icon={<Hourglass className="h-6 w-6" />}
      accent="#A78BFA"
      atoms={DURATION_ESTIMATE_3_ATOMS}
      createTasks={createDurationEstimate3Tasks}
      completionTitle="Süre Tahmin Dedektifi hazır!"
      completionBody="Günlük olayların saniye, dakika ya da saat olarak makul süresini seçtin."
      botSuccessText="Süre Tahmin Dedektifi tamam! Günlük süreleri daha iyi kestiriyorsun."
      score={45}
      testIdPrefix={MODULE_ID}
    />
  );
}
