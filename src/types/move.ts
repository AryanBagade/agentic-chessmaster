export interface MoveLogEntry {
  id: string;
  moveNumber: number;
  color: 'white' | 'black';
  piece: string;
  from: string;
  to: string;
  notation: string;
  captured?: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isStalemate?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotion?: string;
  timestamp: Date;
}