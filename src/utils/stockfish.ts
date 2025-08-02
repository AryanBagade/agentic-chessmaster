import { Chess } from 'chess.js';

class StockfishEngine {
  private isReady = true; // Start ready since we're using simple AI
  private depth = 3; // Simple depth for basic AI


  public async getBestMove(fen: string): Promise<string | null> {
    return new Promise((resolve) => {
      // Add a small delay to simulate thinking
      setTimeout(() => {
        const move = this.getBestMoveInternal(fen);
        resolve(move);
      }, 500 + Math.random() * 1500); // Random delay between 0.5-2 seconds
    });
  }

  private getBestMoveInternal(fen: string): string | null {
    try {
      const game = new Chess(fen);
      const moves = game.moves({ verbose: true });
      
      if (moves.length === 0) return null;

      // Simple AI strategy: prioritize captures, then random moves
      const captures = moves.filter(move => move.captured);
      const checks = moves.filter(move => {
        const tempGame = new Chess(fen);
        tempGame.move(move);
        return tempGame.isCheck();
      });

      let chosenMove;
      
      if (captures.length > 0) {
        // Prefer captures
        chosenMove = captures[Math.floor(Math.random() * captures.length)];
      } else if (checks.length > 0 && Math.random() > 0.7) {
        // Sometimes go for checks
        chosenMove = checks[Math.floor(Math.random() * checks.length)];
      } else {
        // Random move
        chosenMove = moves[Math.floor(Math.random() * moves.length)];
      }

      return `${chosenMove.from}${chosenMove.to}${chosenMove.promotion || ''}`;
    } catch (error) {
      console.error('Error getting AI move:', error);
      return this.getRandomMove(fen);
    }
  }

  private getRandomMove(fen: string): string | null {
    try {
      const game = new Chess(fen);
      const moves = game.moves({ verbose: true });
      
      if (moves.length === 0) return null;
      
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      return `${randomMove.from}${randomMove.to}${randomMove.promotion || ''}`;
    } catch (error) {
      console.error('Error getting random move:', error);
      return null;
    }
  }

  public setDepth(depth: number) {
    this.depth = Math.max(1, Math.min(20, depth));
  }

  public destroy() {
    // No cleanup needed for simple AI
  }
}

export default StockfishEngine;