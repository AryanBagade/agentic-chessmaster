import React from 'react';
import { GameMode, PlayerColor } from '../types/game';

interface ColorSelectionProps {
  gameMode: GameMode;
  onColorSelect: (color: PlayerColor) => void;
  onBack: () => void;
}

const ColorSelection: React.FC<ColorSelectionProps> = ({ gameMode, onColorSelect, onBack }) => {
  const isVsCpu = gameMode === 'human-vs-ai-basic' || gameMode === 'human-vs-ai-guided';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 15px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: 'white',
          fontSize: '2.5rem',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Choose Your Color
        </h1>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.2rem',
          marginBottom: '40px'
        }}>
          {isVsCpu ? 'Select which color you want to play as against the AI' : 'White plays first'}
        </p>

        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div
            onClick={() => onColorSelect('white')}
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              borderRadius: '20px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: '3px solid transparent',
              minWidth: '150px',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
              e.currentTarget.style.border = '3px solid #FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              e.currentTarget.style.border = '3px solid transparent';
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>♔</div>
            <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '1.5rem' }}>White</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '1rem' }}>
              {isVsCpu ? 'You play as White against AI' : 'First player'}
            </p>
          </div>

          <div
            onClick={() => onColorSelect('black')}
            style={{
              background: 'linear-gradient(145deg, #2c2c2c, #1a1a1a)',
              borderRadius: '20px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              border: '3px solid transparent',
              minWidth: '150px',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
              e.currentTarget.style.border = '3px solid #FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
              e.currentTarget.style.border = '3px solid transparent';
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '15px', color: 'white' }}>♚</div>
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.5rem' }}>Black</h3>
            <p style={{ color: '#ccc', margin: 0, fontSize: '1rem' }}>
              {isVsCpu ? 'You play as Black against AI' : 'Second player'}
            </p>
          </div>
        </div>

        {isVsCpu && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              fontSize: '1rem'
            }}>
              💡 The AI will be powered by Stockfish engine for challenging gameplay
              {gameMode === 'human-vs-ai-guided' && (
                <span style={{ display: 'block', marginTop: '5px' }}>
                  🧠 Plus you'll get AI analysis and move suggestions!
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorSelection;