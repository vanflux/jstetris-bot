
let gameInstance: any;

export function hookGameInstance() {
  console.log('Hooking game instance');
  // @ts-ignore
  const original = Game.prototype.update;
  // @ts-ignore
	Game.prototype.update = function (...args: any) {
    gameInstance = this;
    return original.apply(this, args);
  };
}

export function unfocusGame() {
  gameInstance?.setFocusState?.(1);
}

export function focusGame() {
  gameInstance?.setFocusState?.(0);
}
