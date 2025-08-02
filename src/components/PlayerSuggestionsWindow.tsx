import React, { useState } from 'react';

interface SuggestedMove {
  move: string;
  explanation: string;
  priority: 'high' | 'medium' | 'low';
}

interface PlayerSuggestionsWindowProps {
  suggestedMoves: SuggestedMove[];
  playerColor: 'white' | 'black';
  isVisible: boolean;
  isPlayerTurn: boolean;
}

const PlayerSuggestionsWindow: React.FC<PlayerSuggestionsWindowProps> = ({ 
  suggestedMoves, 
  playerColor,
  isVisible,
  isPlayerTurn 
}) => {
  const [selectedMove, setSelectedMove] = useState<number | null>(null);

  if (!isVisible) return null;

  const gradientColor = playerColor === 'white' 
    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 255, 255, 0.1))'
    : 'linear-gradient(135deg, rgba(135, 206, 235, 0.2), rgba(70, 130, 180, 0.1))';

  const borderColor = playerColor === 'white'
    ? 'rgba(255, 215, 0, 0.3)'
    : 'rgba(135, 206, 235, 0.3)';

  const iconColor = playerColor === 'white' ? '♔' : '♚';

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high': return '⭐';
      case 'medium': return '✨';
      case 'low': return '💭';
      default: return '💡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'rgba(255, 215, 0, 0.9)';
      case 'medium': return 'rgba(135, 206, 235, 0.8)';
      case 'low': return 'rgba(144, 238, 144, 0.7)';
      default: return 'rgba(255, 255, 255, 0.6)';
    }
  };

  return (
    <div style={{
      width: '280px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: isVisible ? 'slideInUp 0.5s ease-out' : 'none'
    }}>
      {/* Header */}
      <div style={{
        background: gradientColor,
        padding: '15px',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            fontSize: '1.3rem',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
          }}>
            {iconColor}
          </span>
          <h3 style={{
            margin: 0,
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.4)'
          }}>
            Your Move Ideas
          </h3>
        </div>
        <div style={{
          background: isPlayerTurn ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          color: isPlayerTurn ? '#90EE90' : 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold'
        }}>
          {isPlayerTurn ? 'YOUR TURN' : 'WAIT'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '15px' }}>
        {!isPlayerTurn ? (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem',
            padding: '20px',
            fontStyle: 'italic'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
            Waiting for opponent's move...
          </div>
        ) : suggestedMoves.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem',
            padding: '20px',
            fontStyle: 'italic'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤔</div>
            Analyzing moves...
          </div>
        ) : (
          <>
            {/* Move Buttons */}
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{
                margin: '0 0 10px 0',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                💡 Suggested Moves
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {suggestedMoves.map((move, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMove(selectedMove === index ? null : index)}
                    style={{
                      background: selectedMove === index 
                        ? `linear-gradient(135deg, ${getPriorityColor(move.priority)}, rgba(255,255,255,0.1))`
                        : 'rgba(255, 255, 255, 0.05)',
                      border: selectedMove === index 
                        ? `2px solid ${getPriorityColor(move.priority)}`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: selectedMove === index ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: selectedMove === index 
                        ? `0 4px 20px ${getPriorityColor(move.priority)}40`
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMove !== index) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMove !== index) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{getPriorityEmoji(move.priority)}</span>
                      <span>Move {index + 1}</span>
                    </div>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontFamily: 'monospace'
                    }}>
                      {move.move}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Move Explanation */}
            {selectedMove !== null && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${getPriorityColor(suggestedMoves[selectedMove].priority)}`,
                borderRadius: '10px',
                padding: '12px',
                animation: 'fadeInScale 0.3s ease-out'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <span>{getPriorityEmoji(suggestedMoves[selectedMove].priority)}</span>
                  <h4 style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    Move {selectedMove + 1} Explanation
                  </h4>
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.75rem',
                  lineHeight: '1.4',
                  background: 'rgba(0, 0, 0, 0.1)',
                  padding: '8px',
                  borderRadius: '6px'
                }}>
                  {suggestedMoves[selectedMove].explanation}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Animated border effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '15px',
        background: `linear-gradient(45deg, transparent, ${borderColor}, transparent)`,
        opacity: 0.3,
        pointerEvents: 'none',
        animation: isVisible && isPlayerTurn ? 'borderGlow 3s ease-in-out infinite' : 'none'
      }} />
    </div>
  );
};

export default PlayerSuggestionsWindow;