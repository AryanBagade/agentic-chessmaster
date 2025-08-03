import React, { useState, useRef, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Chess } from 'chess.js';
import VoiceTranscript from './VoiceTranscript';

interface VoiceChessBuddyProps {
  gameState: Chess;
  moveHistory: any[];
  isVsCpu: boolean;
  humanColor: string;
  currentAnalysis: any;
  isVisible: boolean;
}

const VoiceChessBuddy: React.FC<VoiceChessBuddyProps> = ({
  gameState,
  moveHistory,
  isVsCpu,
  humanColor,
  currentAnalysis,
  isVisible
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const vapiRef = useRef<any>(null);

  // Initialize VAPI
  useEffect(() => {
    const apiKey = process.env.REACT_APP_VAPI_API_KEY;
    const assistantId = process.env.REACT_APP_VAPI_ASSISTANT_ID;
    
    if (apiKey && assistantId) {
      try {
        vapiRef.current = new Vapi(apiKey);
        setupVapiEvents();
        setIsInitialized(true);
      } catch (error) {
        // VAPI initialization failed
      }
    }
  }, []);

  const setupVapiEvents = () => {
    if (!vapiRef.current) return;

    vapiRef.current.on('call-start', () => {
      setIsConnected(true);
      setIsListening(true);
      setShowTranscript(true);
    });

    vapiRef.current.on('call-end', () => {
      setIsConnected(false);
      setIsListening(false);
    });

    vapiRef.current.on('message', (message: any) => {
      if (message.type === 'transcript') {
        setTranscript(`${message.role}: ${message.transcript}`);
      }
    });

    vapiRef.current.on('error', (error: any) => {
      setIsConnected(false);
      setIsListening(false);
    });
  };

  const getChessContext = () => {
    const currentFen = gameState.fen();
    const lastMove = moveHistory[moveHistory.length - 1];
    const gameStatus = gameState.isCheck() ? 'Check' : 
                     gameState.isCheckmate() ? 'Checkmate' : 
                     gameState.isStalemate() ? 'Stalemate' : 'Active';
    
    const moveHistoryText = moveHistory.map((move, index) => 
      `${Math.floor(index/2) + 1}${index % 2 === 0 ? '.' : '...'} ${move.notation}`
    ).join(' ');

    return {
      position: currentFen,
      gameMode: isVsCpu ? 'Human vs CPU' : 'Human vs Human',
      humanColor: humanColor,
      gameStatus: gameStatus,
      moveHistory: moveHistoryText,
      lastMove: lastMove ? `${lastMove.notation}` : 'None',
      currentTurn: gameState.turn() === 'w' ? 'White' : 'Black',
      analysis: currentAnalysis ? {
        evaluation: currentAnalysis.positionEvaluation,
        winningPercentage: currentAnalysis.winningPercentage,
        suggestedMoves: currentAnalysis.suggestedMoves?.map((m: any) => m.move).join(', ')
      } : null
    };
  };

  const startVoiceChat = async () => {
    if (!vapiRef.current || !isInitialized) {
      return;
    }

    try {
      const assistantId = process.env.REACT_APP_VAPI_ASSISTANT_ID;
      await vapiRef.current.start(assistantId);
    } catch (error) {
      // Voice chat failed to start
    }
  };

  const endVoiceChat = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Voice Button */}
      <button
        onClick={isConnected ? endVoiceChat : startVoiceChat}
        disabled={!isInitialized}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: isConnected 
            ? 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' 
            : isInitialized 
              ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
              : 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: isInitialized ? 'pointer' : 'not-allowed',
          fontSize: '24px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isInitialized ? 1 : 0.5,
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
          animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none'
        }}
        onMouseEnter={(e) => {
          if (isInitialized) {
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title={!isInitialized ? 'Configure VAPI keys' : isConnected ? 'Stop voice chat' : 'Start voice chat'}
      >
        {!isInitialized ? '🔧' : isConnected ? '🔇' : '🎤'}
      </button>

      {/* Transcript Button - Only show when voice is active */}
      {isConnected && (
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '90px',
            background: showTranscript 
              ? 'linear-gradient(135deg, #9b59b6, #8e44ad)' 
              : 'linear-gradient(135deg, #34495e, #2c3e50)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={showTranscript ? 'Hide transcript' : 'Show transcript'}
        >
          💬
        </button>
      )}

      {/* Live Transcript Window */}
      <VoiceTranscript
        isVisible={showTranscript}
        isConnected={isConnected}
        currentTranscript={transcript}
        onClose={() => setShowTranscript(false)}
      />
    </>
  );
};

export default VoiceChessBuddy;