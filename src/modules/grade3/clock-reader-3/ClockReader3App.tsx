import React from 'react';
import { Clock3 } from 'lucide-react';
import { UnitConverter3Experience } from '../unit-converter-3/UnitConverter3App';
import {
  CLOCK_READER_3_ATOMS,
  createClockReader3Tasks,
} from '../unit-converter-3/unitConverter3Tasks';

const MODULE_ID = 'clock-reader-3';

export default function ClockReader3App() {
  return (
    <UnitConverter3Experience
      moduleId={MODULE_ID}
      title="Saati Okuyorum"
      subtitle="İlkokul 3. Sınıf / Analog ve Dijital Saat"
      icon={<Clock3 className="h-6 w-6" />}
      accent="#22D3EE"
      atoms={CLOCK_READER_3_ATOMS}
      createTasks={createClockReader3Tasks}
      completionTitle="Saati Okuyorum hazır!"
      completionBody="Analog saatteki zamanı okuyup dijital saat olarak seçtin."
      botSuccessText="Saati Okuyorum tamam! Akrep ve yelkovanı doğru okuyorsun."
      score={60}
      testIdPrefix={MODULE_ID}
    />
  );
}
