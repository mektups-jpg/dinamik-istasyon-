import React from 'react';
import {
  GCD_LCM_WORKSHOP_CONFIG,
  NumberSelectionWorkshop,
} from '../quantum-filter-station/QuantumFilterStationApp';

const config = { ...GCD_LCM_WORKSHOP_CONFIG, moduleId: 'gcd-lcm-workshop' };

export default function GcdLcmWorkshopApp() {
  return <NumberSelectionWorkshop config={config} />;
}
