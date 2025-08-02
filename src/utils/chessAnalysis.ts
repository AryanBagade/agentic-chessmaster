import Anthropic from '@anthropic-ai/sdk';
import { Chess } from 'chess.js';

interface AnalysisResult {
  positionEvaluation: string;
  winningPercentage: number;
  sideBetter: 'white' | 'black' | 'equal';
  opponentMoveAnalysis: string;
  suggestedMoves: Array<{
    move: string;
    explanation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

class ChessAnalyzer {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    this.anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async analyzePosition(
    currentFen: string,
    lastMove: any,
    isHumanWhite: boolean,
    moveHistory: any[]
  ): Promise<AnalysisResult> {
    try {
      const game = new Chess(currentFen);
      const humanColor = isHumanWhite ? 'white' : 'black';
      const opponentColor = isHumanWhite ? 'black' : 'white';
      
      // Get legal moves for analysis
      const legalMoves = game.moves({ verbose: true });
      const topMoves = legalMoves.slice(0, 8).map(move => `${move.from}${move.to}`).join(', ');
      
      console.log('🎯 LEGAL MOVES CALCULATED:', legalMoves.map(m => `${m.from}${m.to} (${m.san})`));

      // Create a fresh game instance to ensure accurate analysis
      const analysisGame = new Chess(currentFen);
      const gameStatus = analysisGame.isCheck() ? ' (CHECK!)' : 
                        analysisGame.isCheckmate() ? ' (CHECKMATE!)' : 
                        analysisGame.isStalemate() ? ' (STALEMATE!)' : '';
      
      // Build complete move history for context
      const fullMoveHistory = moveHistory.map((move, index) => 
        `${Math.floor(index/2) + 1}${index % 2 === 0 ? '.' : '...'} ${move.notation}`
      ).join(' ');
      
      // Get detailed board description
      const board = analysisGame.board();
      let boardDescription = '';
      for (let rank = 7; rank >= 0; rank--) {
        for (let file = 0; file < 8; file++) {
          const piece = board[rank][file];
          if (piece) {
            const square = String.fromCharCode(97 + file) + (rank + 1);
            const pieceSymbol = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
            boardDescription += `${square}:${pieceSymbol} `;
          }
        }
      }
      
      // LOG EVERYTHING WE'RE SENDING TO AI
      console.log('🚨 DEBUG - EXACT DATA BEING SENT TO ANTHROPIC:');
      console.log('FEN:', currentFen);
      console.log('Legal moves:', topMoves);
      console.log('Move history:', fullMoveHistory);
      console.log('Last move:', lastMove);
      console.log('Board description:', boardDescription);
      console.log('Human color:', humanColor);
      
      // Determine who to analyze for
      const currentTurnColor = analysisGame.turn() === 'w' ? 'white' : 'black';
      const isAnalyzingForHuman = currentTurnColor === humanColor;
      
      const prompt = `You are Magnus Carlsen analyzing this chess position. Think like a 2800+ rated grandmaster.

CRITICAL: You are suggesting moves for the HUMAN PLAYER who plays ${humanColor.toUpperCase()}

CURRENT POSITION: ${currentFen}
PLAYER TO MOVE NOW: ${currentTurnColor.toUpperCase()}
HUMAN PLAYER COLOR: ${humanColor.toUpperCase()}
OPPONENT COLOR: ${opponentColor.toUpperCase()}

${isAnalyzingForHuman ? 
  `🎯 ANALYZE FOR HUMAN (${humanColor.toUpperCase()}) - IT'S THEIR TURN` : 
  `⏳ OPPONENT (${currentTurnColor.toUpperCase()}) TO MOVE - WAIT FOR THEIR MOVE`}

GAME HISTORY: ${fullMoveHistory}
LAST MOVE: ${lastMove ? `${lastMove.san}` : 'Opening position'}

AVAILABLE LEGAL MOVES FOR ${currentTurnColor.toUpperCase()}: ${topMoves}

GRANDMASTER ANALYSIS REQUIRED:
🧠 DEEP POSITIONAL EVALUATION:
- Material balance and piece activity
- King safety and pawn structure
- Control of key squares (center, outposts)
- Piece coordination and harmony
- Endgame considerations

⚡ TACTICAL CALCULATIONS:
- Immediate tactical shots (pins, forks, skewers)
- Combination possibilities 2-3 moves deep
- Sacrificial ideas for attack
- Defensive resources and counterplay

🎯 STRATEGIC PLANNING:
- Long-term positional goals
- Weak squares and piece improvement
- Pawn breaks and space advantage
- Initiative and tempo considerations

🔥 CONCRETE VARIATIONS:
Calculate 2-3 moves ahead for top candidates like a super-GM would.

CRITICAL: Only suggest moves from the legal list: ${topMoves}
Format: from+to squares (e2e4, g1f3, etc.)

Return ONLY valid JSON in this format:

{
  "positionEvaluation": "Grandmaster-level evaluation: material, positional factors, who stands better and why",
  "winningPercentage": number_between_0_and_100,
  "sideBetter": "white" or "black" or "equal",
  "opponentMoveAnalysis": "Deep analysis of opponent's last move: tactical/positional motives, threats created, weaknesses",
  "suggestedMoves": [
    {
      "move": "legal_move_from_list",
      "explanation": "Grandmaster reasoning: tactical justification, positional benefits, concrete variations",
      "priority": "high"
    },
    {
      "move": "second_best_legal_move",
      "explanation": "Alternative with deep analysis: why this works, what it achieves strategically",
      "priority": "medium"  
    },
    {
      "move": "third_option_legal_move",
      "explanation": "Solid option with grandmaster insight: long-term planning, piece improvement",
      "priority": "low"
    }
  ]
}

CRITICAL REQUIREMENTS:
${isAnalyzingForHuman ? 
  `🎯 SUGGEST MOVES FOR HUMAN (${humanColor.toUpperCase()}) FROM: ${topMoves}
🧠 Think 2-3 moves ahead with concrete variations
⚡ Identify tactical shots, combinations, threats  
🔥 Provide grandmaster-level strategic insights for HUMAN PLAYER
💎 Give engine-strength positional evaluation` :
  `⏳ OPPONENT'S TURN - DO NOT SUGGEST MOVES
🔍 Analyze opponent's position and threats
📊 Evaluate position for when human moves next
🚫 LEAVE suggestedMoves ARRAY EMPTY - NOT HUMAN'S TURN`}

Return ONLY the JSON.`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
      
      // LOG AI RESPONSE
      console.log('🤖 RAW AI RESPONSE:', responseText);
      
      try {
        const analysis = JSON.parse(responseText);
        console.log('✅ PARSED AI ANALYSIS:', analysis);
        return analysis;
      } catch (parseError) {
        console.error('❌ FAILED TO PARSE AI RESPONSE:', parseError);
        console.error('❌ RAW RESPONSE WAS:', responseText);
        return this.getFallbackAnalysis(game, lastMove, humanColor);
      }

    } catch (error) {
      console.error('Chess analysis failed:', error);
      return this.getFallbackAnalysis(new Chess(currentFen), lastMove, isHumanWhite ? 'white' : 'black');
    }
  }

  private getFallbackAnalysis(game: Chess, lastMove: any, humanColor: string): AnalysisResult {
    const moves = game.moves({ verbose: true });
    const material = this.calculateMaterial(game);
    
    return {
      positionEvaluation: material.white > material.black ? "White has more pieces" : 
                         material.black > material.white ? "Black has more pieces" : "Equal material",
      winningPercentage: 50 + (material.white - material.black) * 2,
      sideBetter: material.white > material.black ? 'white' : 
                 material.black > material.white ? 'black' : 'equal',
      opponentMoveAnalysis: lastMove ? `Opponent moved ${lastMove.piece} to control space` : "Game just started",
      suggestedMoves: moves.slice(0, 2).map(move => ({
        move: `${move.from}${move.to}`,
        explanation: `Move ${move.piece} to ${move.to} for better position`,
        priority: 'medium' as const
      }))
    };
  }

  private calculateMaterial(game: Chess): { white: number; black: number } {
    const board = game.board();
    let white = 0, black = 0;
    
    const values: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    };

    board.forEach(row => {
      row.forEach(square => {
        if (square) {
          const value = values[square.type] || 0;
          if (square.color === 'w') white += value;
          else black += value;
        }
      });
    });

    return { white, black };
  }

  logAnalysis(analysis: AnalysisResult, isHumanTurn: boolean) {
    console.log('\n🏆 ===== CHESS ANALYSIS ===== 🏆');
    console.log(`📊 Position: ${analysis.positionEvaluation}`);
    console.log(`📈 Winning %: ${analysis.winningPercentage}% (${analysis.sideBetter} is better)`);
    console.log(`🔍 Opponent's last move: ${analysis.opponentMoveAnalysis}`);
    
    if (isHumanTurn && analysis.suggestedMoves.length > 0) {
      console.log('\n💡 SUGGESTED MOVES FOR YOU:');
      analysis.suggestedMoves.forEach((suggestion, index) => {
        const emoji = suggestion.priority === 'high' ? '⭐' : 
                     suggestion.priority === 'medium' ? '✨' : '💭';
        console.log(`${emoji} ${index + 1}. ${suggestion.move} - ${suggestion.explanation}`);
      });
    }
    console.log('\n================================\n');
  }
}

export default ChessAnalyzer;