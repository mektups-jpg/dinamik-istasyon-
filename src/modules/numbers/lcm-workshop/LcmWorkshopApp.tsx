import React from 'react';
import {
  LCM_WORKSHOP_CONFIG,
  NumberSelectionWorkshop,
} from '../quantum-filter-station/QuantumFilterStationApp';

const config = { ...LCM_WORKSHOP_CONFIG, moduleId: 'lcm-workshop' };

export default function LcmWorkshopApp() {
  return <NumberSelectionWorkshop config={config} />;
}
