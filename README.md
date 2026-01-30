# AI Story Adventure

An interactive text-image adventure game powered by AI. Players make choices to progress through a story, with each step featuring AI-generated narrative text and images.

## Features

- **Multi-language support**: English, Chinese, Spanish, French, German, Japanese, Korean
- **Multiple genres**: Fantasy, Sci-Fi, Horror, Romance, Mystery, Adventure, Historical, Comedy
- **Customizable story tone**: Light & Fun, Serious & Dark, Epic & Grand, Whimsical
- **Flexible story length**: ~10, ~20, 30-50, 50-100 steps, or unlimited
- **Custom themes**: Add specific elements you want in your story
- **AI-generated images**: Each story step includes a matching illustration

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4o (text) + DALL-E 3 (images)

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd text-image-game
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Create `.env` file in the server directory:
```
OPENAI_API_KEY=your_api_key_here
PORT=3001
```

4. Install client dependencies:
```bash
cd ../client
npm install
```

### Running the App

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

3. Open http://localhost:3000 in your browser

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # CSS styles
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models (for future DB)
│   │   └── config/         # Configuration
│   └── ...
└── README.md
```

## Future Enhancements

- [ ] Database integration for save/load functionality
- [ ] User authentication
- [ ] Story history gallery
- [ ] Share stories with others
- [ ] Multiple AI model options
