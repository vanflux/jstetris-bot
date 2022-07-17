
export class PlayerList {
  public static capture(): string[] {
    const gameSlots = document.getElementById('gameSlots');
    if (!gameSlots) return [];
    const spans = Array.from(gameSlots.querySelectorAll('.slot span'));
    return spans.map(x => x.textContent as string).filter(x => x && x.length > 0);
  }
}
