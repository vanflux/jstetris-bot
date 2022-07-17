import { immediateContentScriptEntry, immediatePageScriptEntry, pageLoadedContentScriptEntry, pageLoadedPageScriptEntry } from './entry';
import { runOnReady } from './functions';

export async function main() {
  
  let isContentScript = false;
  let scriptUrl: string;
  if (typeof chrome !== 'undefined') {
    if (typeof chrome.runtime.getURL === 'function') {
      isContentScript = true;
      scriptUrl = chrome.runtime.getURL('content.js');
    }
  }
  
  if (isContentScript) {
    immediateContentScriptEntry();
    // Content script
    runOnReady(['interactive', 'complete'], () => {
      pageLoadedContentScriptEntry();
      const script = document.createElement('script');
      script.src = scriptUrl;
      document.body.appendChild(script);
    });
  } else {
    immediatePageScriptEntry();
    // Page script
    runOnReady(['complete'], () => {
      pageLoadedPageScriptEntry();
    });
  }
}

main();
