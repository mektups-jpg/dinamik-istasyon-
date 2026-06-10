import React from 'react';
import { Timer } from 'lucide-react';
import { UnitConverter3Experience } from '../unit-converter-3/UnitConverter3App';
import {
  TIME_CONVERSION_3_ATOMS,
  createTimeConversion3Tasks,
} from '../unit-converter-3/unitConverter3Tasks';

const MODULE_ID = 'time-conversion-3';

export default function TimeConversion3App() {
  return (
    <UnitConverter3Experience
      moduleId={MODULE_ID}
      title="Zaman Dönüşüm Makinesi"
      subtitle="İlkokul 3. Sınıf / Saat, Dakika ve Saniye"
      icon={<Timer className="h-6 w-6" />}
      accent="#FACC15"
      atoms={TIME_CONVERSION_3_ATOMS}
      createTasks={createTimeConversion3Tasks}
      completionTitle="Zaman Dönüşüm Makinesi hazır!"
      completionBody="Saat-dakika ve dakika-saniye dönüşümlerini doğru kurdun."
      botSuccessText="Zaman Dönüşüm Makinesi tamam! 60 dakika ve 60 saniye bağını yakaladın."
      score={60}
      testIdPrefix={MODULE_ID}
    />
  );
}
