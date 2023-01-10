
// Issue report: https://github.com/vanflux/jstetris-bot/issues/1

export function imageCrossOriginAnonymous() {
  console.log('Hooking Image constructor for anonymous crossorigin');
  const originalImage = window.Image;
  // @ts-ignore
  window.Image = function (...args) {
    const instance = new originalImage(...args);
    instance.crossOrigin = 'anonymous';
    return instance;
  }
}
