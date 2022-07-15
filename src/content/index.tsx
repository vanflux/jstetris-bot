import { immediateContentScriptEntry, immediatePageScriptEntry, pageLoadedContentScriptEntry, pageLoadedPageScriptEntry } from './entry';
import { runOnReady } from './functions';

export async function main() {
  // @ts-ignore
  if (typeof chrome.runtime.getURL === 'function') {
    immediateContentScriptEntry();
    // Content script
    runOnReady(['interactive', 'complete'], () => {
      pageLoadedContentScriptEntry();
      const script = document.createElement('script');
      // @ts-ignore
      script.src = chrome.runtime.getURL('content.js');
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
