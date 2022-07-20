import React from 'react';
import * as ReactDOM from 'react-dom';
import './styles.css';
import { App } from './components/app';
import { disableWebGl } from './tweaks/disable-webgl';

export async function immediateEntry() {
  console.log('[PageScript] immediateEntry from app');
  disableWebGl();
}

export async function pageLoadedEntry() {
  console.log('[PageScript] pageLoadedEntry from app');

  // Remove UI if exists
  if (window.destroyVFE) window.destroyVFE();

  // Render the new UI
  const root = document.createElement('div');
  root.id = 'hackRoot';
  document.body.appendChild(root);
  ReactDOM.render(<App></App>, root);
  window.destroyVFE = () => ReactDOM.unmountComponentAtNode(root);
}
