import React from 'react';

interface WinningPercentageBarProps {
  percentage: number; // 0-100, where 50 is equal, >50 favors white, <50 favors black
  sideBetter: 'white' | 'black' | 'equal';
}

const WinningPercentageBar: React.FC<WinningPercentageBarProps> = ({ percentage, sideBetter }) => {
  const whitePercentage = percentage;
  const blackPercentage = 100 - percentage;

  return (
    <div style={{
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Position Evaluation
        </div>
        <div style={{
          color: sideBetter === 'white' ? '#FFD700' : sideBetter === 'black' ? '#87CEEB' : '#90EE90',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          {sideBetter === 'equal' ? 'Equal Position' : `${sideBetter.charAt(0).toUpperCase() + sideBetter.slice(1)} is Better`}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'relative',
        height: '25px',
        background: 'linear-gradient(90deg, rgba(50, 50, 50, 0.8) 0%, rgba(50, 50, 50, 0.8) 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
      }}>
        {/* White side */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${whitePercentage}%`,
          background: whitePercentage > 55 
            ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)'
            : 'linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(240, 240, 240, 0.7) 100%)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: whitePercentage >= 100 ? '10px' : '10px 0 0 10px',
          boxShadow: whitePercentage > 55 ? '0 0 15px rgba(255, 215, 0, 0.4)' : 'none'
        }} />

        {/* Black side */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: `${blackPercentage}%`,
          background: blackPercentage > 55 
            ? 'linear-gradient(90deg, rgba(30, 30, 30, 0.9) 0%, rgba(135, 206, 235, 0.8) 100%)'
            : 'linear-gradient(90deg, rgba(80, 80, 80, 0.7) 0%, rgba(60, 60, 60, 0.8) 100%)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: blackPercentage >= 100 ? '10px' : '0 10px 10px 0',
          boxShadow: blackPercentage > 55 ? '0 0 15px rgba(135, 206, 235, 0.4)' : 'none'
        }} />

        {/* Center divider */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          height: '100%',
          width: '2px',
          background: 'rgba(255, 255, 255, 0.4)',
          transform: 'translateX(-50%)',
          zIndex: 2
        }} />

        {/* Percentage labels */}
        <div style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: whitePercentage > 55 ? '#000' : '#fff',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          textShadow: whitePercentage > 55 ? 'none' : '1px 1px 1px rgba(0,0,0,0.7)',
          zIndex: 3,
          transition: 'color 0.3s ease'
        }}>
          {Math.round(whitePercentage)}%
        </div>

        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: blackPercentage > 55 ? '#fff' : '#ccc',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px rgba(0,0,0,0.7)',
          zIndex: 3,
          transition: 'color 0.3s ease'
        }}>
          {Math.round(blackPercentage)}%
        </div>
      </div>

      {/* Player labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ fontSize: '1rem' }}>♔</span>
          <span style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8rem',
            fontWeight: whitePercentage > 50 ? 'bold' : 'normal'
          }}>
            White
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8rem',
            fontWeight: blackPercentage > 50 ? 'bold' : 'normal'
          }}>
            Black
          </span>
          <span style={{ fontSize: '1rem' }}>♚</span>
        </div>
      </div>
    </div>
  );
};

export default WinningPercentageBar;