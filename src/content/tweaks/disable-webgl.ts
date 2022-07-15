
export function disableWebGl() {
  console.log('Hooking getContext');
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  // @ts-ignore
  HTMLCanvasElement.prototype.getContext = function (...args) {
    if (args[0] !== '2d') return null;
    return originalGetContext.apply(this, args);
  }
}
