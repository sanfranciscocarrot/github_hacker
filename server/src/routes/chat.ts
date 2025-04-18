import express from 'express';
import { ChatService } from '../services/chat';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const router = express.Router();

// Initialize vector store with OpenAI embeddings
const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
const chatService = new ChatService(vectorStore);

// Add CORS headers to all routes
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Handle OPTIONS requests
router.options('*', (req, res) => {
    res.sendStatus(200);
});

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required',
                details: 'Please provide a message in the request body'
            });
        }

        console.log('Received chat message:', message);
        const response = await chatService.chat({ role: 'user', content: message });
        console.log('Sending chat response');
        
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

export { router as chatRouter }; 