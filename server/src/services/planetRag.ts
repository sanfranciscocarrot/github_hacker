import { Document } from 'langchain/document';

interface DocumentMetadata {
    source: string;
    page: number;
    page_number: number;
    [key: string]: any;
}

export class PlanetRAG {
    private mockResponses: { [key: string]: string[] } = {
        "what is interstellar trade": [
            "Interstellar trade refers to the exchange of goods, services, and resources between different star systems or planetary colonies. It involves complex logistics including space transportation, resource allocation, and economic systems that account for vast distances and time delays.",
            "The foundation of interstellar trade lies in comparative advantage between different planetary systems, where each system specializes in producing goods or services that they can provide most efficiently, creating a mutually beneficial economic network across space.",
            "Key challenges in interstellar trade include dealing with relativistic time dilation, managing supply chains across light-years, and establishing standardized economic systems that can function across different planetary environments and cultures."
        ],
        "how does space economics work": [
            "Space economics operates on principles of resource scarcity and abundance, where the value of goods is determined by their availability in different planetary systems and the cost of transportation between them. Rare minerals on one planet might be common on another, creating natural trade opportunities.",
            "The economics of space colonization and trade must account for the high initial costs of space infrastructure, the long-term benefits of resource extraction, and the development of sustainable economic systems that can support permanent off-world settlements.",
            "Space economics introduces unique concepts like 'time-value of money' across interstellar distances, where the time delay in communication and transportation must be factored into economic calculations and investment decisions."
        ],
        "what are the main challenges of interstellar commerce": [
            "The primary challenges of interstellar commerce include the vast distances between trading partners, which can lead to significant time delays in communication and transportation, requiring new approaches to supply chain management and economic planning.",
            "Different planetary environments and resource availability create complex pricing mechanisms, where the value of goods can vary dramatically between systems based on local conditions, technological capabilities, and resource abundance.",
            "Legal and regulatory frameworks for interstellar trade must account for different planetary governments, cultural differences, and the need for standardized systems that can function across vast distances while respecting local autonomy."
        ],
        "what technologies enable interstellar trade": [
            "Advanced propulsion systems, such as fusion drives or theoretical concepts like warp drives, are essential for making interstellar trade feasible by reducing travel times between star systems to manageable durations.",
            "Communication technologies that can bridge interstellar distances, including quantum entanglement networks or advanced laser communication systems, are crucial for maintaining economic relationships and coordinating trade across light-years.",
            "Automated manufacturing and resource extraction technologies enable self-sustaining colonies and trading posts, reducing the need for constant resupply from Earth and allowing for more efficient local production of goods."
        ]
    };

    constructor() {
        // No initialization needed for mock version
    }

    async initialize(pdfPath: string) {
        console.log('Mock RAG system initialized');
        return;
    }

    async query(question: string) {
        console.log('Querying mock RAG system with question:', question);
        
        // Convert question to lowercase for case-insensitive matching
        const normalizedQuestion = question.toLowerCase();
        
        // Find the best matching response
        let bestMatch = null;
        let bestMatchLength = 0;
        
        for (const [key, responses] of Object.entries(this.mockResponses)) {
            const similarity = this.calculateSimilarity(normalizedQuestion, key);
            if (similarity > bestMatchLength) {
                bestMatchLength = similarity;
                bestMatch = responses;
            }
        }

        if (!bestMatch) {
            // Default response if no match is found
            return [{
                content: "I'm sorry, I don't have specific information about that topic in my knowledge base. Please try asking about interstellar trade, space economics, or related topics.",
                metadata: {
                    source: "mock",
                    page: 1,
                    page_number: 1
                }
            }];
        }

        // Return the mock responses
        return bestMatch.map((content, index) => ({
            content,
            metadata: {
                source: "mock",
                page: index + 1,
                page_number: index + 1
            }
        }));
    }

    private calculateSimilarity(str1: string, str2: string): number {
        // Simple similarity calculation based on word overlap
        const words1 = new Set(str1.split(/\s+/));
        const words2 = new Set(str2.split(/\s+/));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        return intersection.size / Math.max(words1.size, words2.size);
    }
} 