import React from 'react';
import { AstroBot } from './AstroBot';
import { useAstroBotStore } from '../../store/useAstroBotStore';

export function GlobalAstroBot() {
  const message = useAstroBotStore((state) => state.message);
  
  // We can always render AstroBot, it handles null message gracefully by unmounting the text box
  return <AstroBot message={message} />;
}
