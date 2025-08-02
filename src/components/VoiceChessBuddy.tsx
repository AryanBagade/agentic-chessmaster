import React, { useState, useRef, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Chess } from 'chess.js';

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
  const vapiRef = useRef<any>(null);

  // Initialize VAPI
  useEffect(() => {
    // Debug ALL environment variables
    console.log('🐛 ALL ENV VARS:', process.env);
    console.log('🐛 ANTHROPIC KEY:', process.env.REACT_APP_ANTHROPIC_API_KEY);
    
    const apiKey = process.env.REACT_APP_VAPI_API_KEY;
    const assistantId = process.env.REACT_APP_VAPI_ASSISTANT_ID;
    
    console.log('🔑 API Key:', apiKey);
    console.log('🆔 Assistant ID:', assistantId);
    
    // Hardcode for testing
    const hardcodedApiKey = '3c1f3d85-1c46-4991-8d35-95903bedbf9d';
    const hardcodedAssistantId = '082aabbc-e4d8-4306-a342-5f0465fe4ace';
    
    console.log('🧪 Using hardcoded values for testing');
    console.log('🔑 Hardcoded API Key:', hardcodedApiKey);
    console.log('🆔 Hardcoded Assistant ID:', hardcodedAssistantId);
    
    if (hardcodedApiKey && hardcodedAssistantId) {
      try {
        vapiRef.current = new Vapi(hardcodedApiKey);
        setupVapiEvents();
        setIsInitialized(true);
        console.log('🎤 VAPI initialized successfully with hardcoded key');
      } catch (error) {
        console.error('❌ Failed to initialize VAPI:', error);
      }
    } else {
      console.warn('⚠️ VAPI API key or Assistant ID not found');
    }
  }, []);

  const setupVapiEvents = () => {
    if (!vapiRef.current) return;

    vapiRef.current.on('call-start', () => {
      setIsConnected(true);
      setIsListening(true);
      console.log('🎤 Voice chat started');
    });

    vapiRef.current.on('call-end', () => {
      setIsConnected(false);
      setIsListening(false);
      console.log('🔇 Voice chat ended');
    });

    vapiRef.current.on('message', (message: any) => {
      if (message.type === 'transcript') {
        setTranscript(`${message.role}: ${message.transcript}`);
        console.log('📝 Voice transcript:', message);
      }
    });

    vapiRef.current.on('error', (error: any) => {
      console.error('❌ VAPI Error:', error);
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
      console.error('❌ VAPI not initialized');
      return;
    }

    try {
      const hardcodedAssistantId = '082aabbc-e4d8-4306-a342-5f0465fe4ace';
      
      console.log('🎤 Starting voice chat with hardcoded Assistant ID:', hardcodedAssistantId);
      console.log('🎤 Using VAPI instance:', vapiRef.current);
      
      // Simple start with just assistant ID
      await vapiRef.current.start(hardcodedAssistantId);
      
    } catch (error) {
      console.error('❌ Failed to start voice chat:', error);
      console.error('❌ Error details:', error);
    }
  };

  const endVoiceChat = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  if (!isVisible) return null;

  return (
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
  );
};

export default VoiceChessBuddy;