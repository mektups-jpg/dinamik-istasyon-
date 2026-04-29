import React from 'react';
import { AstroBot } from './AstroBot';
import { useAstroBotStore } from '../../store/useAstroBotStore';

export function GlobalAstroBot() {
  const message = useAstroBotStore((state) => state.message);

  if (!message) return null;

  return <AstroBot message={message} />;
}
