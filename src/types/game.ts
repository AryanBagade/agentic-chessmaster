export type GameMode = 'human-vs-human' | 'human-vs-cpu';
export type PlayerColor = 'white' | 'black';
export type GameScreen = 'menu' | 'color-selection' | 'game';

export interface GameSettings {
  mode: GameMode;
  humanColor?: PlayerColor;
  cpuColor?: PlayerColor;
}