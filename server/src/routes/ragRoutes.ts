import express from 'express';
import { RAGService } from '../services/ragService';
import { Document } from 'langchain/document';

const router = express.Router();
const ragService = new RAGService();

// Initialize the RAG system with some initial documents
const initialDocuments = [
  new Document({
    pageContent: `The Theory of Interstellar Trade by Paul Krugman (1978) explores how trade would work between planets in different star systems, taking into account relativistic effects. Key concepts include:
    - Time dilation affects the calculation of interest rates
    - Trade must account for the different rates of time passage
    - Interest rates must be calculated in the appropriate reference frame`,
    metadata: { source: 'krugman_paper', type: 'theory' }
  }),
  new Document({
    pageContent: `In interstellar trade, time dilation occurs due to the high velocities of spacecraft. This means that:
    - Time passes more slowly for the traveling ship than for observers on Earth
    - This effect must be factored into trade calculations
    - The Lorentz factor (γ) determines the amount of time dilation`,
    metadata: { source: 'physics_notes', type: 'theory' }
  })
];

// Initialize RAG system
ragService.initialize(initialDocuments)
  .then(() => console.log('RAG system initialized successfully'))
  .catch(error => {
    console.error('Failed to initialize RAG system:', error);
    process.exit(1);
  });

// Add CORS headers
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Query endpoint
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
    const answer = await ragService.query(question);
    
    res.json({ 
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Add documents endpoint
router.post('/documents', async (req, res) => {
  try {
    const { documents } = req.body;
    
    if (!Array.isArray(documents)) {
      return res.status(400).json({ 
        error: 'Invalid documents format',
        details: 'Documents must be provided as an array'
      });
    }

    const langchainDocuments = documents.map(doc => 
      new Document({
        pageContent: doc.content,
        metadata: doc.metadata || {}
      })
    );

    await ragService.addDocuments(langchainDocuments);
    
    res.json({ 
      message: 'Documents added successfully',
      count: documents.length
    });
  } catch (error) {
    console.error('Error adding documents:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router; 