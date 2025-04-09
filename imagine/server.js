import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { generateImage } from "./imageGen.js";
import dotenv from "dotenv";
import { z } from "zod";

// Set up environment variables
dotenv.config();

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in environment variables');
  console.error('Please create a .env file with your Gemini API key');
  process.exit(1);
}

// Create MCP server
const server = new McpServer({
  name: "imagine-server",
  version: "1.0.0"
});

// Register the image generation tool
server.tool(
  "generate-image",
  {
    prompt: z.string().describe("Description of the image to generate"),
    numberOfImages: z.number().min(1).max(4).default(1).describe("Number of images to generate (1-4)"),
    aspectRatio: z.string().default("1:1").describe("Aspect ratio (e.g. '1:1', '16:9', '4:3', '9:16')")
  },
  async ({ prompt, numberOfImages, aspectRatio }) => {
    try {
      console.log(`Generating ${numberOfImages} image(s) with prompt: "${prompt}"`);
      console.log(`Aspect ratio: ${aspectRatio}`);
      
      // Call the image generation function
      const response = await generateImage(prompt, numberOfImages, aspectRatio);
      
      let idx = 1;
      let content = [];
      for (const generatedImage of response.generatedImages) {
        let imgBytes = generatedImage.image.imageBytes;
        content.push({
          type: "image",
          data: imgBytes,
          mimeType: "image/png"
        });
      }
    
      // Return the result
      return {
        content: content, 
        isError: false
      };
    } catch (error) {
      console.error('Error generating image:', error);
      return {
        content: [
          { 
            type: "text", 
            text: `Error generating image: ${error.message}` 
          }
        ],
        isError: true
      };
    }
  }
);

// Set up express app
const app = express();
const PORT = process.env.PORT || 3001;

// Object to store transports by sessionId
const transports = {};

// SSE endpoint
app.get("/sse", async (_, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  
  res.on("close", () => {
    console.log(`Connection closed for session ${transport.sessionId}`);
    delete transports[transport.sessionId];
  });
  
  await server.connect(transport);
});

// Message handling endpoint
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Image generation server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`Use the MCP protocol to connect to this server and generate images`);
});