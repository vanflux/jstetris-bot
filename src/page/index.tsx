import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { App } from './components/app';
import { disableWebGl } from './tweaks/disable-webgl';
import { hookGameInstance } from './tweaks/game';

export async function immediateEntry() {
  console.log('[PageScript] immediateEntry from app');
  disableWebGl();
}

export async function pageLoadedEntry() {
  console.log('[PageScript] pageLoadedEntry from app');

  hookGameInstance();
  
  // Remove UI if exists
  if (window.destroyVFE) window.destroyVFE();

  // Render the new UI
  const container = document.createElement('div');
  container.id = 'hackRoot';
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App></App>);
  window.destroyVFE = () => root.unmount();
}
