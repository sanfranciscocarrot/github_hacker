import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';

interface RAGConfig {
  chunkSize?: number;
  chunkOverlap?: number;
  modelName?: string;
  temperature?: number;
}

export class RAGService {
  private vectorStore: MemoryVectorStore | null = null;
  private model: ChatOpenAI;
  private config: RAGConfig;

  constructor(config: RAGConfig = {}) {
    this.config = {
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200,
      modelName: config.modelName || 'gpt-4',
      temperature: config.temperature || 0.7,
    };

    this.model = new ChatOpenAI({
      modelName: this.config.modelName,
      temperature: this.config.temperature,
    });
  }

  async initialize(documents: Document[]) {
    try {
      console.log('Initializing RAG system...');
      
      if (!documents || documents.length === 0) {
        throw new Error('No documents provided for initialization');
      }

      // Split documents into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: this.config.chunkSize,
        chunkOverlap: this.config.chunkOverlap,
      });

      console.log('Splitting documents into chunks...');
      const chunks = await textSplitter.splitDocuments(documents);
      console.log(`Created ${chunks.length} chunks`);

      // Create embeddings and vector store
      console.log('Creating embeddings...');
      const embeddings = new OpenAIEmbeddings();
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        chunks,
        embeddings
      );
      console.log('RAG system initialized successfully');
    } catch (error) {
      console.error('Error initializing RAG system:', error);
      throw error;
    }
  }

  async query(question: string, numResults: number = 3): Promise<string> {
    if (!this.vectorStore) {
      throw new Error('RAG system not initialized. Call initialize() first.');
    }

    try {
      console.log('Querying RAG system with question:', question);
      
      // Get relevant documents
      const results = await this.vectorStore.similaritySearch(question, numResults);
      console.log('Found relevant documents:', results.length);

      if (results.length === 0) {
        return "I couldn't find any relevant information to answer your question.";
      }

      // Create a prompt template
      const promptTemplate = PromptTemplate.fromTemplate(`
        You are a helpful AI assistant. Use the following context to answer the question at the end.
        If you don't know the answer, just say that you don't know. Don't try to make up an answer.

        Context:
        {context}

        Question: {question}

        Answer:
      `);

      // Format the context from retrieved documents
      const context = results
        .map((doc) => doc.pageContent)
        .join('\n\n');

      // Generate the prompt
      const prompt = await promptTemplate.format({
        context,
        question,
      });

      // Get the answer from the model
      const response = await this.model.call(prompt);
      return response.content;
    } catch (error) {
      console.error('Error querying RAG system:', error);
      throw error;
    }
  }

  async addDocuments(documents: Document[]) {
    if (!this.vectorStore) {
      throw new Error('RAG system not initialized. Call initialize() first.');
    }

    try {
      console.log('Adding new documents to RAG system...');
      
      // Split new documents into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: this.config.chunkSize,
        chunkOverlap: this.config.chunkOverlap,
      });

      const chunks = await textSplitter.splitDocuments(documents);
      console.log(`Created ${chunks.length} new chunks`);

      // Add chunks to existing vector store
      await this.vectorStore.addDocuments(chunks);
      console.log('Documents added successfully');
    } catch (error) {
      console.error('Error adding documents to RAG system:', error);
      throw error;
    }
  }
} 