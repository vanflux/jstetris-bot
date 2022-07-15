import './styles.css';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app';
import { disableWebGl } from './tweaks/disable-webgl';

export async function immediateContentScriptEntry() {

}

export async function immediatePageScriptEntry() {
  disableWebGl();
}

export async function pageLoadedContentScriptEntry() {

}

export async function pageLoadedPageScriptEntry() {
  // Remove UI if exists
  if (window.destroyHack) window.destroyHack();

  // Render the new UI
  const root = document.createElement('div');
  root.id = 'hackRoot';
  document.body.appendChild(root);
  ReactDOM.render(<App></App>, root);
  window.destroyHack = () => ReactDOM.unmountComponentAtNode(root);
}
