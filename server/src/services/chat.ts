import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { VectorStore } from 'langchain/vectorstores/base';

// Add at the top of the file
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Comprehensive planet data sourced from NASA's planetary fact sheets
const planetData = [
  {
    name: 'Mercury',
    description: 'Mercury is the smallest and innermost planet in the Solar System. It has no natural satellites and no substantial atmosphere.',
    distance: 0.387,
    gravity: 3.7,
    atmosphere: 'Minimal - Sodium, Potassium',
    surfaceTemp: {
      min: -180,
      max: 430,
      mean: 167
    },
    orbitalPeriod: 88, // days
    rotationPeriod: 58.6, // days
    moons: 0,
    rings: false,
    magneticField: true,
    composition: 'Rocky, Iron core'
  },
  {
    name: 'Venus',
    description: 'Venus is the second planet from the Sun and is often called Earth\'s sister planet due to their similar size and mass.',
    distance: 0.723,
    gravity: 8.87,
    atmosphere: 'Very dense - Carbon Dioxide, Nitrogen',
    surfaceTemp: {
      min: 462,
      max: 462,
      mean: 462
    },
    orbitalPeriod: 225, // days
    rotationPeriod: -243, // days (negative indicates retrograde rotation)
    moons: 0,
    rings: false,
    magneticField: false,
    composition: 'Rocky, Iron core'
  },
  {
    name: 'Earth',
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
    distance: 1.0,
    gravity: 9.81,
    atmosphere: 'Nitrogen (78%), Oxygen (21%)',
    surfaceTemp: {
      min: -88,
      max: 58,
      mean: 15
    },
    orbitalPeriod: 365.25, // days
    rotationPeriod: 1, // days
    moons: 1,
    rings: false,
    magneticField: true,
    composition: 'Rocky, Iron-Nickel core'
  },
  {
    name: 'Mars',
    description: 'Mars is the fourth planet from the Sun and is often called the Red Planet due to its reddish appearance.',
    distance: 1.524,
    gravity: 3.71,
    atmosphere: 'Thin - Carbon Dioxide (95%), Nitrogen, Argon',
    surfaceTemp: {
      min: -140,
      max: 20,
      mean: -63
    },
    orbitalPeriod: 687, // days
    rotationPeriod: 1.03, // days
    moons: 2,
    rings: false,
    magneticField: false,
    composition: 'Rocky, Iron core'
  },
  {
    name: 'Jupiter',
    description: 'Jupiter is the fifth planet from the Sun and the largest planet in the Solar System.',
    distance: 5.203,
    gravity: 24.79,
    atmosphere: 'Hydrogen (90%), Helium (10%)',
    surfaceTemp: {
      min: -110,
      max: -110,
      mean: -110
    },
    orbitalPeriod: 4333, // days
    rotationPeriod: 0.41, // days
    moons: 79,
    rings: true,
    magneticField: true,
    composition: 'Gas giant, possible rocky core'
  },
  {
    name: 'Saturn',
    description: 'Saturn is the sixth planet from the Sun and is known for its prominent ring system.',
    distance: 9.537,
    gravity: 10.44,
    atmosphere: 'Hydrogen (96%), Helium (3%)',
    surfaceTemp: {
      min: -178,
      max: -178,
      mean: -178
    },
    orbitalPeriod: 10759, // days
    rotationPeriod: 0.45, // days
    moons: 82,
    rings: true,
    magneticField: true,
    composition: 'Gas giant, possible rocky core'
  },
  {
    name: 'Uranus',
    description: 'Uranus is the seventh planet from the Sun and rotates at a nearly 90-degree angle from the plane of its orbit.',
    distance: 19.191,
    gravity: 8.69,
    atmosphere: 'Hydrogen (83%), Helium (15%), Methane',
    surfaceTemp: {
      min: -224,
      max: -224,
      mean: -224
    },
    orbitalPeriod: 30687, // days
    rotationPeriod: -0.72, // days (negative indicates retrograde rotation)
    moons: 27,
    rings: true,
    magneticField: true,
    composition: 'Ice giant, rocky core'
  },
  {
    name: 'Neptune',
    description: 'Neptune is the eighth and farthest known planet from the Sun in the Solar System.',
    distance: 30.069,
    gravity: 11.15,
    atmosphere: 'Hydrogen (80%), Helium (19%), Methane',
    surfaceTemp: {
      min: -218,
      max: -218,
      mean: -218
    },
    orbitalPeriod: 60190, // days
    rotationPeriod: 0.67, // days
    moons: 14,
    rings: true,
    magneticField: true,
    composition: 'Ice giant, rocky core'
  }
];

export class ChatService {
  private model: ChatOpenAI;
  private vectorStore: VectorStore;
  private messages: Message[] = [];

