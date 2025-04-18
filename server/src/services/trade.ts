interface TradeRequest {
  sourcePlanet: string;
  destinationPlanet: string;
  goods: string;
  quantity: number;
  paymentType: 'upfront' | 'on_delivery';
}

interface TradeResult {
  distance: number;
  travelTime: number;
  interestRate: number;
  totalCost: number;
}

// Planet distances in astronomical units (AU)
const PLANET_DISTANCES: Record<string, number> = {
  Earth: 0,
  Mars: 1.5,
  Jupiter: 5.2,
};

export class TradeService {
  private readonly SPEED_OF_LIGHT = 299792458; // m/s
  private readonly SHIP_SPEED = 0.9 * this.SPEED_OF_LIGHT; // 90% of light speed
  private readonly BASE_INTEREST_RATE = 0.05; // 5% per year

  calculateTrade(request: TradeRequest): TradeResult {
    const distance = this.calculateDistance(request.sourcePlanet, request.destinationPlanet);
    const travelTime = this.calculateTravelTime(distance);
    const interestRate = this.calculateInterestRate(travelTime, request.paymentType);
    const totalCost = this.calculateTotalCost(request.quantity, interestRate);

    return {
      distance,
      travelTime,
      interestRate,
      totalCost,
    };
  }

  private calculateDistance(source: string, destination: string): number {
    const sourceDistance = PLANET_DISTANCES[source] || 0;
    const destDistance = PLANET_DISTANCES[destination] || 0;
    return Math.abs(destDistance - sourceDistance);
  }

  private calculateTravelTime(distance: number): number {
    // Convert AU to meters (1 AU = 149597870700 meters)
    const distanceMeters = distance * 149597870700;
    return distanceMeters / this.SHIP_SPEED;
  }

  private calculateInterestRate(travelTime: number, paymentType: 'upfront' | 'on_delivery'): number {
    // Calculate time dilation factor
    const timeDilationFactor = 1 / Math.sqrt(1 - (this.SHIP_SPEED / this.SPEED_OF_LIGHT) ** 2);
    
    // Convert travel time to years
    const travelTimeYears = travelTime / (365.25 * 24 * 60 * 60);

    if (paymentType === 'upfront') {
      return this.BASE_INTEREST_RATE * timeDilationFactor * travelTimeYears;
    } else {
      // Higher interest rate for payment on delivery due to increased risk
      return this.BASE_INTEREST_RATE * timeDilationFactor * travelTimeYears * 2;
    }
  }

  private calculateTotalCost(quantity: number, interestRate: number): number {
    // Base cost per unit (simplified)
    const baseCostPerUnit = 100;
    const baseCost = quantity * baseCostPerUnit;
    return baseCost * (1 + interestRate);
  }
} 