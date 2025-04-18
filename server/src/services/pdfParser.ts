import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

export class PDFParser {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.UNSTRUCTURED_API_KEY || '';
        this.baseUrl = 'https://api.unstructured.io/general/v0/general';
        
        if (!this.apiKey) {
            throw new Error('UNSTRUCTURED_API_KEY is not set in environment variables');
        }
    }

    async parsePDF(filePath: string): Promise<any> {
        try {
            console.log('Starting PDF parsing...');
            console.log('Reading file:', filePath);
            
            const formData = new FormData();
            const fileBuffer = fs.readFileSync(filePath);
            const file = new Blob([fileBuffer], { type: 'application/pdf' });
            formData.append('files', file, path.basename(filePath));
            formData.append('strategy', 'fast');

            console.log('Sending request to Unstructured API...');
            const response = await axios.post(this.baseUrl, formData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Received response from Unstructured API');
            
            // Validate response structure
            if (!Array.isArray(response.data)) {
                console.error('Unexpected response format:', response.data);
                throw new Error('Invalid response format from Unstructured API');
            }

            // Process and validate each element
            const processedData = response.data.map((element: any, index: number) => {
                if (!element || typeof element !== 'object') {
                    console.warn(`Invalid element at index ${index}:`, element);
                    return null;
                }

                // Ensure required fields exist
                const processedElement = {
                    text: element.text || '',
                    metadata: {
                        page_number: element.metadata?.page_number || 0,
                        ...element.metadata
                    }
                };

                if (!processedElement.text) {
                    console.warn(`Empty text at index ${index}`);
                }

                return processedElement;
            }).filter((element: any) => element !== null);

            console.log(`Processed ${processedData.length} elements from PDF`);
            return processedData;
        } catch (error) {
            console.error('Error parsing PDF:', error);
            if (axios.isAxiosError(error)) {
                console.error('API Error Details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });
            }
            throw error;
        }
    }
} 