  constructor(vectorStore: VectorStore) {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7,
    });
    this.vectorStore = vectorStore;
  }

  private async explainTradeCalculation(params: {
    distance: number;
    earthTime: number;
    shipTime: number;
    timeDilation: number;
    interestRate: number;
    paymentType: string;
  }): Promise<string> {
    const {
      distance,
      earthTime,
      shipTime,
      timeDilation,
      interestRate,
      paymentType
    } = params;

    const distanceKm = distance * 149597870.7; // Convert AU to million km
    const shipSpeedRatio = 0.9; // 90% of light speed
    const shipSpeedKms = 299792.458 * shipSpeedRatio; // Speed in km/s
    const baseInterestRate = 0.05; // 5% annual base rate

    return `🚀 Interstellar Trade Calculation Analysis 🚀

DISTANCE AND TRAVEL TIME
• Distance: ${distance.toFixed(2)} AU (${distanceKm.toFixed(0)} million km)
• Ship velocity: ${shipSpeedRatio * 100}% of light speed (${shipSpeedKms.toFixed(0)} km/s)
• Earth observer time: ${earthTime.toFixed(1)} days
• Ship crew time: ${shipTime.toFixed(1)} days

RELATIVISTIC EFFECTS
• Time dilation factor (γ): ${timeDilation.toFixed(4)}
• This means that for every 1 day on the ship, ${timeDilation.toFixed(2)} days pass on Earth
• This is a direct result of Einstein's special relativity: time dilation = 1/√(1 - v²/c²)

ECONOMIC IMPLICATIONS (Krugman's Theory)
• Base annual interest rate: ${(baseInterestRate * 100)}%
• Effective interest rate: ${(interestRate * 100).toFixed(4)}%
• Payment type: ${paymentType}

${paymentType === 'upfront' ? 
  `For upfront payment:
• The money could have been invested on Earth during the travel time
• The effective interest compounds over Earth time (${earthTime.toFixed(1)} days)
• This accounts for the opportunity cost of the payment` :
  `For payment on delivery:
• The seller must wait longer due to time dilation
• Interest compounds over dilated time (${(earthTime * timeDilation).toFixed(1)} days)
• This compensates for relativistic effects on payment timing`}

THEORETICAL BACKGROUND
According to Krugman's "Theory of Interstellar Trade" (1978):
1. Interest rates must be calculated in the appropriate reference frame
2. Time dilation creates unique arbitrage opportunities
3. The choice of payment timing (upfront vs. delivery) significantly affects costs
4. Relativistic effects cannot be ignored in interstellar commerce

Would you like me to explain any aspect of these calculations in more detail?`;
  }

  async chat(message: Message): Promise<Message> {
    // Mock planet data
    const mockPlanets = [
      {
        name: "Alpha Centauri Bb",
        type: "Super-Earth",
        distance: "4.37 light years",
        atmosphere: "Unknown",
        temperature: "1200°C",
        gravity: "1.1g",
        description: "A potentially habitable exoplanet orbiting Alpha Centauri B, one of the closest star systems to Earth."
      },
      {
        name: "Proxima Centauri b",
        type: "Terrestrial",
        distance: "4.24 light years",
        atmosphere: "Potentially Earth-like",
        temperature: "-39°C to 30°C",
        gravity: "1.3g",
        description: "The closest known exoplanet to Earth, located in the habitable zone of Proxima Centauri."
      },
      {
        name: "Trappist-1e",
        type: "Terrestrial",
        distance: "39 light years",
        atmosphere: "Potentially Earth-like",
        temperature: "-60°C to 20°C",
        gravity: "0.93g",
        description: "One of seven Earth-sized planets orbiting the ultra-cool dwarf star TRAPPIST-1."
      }
    ];

    // Mock response based on the message content
    let response = "I'm sorry, I couldn't find specific information about that planet.";
    
    if (message.content.toLowerCase().includes("alpha centauri")) {
      response = `Based on the available data about Alpha Centauri Bb:
      
      • Distance: 4.37 light years from Earth
      • Type: Super-Earth
      • Surface Temperature: Approximately 1200°C
      • Gravity: 1.1 times Earth's gravity
      
      This planet is one of the closest known exoplanets to our solar system, though its extreme surface temperature makes it unlikely to support life as we know it.`;
    } else if (message.content.toLowerCase().includes("proxima")) {
      response = `Here's what we know about Proxima Centauri b:
      
      • Distance: 4.24 light years from Earth
      • Type: Terrestrial planet
      • Temperature Range: -39°C to 30°C
      • Gravity: 1.3 times Earth's gravity
      
      This is the closest known exoplanet to Earth and is located in the habitable zone of its star, making it a prime candidate for future exploration.`;
    } else if (message.content.toLowerCase().includes("trappist")) {
      response = `Information about TRAPPIST-1e:
      
      • Distance: 39 light years from Earth
      • Type: Terrestrial planet
      • Temperature Range: -60°C to 20°C
      • Gravity: 0.93 times Earth's gravity
      
      This planet is part of a remarkable system with seven Earth-sized planets, and it's considered one of the most promising candidates for habitability outside our solar system.`;
    } else if (message.content.toLowerCase().includes("list") || message.content.toLowerCase().includes("all")) {
      response = `Here are some notable exoplanets in our database:
      
      1. Alpha Centauri Bb
         - Distance: 4.37 light years
         - Type: Super-Earth
      
      2. Proxima Centauri b
         - Distance: 4.24 light years
         - Type: Terrestrial
      
      3. TRAPPIST-1e
         - Distance: 39 light years
         - Type: Terrestrial
      
      Would you like more details about any of these planets?`;
    }

    return {
      role: 'assistant',
      content: response
    };
  }
} 