import { Board, BoardStatisticsData, IDepthCalculator } from "tetris-bot";

export class CustomDepthCalculator implements IDepthCalculator {
  calculate(board: Board, { minY }: BoardStatisticsData): number {
    if (minY >= 8) {
      return 2;
    } else {
      return 3;
    }
  }

}
