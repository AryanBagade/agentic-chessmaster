import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import ColorSelection from './components/ColorSelection';
import ChessGame from './components/ChessGame';
import { GameMode, PlayerColor, GameScreen, GameSettings } from './types/game';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    mode: 'human-vs-human'
  });

  const handleGameModeSelect = (mode: GameMode) => {
    setGameSettings({ mode });
    if (mode === 'human-vs-human') {
      // For human vs human, skip color selection and start game
      setCurrentScreen('game');
    } else {
      // For human vs CPU, show color selection
      setCurrentScreen('color-selection');
    }
  };

  const handleColorSelect = (color: PlayerColor) => {
    setGameSettings(prev => ({
      ...prev,
      humanColor: color,
      cpuColor: color === 'white' ? 'black' : 'white'
    }));
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setGameSettings({ mode: 'human-vs-human' });
  };

  const handleBackToColorSelection = () => {
    setCurrentScreen('color-selection');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu onGameModeSelect={handleGameModeSelect} />;
      
      case 'color-selection':
        return (
          <ColorSelection
            gameMode={gameSettings.mode}
            onColorSelect={handleColorSelect}
            onBack={handleBackToMenu}
          />
        );
      
      case 'game':
        return (
          <ChessGame
            gameSettings={gameSettings}
            onBackToMenu={handleBackToMenu}
            onBackToColorSelection={handleBackToColorSelection}
          />
        );
      
      default:
        return <MainMenu onGameModeSelect={handleGameModeSelect} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
