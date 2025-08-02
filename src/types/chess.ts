export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  promotion?: PieceType;
}

export type Board = (ChessPiece | null)[][];

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  moveHistory: Move[];
  enPassantTarget?: Position;
  canCastleKingSide: {
    white: boolean;
    black: boolean;
  };
  canCastleQueenSide: {
    white: boolean;
    black: boolean;
  };
}