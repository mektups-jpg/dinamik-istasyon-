import React from 'react';
import {
  DIVISIBILITY_WORKSHOP_CONFIG,
  NumberSelectionWorkshop,
} from '../quantum-filter-station/QuantumFilterStationApp';

const config = { ...DIVISIBILITY_WORKSHOP_CONFIG, moduleId: 'divisibility-workshop' };

export default function DivisibilityWorkshopApp() {
  return <NumberSelectionWorkshop config={config} />;
}
