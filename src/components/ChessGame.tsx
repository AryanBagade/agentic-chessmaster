import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { GameSettings } from '../types/game';
import StockfishEngine from '../utils/stockfish';

interface ChessGameProps {
  gameSettings: GameSettings;
  onBackToMenu: () => void;
  onBackToColorSelection: () => void;
}

const ChessGame: React.FC<ChessGameProps> = ({ gameSettings, onBackToMenu, onBackToColorSelection }) => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<string>('');
  const [moveTo, setMoveTo] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState<any>({});
  const [isThinking, setIsThinking] = useState(false);
  const stockfishRef = useRef<StockfishEngine | null>(null);

  const gamePosition = useMemo(() => game.fen(), [game]);
  const currentPlayer = useMemo(() => game.turn() === 'w' ? 'White' : 'Black', [game]);
  const isGameOver = useMemo(() => game.isGameOver(), [game]);
  const gameStatus = useMemo(() => {
    if (game.isCheckmate()) return 'Checkmate';
    if (game.isStalemate()) return 'Stalemate';
    if (game.isDraw()) return 'Draw';
    if (game.isCheck()) return 'Check';
    return 'Playing';
  }, [game]);

  const isVsCpu = gameSettings.mode === 'human-vs-cpu';
  const isHumanTurn = useMemo(() => {
    if (!isVsCpu) return true;
    const currentColor = game.turn() === 'w' ? 'white' : 'black';
    return currentColor === gameSettings.humanColor;
  }, [game, isVsCpu, gameSettings.humanColor]);

  // Initialize Stockfish for CPU games
  useEffect(() => {
    if (isVsCpu && !stockfishRef.current) {
      stockfishRef.current = new StockfishEngine();
    }
    
    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.destroy();
        stockfishRef.current = null;
      }
    };
  }, [isVsCpu]);

  // Handle CPU moves
  useEffect(() => {
    if (isVsCpu && !isHumanTurn && !isGameOver && !isThinking) {
      makeCpuMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVsCpu, isHumanTurn, isGameOver, game]);

  async function makeCpuMove() {
    if (!stockfishRef.current || isThinking) return;
    
    setIsThinking(true);
    
    try {
      const bestMove = await stockfishRef.current.getBestMove(game.fen());
      
      if (bestMove && bestMove.length >= 4) {
        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        const promotion = bestMove.length > 4 ? bestMove.slice(4) : undefined;
        
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({
          from,
          to,
          promotion: promotion || 'q',
        });
        
        if (move) {
          setGame(gameCopy);
        }
      }
    } catch (error) {
      console.error('Error making CPU move:', error);
    } finally {
      setIsThinking(false);
    }
  }

  function onSquareClick({ square }: { square: string }) {
    // Prevent moves when it's CPU turn or game is over
    if ((isVsCpu && !isHumanTurn) || isGameOver || isThinking) return;
    
    setOptionSquares({});

    if (!moveFrom) {
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setMoveFrom(square);
        getMoveOptions(square);
      }
      return;
    }

    if (!moveTo) {
      const moves = game.moves({
        square: moveFrom as any,
        verbose: true,
      });

      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );

      if (!foundMove) {
        const piece = game.get(square as any);
        if (piece && piece.color === game.turn()) {
          setMoveFrom(square);
          getMoveOptions(square);
        } else {
          setMoveFrom('');
        }
        return;
      }

      if (
        (foundMove.piece === 'p' &&
          ((foundMove.color === 'w' && foundMove.to[1] === '8') ||
            (foundMove.color === 'b' && foundMove.to[1] === '1')))
      ) {
        setMoveTo(square);
        setShowPromotionDialog(true);
        return;
      }

      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: 'q',
      });

      if (move === null) {
        const piece = game.get(square as any);
        if (piece && piece.color === game.turn()) {
          setMoveFrom(square);
          getMoveOptions(square);
        } else {
          setMoveFrom('');
        }
        return;
      }

      setGame(gameCopy);
      setMoveFrom('');
      setMoveTo(null);
    }
  }

  function getMoveOptions(square: string) {
    const moves = game.moves({
      square: square as any,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares: any = {};
    moves.map((move) => {
      const targetPiece = game.get(move.to as any);
      const sourcePiece = game.get(square as any);
      newSquares[move.to] = {
        background:
          targetPiece && sourcePiece && targetPiece.color !== sourcePiece.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
  }

  function onPromotionPieceSelect(piece?: string) {
    if (piece && moveFrom && moveTo) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() || 'q',
      });
      setGame(gameCopy);
    }

    setMoveFrom('');
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
  }

  function resetGame() {
    setGame(new Chess());
    setMoveFrom('');
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Navigation */}
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button
          onClick={isVsCpu ? onBackToColorSelection : onBackToMenu}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 15px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          ← Back
        </button>
        <button
          onClick={onBackToMenu}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 15px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🏠 Menu
        </button>
      </div>

      <div style={{ 
        marginBottom: '20px', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 15px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          {isVsCpu ? '🤖 Human vs CPU' : '👥 Human vs Human'}
        </h1>
        
        {isVsCpu && (
          <div style={{ marginBottom: '10px', fontSize: '14px', opacity: 0.8 }}>
            You are playing as {gameSettings.humanColor === 'white' ? '♔ White' : '♚ Black'}
          </div>
        )}
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Current Player: {currentPlayer}</strong>
          {isVsCpu && isThinking && (
            <span style={{ marginLeft: '10px', color: '#FFD700' }}>
              🤔 CPU is thinking...
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status: {gameStatus}</strong>
        </div>
        
        {isGameOver && (
          <div style={{ color: '#FF6B6B', fontWeight: 'bold', marginBottom: '15px', fontSize: '18px' }}>
            🎮 Game Over!
          </div>
        )}
        
        <button 
          onClick={resetGame}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
        >
          🔄 Reset Game
        </button>
      </div>

      <div style={{ width: '560px', maxWidth: '90vw' }}>
        <Chessboard
          options={{
            position: gamePosition,
            onSquareClick: onSquareClick,
            squareStyles: optionSquares,
            boardOrientation: isVsCpu ? (gameSettings.humanColor || 'white') : 'white',
            animationDurationInMs: 200,
            allowDragging: false,
          }}
        />
      </div>

      {showPromotionDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>Choose promotion piece:</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {['wQ', 'wR', 'wB', 'wN'].map((piece) => (
                <button
                  key={piece}
                  onClick={() => onPromotionPieceSelect(piece)}
                  style={{
                    padding: '10px',
                    fontSize: '24px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {piece[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;