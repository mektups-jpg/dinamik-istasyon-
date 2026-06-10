import React from 'react';
import { Droplets } from 'lucide-react';
import { UnitConverter3Experience } from '../unit-converter-3/UnitConverter3App';
import {
  LIQUID_MEASURE_WORKSHOP_3_ATOMS,
  createLiquidMeasureWorkshop3Tasks,
} from '../unit-converter-3/unitConverter3Tasks';

const MODULE_ID = 'liquid-measure-workshop-3';

export default function LiquidMeasureWorkshop3App() {
  return (
    <UnitConverter3Experience
      moduleId={MODULE_ID}
      title="Litre Ölçme Atölyesi"
      subtitle="İlkokul 3. Sınıf / Litre ve Mililitre"
      icon={<Droplets className="h-6 w-6" />}
      accent="#38BDF8"
      atoms={LIQUID_MEASURE_WORKSHOP_3_ATOMS}
      createTasks={createLiquidMeasureWorkshop3Tasks}
      completionTitle="Litre Ölçme Atölyesi hazır!"
      completionBody="Litre kaplarını saydın, mililitreleri birleştirdin ve 1 litreye tamamladın."
      botSuccessText="Litre Ölçme Atölyesi tamam! Sıvı miktarlarını doğru okuyorsun."
      score={75}
      testIdPrefix={MODULE_ID}
    />
  );
}
