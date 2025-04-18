import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';
import { PDFParser } from './pdfParser';

interface ProcessedElement {
    text: string;
    metadata: {
        page_number: number;
        [key: string]: any;
    };
}

interface DocumentMetadata {
    source: string;
    page: number;
    page_number: number;
    [key: string]: any;
}

export class PlanetRAG {
    private vectorStore: MemoryVectorStore | null = null;
    private pdfParser: PDFParser;

    constructor() {
        this.pdfParser = new PDFParser();
    }

    async initialize(pdfPath: string) {
        try {
            console.log('Initializing RAG system...');
            
            // Parse the PDF using Unstructured API
            const parsedContent = await this.pdfParser.parsePDF(pdfPath) as ProcessedElement[];
            console.log('PDF parsed successfully, received elements:', parsedContent.length);
            
            if (parsedContent.length === 0) {
                throw new Error('No content was extracted from the PDF');
            }

            // Convert parsed content to LangChain documents
            const documents = parsedContent.map((element: ProcessedElement) => {
                if (!element.text.trim()) {
                    console.warn('Empty text content found in element');
                    return null;
                }
                return new Document<DocumentMetadata>({
                    pageContent: element.text,
                    metadata: {
                        source: pdfPath,
                        page: element.metadata.page_number,
                        ...element.metadata
                    },
                });
            }).filter((doc): doc is Document<DocumentMetadata> => doc !== null);

            if (documents.length === 0) {
                throw new Error('No valid documents were created from the PDF content');
            }

            console.log(`Created ${documents.length} valid documents`);

            // Split documents into chunks
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
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

    async query(question: string) {
        if (!this.vectorStore) {
            throw new Error('RAG system not initialized. Call initialize() first.');
        }

        try {
            console.log('Querying RAG system with question:', question);
            const results = await this.vectorStore.similaritySearch(question, 3);
            console.log('Found results:', results.length);
            
            if (results.length === 0) {
                return [];
            }

            return results.map(doc => ({
                content: doc.pageContent,
                metadata: doc.metadata
            }));
        } catch (error) {
            console.error('Error querying RAG system:', error);
            throw error;
        }
    }
} 