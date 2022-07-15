
export function runOnReady(readyStates: DocumentReadyState[], fn: () => any) {
  const handler = () => {
    if (readyStates.includes(document.readyState)) {
      document.removeEventListener('readystatechange', handler);
      fn();
    }
  };
  if (readyStates.includes(document.readyState)) {
    handler();
  } else {
    document.addEventListener('readystatechange', handler);
  }
}

export function posesMinX(positions: {x: number, y: number}[]) {
  return Math.min(...positions.map(x => x.x));
}

export function posesMinY(positions: {x: number, y: number}[]) {
  return Math.min(...positions.map(x => x.y));
}

export function normalizePositions(positions: {x: number, y: number}[]) {
  const minX = posesMinX(positions);
  const minY = posesMinY(positions);
  return positions.map(pos => ({ x: pos.x-minX, y: pos.y-minY }));
}

export function comparePositions(positions1: {x: number, y: number}[], positions2: {x: number, y: number}[]) {
  return positions1.every(pos1 => positions2.some(pos2 => pos1.x === pos2.x && pos1.y === pos2.y));
}

export function compareArrays<T>(array1: T[], array2: T[]) {
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
}
