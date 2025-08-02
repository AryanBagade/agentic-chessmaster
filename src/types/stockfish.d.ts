declare module 'stockfish' {
  interface StockfishWorker {
    postMessage(message: string): void;
    onmessage: ((message: string) => void) | null;
    terminate?(): void;
  }

  interface StockfishConstructor {
    new (): StockfishWorker;
  }

  const Stockfish: StockfishConstructor;
  export default Stockfish;
}