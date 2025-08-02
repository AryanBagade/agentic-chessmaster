import React, { useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface ChessGameProps {}

const ChessGame: React.FC<ChessGameProps> = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<string>('');
  const [moveTo, setMoveTo] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState<any>({});

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

  function onSquareClick({ square }: { square: string }) {
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1>Chess Game</h1>
        <div style={{ marginBottom: '10px' }}>
          <strong>Current Player: {currentPlayer}</strong>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Status: {gameStatus}</strong>
        </div>
        {isGameOver && (
          <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
            Game Over!
          </div>
        )}
        <button 
          onClick={resetGame}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset Game
        </button>
      </div>

      <div style={{ width: '560px', maxWidth: '90vw' }}>
        <Chessboard
          options={{
            position: gamePosition,
            onSquareClick: onSquareClick,
            squareStyles: optionSquares,
            boardOrientation: 'white',
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