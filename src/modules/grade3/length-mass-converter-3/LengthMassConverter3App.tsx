import React from 'react';
import { Ruler } from 'lucide-react';
import { UnitConverter3Experience } from '../unit-converter-3/UnitConverter3App';
import {
  LENGTH_MASS_CONVERTER_3_ATOMS,
  createLengthMassConverter3Tasks,
} from '../unit-converter-3/unitConverter3Tasks';

const MODULE_ID = 'length-mass-converter-3';

export default function LengthMassConverter3App() {
  return (
    <UnitConverter3Experience
      moduleId={MODULE_ID}
      title="Ölçü Birimi Makinesi"
      subtitle="İlkokul 3. Sınıf / Metre, Santimetre, Kilogram ve Gram"
      icon={<Ruler className="h-6 w-6" />}
      accent="#60A5FA"
      atoms={LENGTH_MASS_CONVERTER_3_ATOMS}
      createTasks={createLengthMassConverter3Tasks}
      completionTitle="Ölçü Birimi Makinesi hazır!"
      completionBody="Metre-santimetre ve kilogram-gram dönüşümlerini doğru seçtin."
      botSuccessText="Ölçü Birimi Makinesi tamam! 100 cm ve 1000 g kurallarını yakaladın."
      score={60}
      testIdPrefix={MODULE_ID}
    />
  );
}
