# Imagine API

A simple image generation API using Google's Gemini AI, packaged as an MCP (Model Context Protocol) server.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3001
   ```
   You can get an API key from the [Google AI Studio](https://ai.google.dev/).

## Usage

### Starting the server

Run the server with:

```
npm start
```

Or in development mode with auto-restart on file changes:

```
npm run dev
```

The server will start on port 3001 (or the port specified in your .env file).

### Connecting to the server

The server implements the Model Context Protocol (MCP), which allows clients to interact with it using a standardized interface. 

#### Available Tools

The server provides the following tools:

**generate-image**
- Parameters:
  - `prompt` (string, required): Description of the image to generate
  - `numberOfImages` (number, optional, default: 1): Number of images to generate (1-4)
  - `aspectRatio` (string, optional, default: "1:1"): Aspect ratio (e.g. '1:1', '16:9', '4:3', '9:16')

### MCP Protocol Connection

To connect to the server using MCP:

1. Connect to the SSE endpoint at `/sse`
2. Send messages to `/messages?sessionId=<your-session-id>`

## License

MIT
