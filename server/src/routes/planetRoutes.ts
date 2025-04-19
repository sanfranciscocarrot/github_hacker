import express from 'express';
import { PlanetRAG } from '../services/planetRag';

const router = express.Router();
const planetRAG = new PlanetRAG();

// Initialize the mock RAG system
planetRAG.initialize('mock')
    .then(() => console.log('Mock RAG system initialized successfully'))
    .catch(error => {
        console.error('Failed to initialize mock RAG system:', error);
    });

router.post('/query', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ 
                error: 'Question is required',
                details: 'Please provide a question in the request body'
            });
        }

        console.log('Received query:', question);
        const results = await planetRAG.query(question);
        
        if (!results || results.length === 0) {
            return res.status(404).json({
                error: 'No results found',
                details: 'The system could not find relevant information for your question'
            });
        }

        res.json({ 
            results,
            count: results.length
        });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

export default router; 