import React from 'react';

interface OpponentAnalysisWindowProps {
  opponentMoveAnalysis: string;
  positionEvaluation: string;
  opponentColor: 'white' | 'black';
  isVisible: boolean;
}

const OpponentAnalysisWindow: React.FC<OpponentAnalysisWindowProps> = ({ 
  opponentMoveAnalysis, 
  positionEvaluation, 
  opponentColor,
  isVisible 
}) => {
  if (!isVisible) return null;

  const gradientColor = opponentColor === 'white' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(240, 240, 240, 0.08))'
    : 'linear-gradient(135deg, rgba(50, 50, 50, 0.4), rgba(30, 30, 30, 0.6))';

  const borderColor = opponentColor === 'white'
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(100, 100, 100, 0.3)';

  const iconColor = opponentColor === 'white' ? '♔' : '♚';
  const colorName = opponentColor === 'white' ? 'White' : 'Black';

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
            {colorName} Analysis
          </h3>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold'
        }}>
          OPPONENT
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '15px' }}>
        {/* Last Move Analysis */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '0.9rem' }}>🎯</span>
            <h4 style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              Last Move
            </h4>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.8rem',
            lineHeight: '1.4'
          }}>
            {opponentMoveAnalysis || "Waiting for opponent's move..."}
          </div>
        </div>

        {/* Position Evaluation */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '0.9rem' }}>⚖️</span>
            <h4 style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              Position
            </h4>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.8rem',
            lineHeight: '1.4'
          }}>
            {positionEvaluation || "Analyzing position..."}
          </div>
        </div>
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
        animation: isVisible ? 'borderGlow 3s ease-in-out infinite' : 'none'
      }} />
    </div>
  );
};

export default OpponentAnalysisWindow;