import React, { useState, useEffect, useRef } from 'react';

interface TranscriptMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isComplete: boolean;
}

interface VoiceTranscriptProps {
  isVisible: boolean;
  isConnected: boolean;
  currentTranscript: string;
  onClose: () => void;
}

const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  isVisible,
  isConnected,
  currentTranscript,
  onClose
}) => {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process incoming transcript
  useEffect(() => {
    if (currentTranscript && currentTranscript.trim()) {
      const [role, ...textParts] = currentTranscript.split(': ');
      const text = textParts.join(': ');
      
      if (text && text.trim()) {
        const messageRole = role.toLowerCase().includes('assistant') ? 'assistant' : 'user';
        
        setMessages(prev => {
          // Check if this is updating the last message (streaming)
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === messageRole && !lastMessage.isComplete) {
            // Update the last message
            return prev.map((msg, index) => 
              index === prev.length - 1 
                ? { ...msg, text: text.trim(), timestamp: new Date() }
                : msg
            );
          } else {
            // Add new message
            return [...prev, {
              id: `${Date.now()}-${Math.random()}`,
              role: messageRole,
              text: text.trim(),
              timestamp: new Date(),
              isComplete: false
            }];
          }
        });
      }
    }
  }, [currentTranscript]);

  // Mark messages as complete when transcript stops updating
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => ({ ...msg, isComplete: true }))
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentTranscript]);

  const clearTranscript = () => {
    setMessages([]);
  };

  const getMessageAnalysis = (text: string) => {
    const wordCount = text.split(' ').length;
    const hasChessTerms = /\b(chess|move|piece|king|queen|rook|bishop|knight|pawn|check|checkmate|castle|en passant|fork|pin|skewer|sacrifice|gambit|opening|endgame|middle game|position|tactic|strategy)\b/i.test(text);
    const hasPositionalTerms = /\b(center|flank|file|rank|diagonal|square|control|pressure|weakness|strength|development|tempo)\b/i.test(text);
    const hasEvaluationTerms = /\b(good|bad|excellent|poor|strong|weak|better|worse|advantage|disadvantage|winning|losing|equal|balanced)\b/i.test(text);
    
    return {
      wordCount,
      hasChessTerms,
      hasPositionalTerms,
      hasEvaluationTerms,
      sentiment: hasEvaluationTerms ? 'evaluative' : hasChessTerms ? 'technical' : 'general'
    };
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: isMinimized ? '300px' : '400px',
      height: isMinimized ? '60px' : '500px',
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '15px',
        borderRadius: '15px 15px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isConnected ? '#4CAF50' : '#f44336',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }}></div>
          🎤 Voice Transcript
          {isConnected && (
            <span style={{
              fontSize: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '8px'
            }}>
              LIVE
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '12px'
            }}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          <button
            onClick={clearTranscript}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '12px'
            }}
          >
            🗑️
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                padding: '20px',
                fontStyle: 'italic'
              }}>
                {isConnected ? 'Conversation will appear here...' : 'Start voice chat to see transcript'}
              </div>
            ) : (
              messages.map((message) => {
                const analysis = getMessageAnalysis(message.text);
                return (
                  <div
                    key={message.id}
                    style={{
                      background: message.role === 'assistant' 
                        ? 'rgba(103, 126, 234, 0.2)' 
                        : 'rgba(118, 75, 162, 0.2)',
                      borderRadius: '10px',
                      padding: '12px',
                      borderLeft: `3px solid ${message.role === 'assistant' ? '#677eea' : '#764ba2'}`,
                      animation: !message.isComplete ? 'pulse 1.5s ease-in-out infinite' : 'none'
                    }}
                  >
                    {/* Message Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: message.role === 'assistant' ? '#677eea' : '#764ba2'
                        }}>
                          {message.role === 'assistant' ? '🤖 Chess Buddy' : '👤 You'}
                        </span>
                        {!message.isComplete && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#4CAF50',
                            animation: 'pulse 1s infinite'
                          }}></div>
                        )}
                      </div>
                      <span style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}>
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>

                    {/* Message Text */}
                    <div style={{
                      color: 'white',
                      fontSize: '13px',
                      lineHeight: '1.4',
                      marginBottom: '8px'
                    }}>
                      {message.text}
                    </div>

                    {/* Message Analysis */}
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        {analysis.wordCount} words
                      </span>
                      {analysis.hasChessTerms && (
                        <span style={{
                          fontSize: '10px',
                          background: 'rgba(76, 175, 80, 0.3)',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          color: '#90EE90'
                        }}>
                          ♟️ Chess
                        </span>
                      )}
                      {analysis.hasPositionalTerms && (
                        <span style={{
                          fontSize: '10px',
                          background: 'rgba(33, 150, 243, 0.3)',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          color: '#87CEEB'
                        }}>
                          📊 Position
                        </span>
                      )}
                      {analysis.hasEvaluationTerms && (
                        <span style={{
                          fontSize: '10px',
                          background: 'rgba(255, 193, 7, 0.3)',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          color: '#FFD700'
                        }}>
                          ⭐ Analysis
                        </span>
                      )}
                      <span style={{
                        fontSize: '10px',
                        background: 'rgba(156, 39, 176, 0.3)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        color: '#DDA0DD'
                      }}>
                        {analysis.sentiment}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              {messages.length} messages
            </div>
            {isConnected && (
              <div style={{
                fontSize: '11px',
                color: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  animation: 'pulse 1s infinite'
                }}></div>
                Recording
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceTranscript;