# ♟️ Agentic-ChessMaster

Agentic-ChessMaster is an AI-powered interactive chess platform designed to enhance the gameplay experience for both human-vs-human and human-vs-AI scenarios. Built on a hybrid architecture with intelligent agents and cloud infrastructure, this project integrates reasoning engines, move tracking, and voice interactions to help players learn, analyze, and enjoy chess like never before.

---

## 🚀 Project Inspiration

In traditional online chess platforms, players often struggle to understand the reasoning behind recommended moves or to review their strategies meaningfully. Agentic-ChessMaster is inspired by the desire to provide a more agentic and explainable chess experience using advanced AI systems. The platform combines:
- Real-time strategy analysis
- Explainable move reasoning
- Voice-assisted interaction as a fun companion
- Seamless UI features for learning and feedback

---

## Key Features

### ✅ Dual Play Modes
- **Human vs Human**: Two-player mode
- **Human vs CPU (Stockfish)**: Compete against the classic Stockfish engine with added strategy and voice analysis.

### ✅ Intelligent Agent Modules
- **AI Strategy Analysis Agent**  
  Powered by Claude 3.5 (Anthropic), this agent analyzes the current FEN game state and provides strategy reasoning and suggestions for the next move.
  
- **AI Companion Voice Agent**  
  Uses the VAPI API to deliver spoken feedback, suggestions, and reasoning—great for immersive or educational play.

- **Move Logging Feature**  
  Logs each move and stores it in Google Cloud (Local Cache Store) for analysis and replay.

---

## System Architecture

![System Architecture](https://github.com/KikiSpace/agenticChessTutor/blob/main/chessmaster/assets/arch.png?raw=true)

### Frontend
- Built using `React` with custom chess UI (e.g., `react-chessboard`)
- Pages:
  - **Start Page**
  - **Play Page: Human vs Human**
  - **Play Page: Human vs CPU (Stockfish)**

### UI Components
- `Move Logs` (for display and storage)
- `AI Strategy Analysis Agent` (Claude-3.5)
- `AI Companion Voice Agent` (VAPI)

### Backend Services
- **Google Cloud Local Cache Store** for saving move logs
- **Claude-3.5** for natural language strategy generation
- **VAPI API** for voice assistant responses

---

## UI Flow

1. 🏁 **Start Page**
    - Users select between *Human vs Human* or *Human vs CPU* modes.
    ![gameselect](https://media.githubusercontent.com/media/KikiSpace/agenticChessTutor/main/chessmaster/assets/gameselect.GIF)
2. ♟️ **Play Page**
    - Depending on the selected mode, the game UI is rendered.
    ![pawnplay](https://media.githubusercontent.com/media/KikiSpace/agenticChessTutor/main/chessmaster/assets/pawnselect.GIF)

3. 🧠 **AI Strategy Analysis Agent**
    - Fetches current game FEN and sends it to Claude-3.5.
    - Returns the game situation explanation, reasoning, and next move suggestions.
    ![gameplay](https://media.githubusercontent.com/media/KikiSpace/agenticChessTutor/main/chessmaster/assets/gameplay.GIF)

4. 🗣️ **AI Voice Companion Agent**
    - You can have a lively conversation about the current board situation with your AI Voice Agent.

5. 💾 **Move Logs**
    - Game moves are recorded and cached via Google Cloud’s Local Cache Store.
    ![movelog](https://media.githubusercontent.com/media/KikiSpace/agenticChessTutor/main/chessmaster/assets/movelog.GIF)

---

## Tech Stack

- **Frontend**: React, TypeScript, react-chessboard
- **AI Agents**: Claude 3.5 (Anthropic), VAPI API
- **Storage**: Google Cloud Local Cache
- **Chess Engine**: Stockfish

---

## Contributor

Coming soon! Stay tuned for contribution guidelines and open-source collaboration.

---

## 📜 License

MIT License. See `LICENSE` for details.