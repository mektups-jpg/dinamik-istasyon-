import React from 'react';
import {
  NumberSelectionWorkshop,
  PRIME_NUMBERS_WORKSHOP_CONFIG,
} from '../quantum-filter-station/QuantumFilterStationApp';

const config = { ...PRIME_NUMBERS_WORKSHOP_CONFIG, moduleId: 'prime-numbers-workshop' };

export default function PrimeNumbersWorkshopApp() {
  return <NumberSelectionWorkshop config={config} />;
}
