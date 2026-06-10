import React from 'react';
import {
  GCD_WORKSHOP_CONFIG,
  NumberSelectionWorkshop,
} from '../quantum-filter-station/QuantumFilterStationApp';

const config = { ...GCD_WORKSHOP_CONFIG, moduleId: 'gcd-workshop' };

export default function GcdWorkshopApp() {
  return <NumberSelectionWorkshop config={config} />;
}
