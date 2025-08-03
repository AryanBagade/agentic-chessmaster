export type GameMode = 'human-vs-human' | 'human-vs-ai-basic' | 'human-vs-ai-guided';
export type PlayerColor = 'white' | 'black';
export type GameScreen = 'menu' | 'color-selection' | 'game';

export interface GameSettings {
  mode: GameMode;
  humanColor?: PlayerColor;
  cpuColor?: PlayerColor;
  hasAIGuide?: boolean;
}