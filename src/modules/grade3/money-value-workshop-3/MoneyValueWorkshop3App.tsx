import React from 'react';
import { Coins } from 'lucide-react';
import { UnitConverter3Experience } from '../unit-converter-3/UnitConverter3App';
import {
  MONEY_VALUE_WORKSHOP_3_ATOMS,
  createMoneyValueWorkshop3Tasks,
} from '../unit-converter-3/unitConverter3Tasks';

const MODULE_ID = 'money-value-workshop-3';

export default function MoneyValueWorkshop3App() {
  return (
    <UnitConverter3Experience
      moduleId={MODULE_ID}
      title="Para Değeri Atölyesi"
      subtitle="İlkokul 3. Sınıf / TL ve Kuruş"
      icon={<Coins className="h-6 w-6" />}
      accent="#34D399"
      atoms={MONEY_VALUE_WORKSHOP_3_ATOMS}
      createTasks={createMoneyValueWorkshop3Tasks}
      completionTitle="Para Değeri Atölyesi hazır!"
      completionBody="Kuruşları TL'ye tamamladın ve farklı paraları doğru topladın."
      botSuccessText="Para Değeri Atölyesi tamam! TL ve kuruş değerlerini doğru kuruyorsun."
      score={60}
      testIdPrefix={MODULE_ID}
    />
  );
}
