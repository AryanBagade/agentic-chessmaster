import React, { useEffect, useRef } from 'react';
import { MoveLogEntry } from '../types/move';

interface MoveLogProps {
  moves: MoveLogEntry[];
  isVsCpu: boolean;
  humanColor?: 'white' | 'black';
}

const MoveLog: React.FC<MoveLogProps> = ({ moves, isVsCpu, humanColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);


  const formatMoveDescription = (move: MoveLogEntry): string => {
    const pieceNameMap: Record<string, string> = {
      'p': 'Pawn',
      'r': 'Rook', 
      'n': 'Knight',
      'b': 'Bishop',
      'q': 'Queen',
      'k': 'King'
    };

    const pieceName = pieceNameMap[move.piece.toLowerCase()] || move.piece;
    const colorName = move.color === 'white' ? 'White' : 'Black';
    
    let description = `${colorName} ${pieceName}`;
    
    if (move.isCastling) {
      const side = move.to === 'g1' || move.to === 'g8' ? 'kingside' : 'queenside';
      return `${colorName} castled ${side}`;
    }
    
    if (move.captured) {
      const capturedPiece = pieceNameMap[move.captured.toLowerCase()] || move.captured;
      description += ` captured ${capturedPiece}`;
    } else {
      description += ` moved`;
    }
    
    description += ` ${move.from} → ${move.to}`;
    
    if (move.promotion) {
      const promotedPiece = pieceNameMap[move.promotion.toLowerCase()] || move.promotion;
      description += ` (promoted to ${promotedPiece})`;
    }
    
    if (move.isCheckmate) {
      description += ' - Checkmate!';
    } else if (move.isCheck) {
      description += ' - Check!';
    } else if (move.isStalemate) {
      description += ' - Stalemate!';
    }
    
    return description;
  };

  const getPlayerLabel = (color: 'white' | 'black'): string => {
    if (!isVsCpu) {
      return color === 'white' ? 'White Player' : 'Black Player';
    }
    
    if (humanColor === color) {
      return 'You';
    } else {
      return 'CPU';
    }
  };

  return (
    <div style={{
      width: '320px',
      height: '560px', // Match chessboard height
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        <h3 style={{
          margin: 0,
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          📝 Move History
        </h3>
        <p style={{
          margin: '3px 0 0 0',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.8rem',
          textAlign: 'center'
        }}>
          {moves.length} move{moves.length !== 1 ? 's' : ''} played
        </p>
      </div>

      {/* Moves List */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent'
        }}
        className="custom-scrollbar"
      >
        {moves.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>♟️</div>
            <p style={{ margin: 0, fontSize: '1rem' }}>No moves yet</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem' }}>Make your first move!</p>
          </div>
        ) : (
          moves.map((move, index) => (
            <div
              key={move.id}
              style={{
                marginBottom: '4px',
                padding: '8px',
                borderRadius: '8px',
                background: move.color === 'white' 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))'
                  : 'linear-gradient(135deg, rgba(50, 50, 50, 0.35), rgba(30, 30, 30, 0.5))',
                border: move.color === 'white'
                  ? '1px solid rgba(255, 255, 255, 0.15)'
                  : '1px solid rgba(100, 100, 100, 0.25)',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Move info in single line */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: move.color === 'white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)',
                    background: move.color === 'white' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.15)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {Math.ceil((index + 1) / 2)}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: move.color === 'white' ? '#FFD700' : '#87CEEB',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
                  }}>
                    {getPlayerLabel(move.color)}
                  </span>
                </div>
                
                {/* Special indicators as small badges */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {move.captured && (
                    <span style={{
                      fontSize: '0.6rem',
                      background: 'rgba(255, 100, 100, 0.8)',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '6px',
                      fontWeight: 'bold'
                    }}>
                      ⚔️
                    </span>
                  )}
                  {move.isCastling && (
                    <span style={{
                      fontSize: '0.6rem',
                      background: 'rgba(100, 149, 237, 0.8)',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '6px',
                      fontWeight: 'bold'
                    }}>
                      🏰
                    </span>
                  )}
                  {move.isCheck && !move.isCheckmate && (
                    <span style={{
                      fontSize: '0.6rem',
                      background: 'rgba(255, 165, 0, 0.8)',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '6px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️
                    </span>
                  )}
                  {move.isCheckmate && (
                    <span style={{
                      fontSize: '0.6rem',
                      background: 'rgba(220, 20, 60, 0.9)',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '6px',
                      fontWeight: 'bold'
                    }}>
                      👑
                    </span>
                  )}
                </div>
              </div>

              {/* Compact Move Description */}
              <div style={{
                color: move.color === 'white' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                lineHeight: '1.2',
                fontWeight: '500',
                marginBottom: '3px'
              }}>
                {formatMoveDescription(move)}
              </div>

              {/* Chess Notation */}
              <div style={{
                fontSize: '0.65rem',
                color: move.color === 'white' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'monospace',
                background: 'rgba(0, 0, 0, 0.15)',
                padding: '1px 4px',
                borderRadius: '3px',
                display: 'inline-block'
              }}>
                {move.notation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoveLog;