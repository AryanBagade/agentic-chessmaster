import React from 'react';
import { GameMode } from '../types/game';

interface MainMenuProps {
  onGameModeSelect: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onGameModeSelect }) => {
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
        <h1 style={{
          color: 'white',
          fontSize: '3rem',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          ♔ Chess Game ♛
        </h1>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.2rem',
          marginBottom: '40px'
        }}>
          Choose your game mode
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <button
            onClick={() => onGameModeSelect('human-vs-cpu')}
            style={{
              padding: '20px 40px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 107, 107, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.3)';
            }}
          >
            🤖 Human vs CPU
          </button>

          <button
            onClick={() => onGameModeSelect('human-vs-human')}
            style={{
              padding: '20px 40px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(78, 205, 196, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.3)';
            }}
          >
            👥 Human vs Human
          </button>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>Game Features:</h3>
          <ul style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'left',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '20px'
          }}>
            <li>Full chess rules implementation</li>
            <li>Stockfish AI engine for CPU opponent</li>
            <li>Beautiful visual interface</li>
            <li>Move validation and game status</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;