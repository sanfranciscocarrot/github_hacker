import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  ScaleFade,
  Circle,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Global, css } from '@emotion/react';

interface TradeForm {
  sourcePlanet: string;
  destinationPlanet: string;
  goods: string;
  quantity: number;
  paymentType: 'upfront' | 'on_delivery';
}

// Planet and star system data
// Distances are stored in AU (1 light year = 63241.1 AU)
const PLANET_DISTANCES: Record<string, number> = {
  // Solar System
  Mercury: 0.387,
  Venus: 0.723,
  Earth: 1,
  Mars: 1.524,
  Jupiter: 5.203,
  Saturn: 9.537,
  Uranus: 19.191,
  Neptune: 30.069,
  
  // Nearby Stars and Their Planets
  'Proxima Centauri b': 268725.8,  // 4.25 light years
  'Alpha Centauri A': 271909.7,    // 4.3 light years
  'Alpha Centauri B': 271909.7,    // 4.3 light years
  'Barnard\'s Star': 379446.6,     // 6.0 light years
  'Wolf 359': 474308.3,            // 7.5 light years
  'Lalande 21185': 515521.8,       // 8.15 light years
  'Sirius A': 537549.4,            // 8.5 light years
  'Sirius B': 537549.4,            // 8.5 light years
  
  // Notable Exoplanets
  'TRAPPIST-1d': 2529644.0,       // 40 light years
  'TRAPPIST-1e': 2529644.0,       // 40 light years
  'TRAPPIST-1f': 2529644.0,       // 40 light years
  'Kepler-186f': 3099814.0,       // 49 light years
  'TOI-700d': 6324110.0,          // 100 light years
  
  // Notable Star Systems
  'Betelgeuse': 39525687.5,       // 625 light years
  'Vega': 158102750.0,            // 2500 light years
  'Antares': 316205500.0,         // 5000 light years
  'Deneb': 474308250.0,           // 7500 light years
  
  // Galactic Features
  'Orion Nebula': 853754850.0,    // 13,500 light years
  'Galactic Center': 1580275000.0, // 25,000 light years
  'LMC': 3162055000.0,            // 50,000 light years (Large Magellanic Cloud)
};

// Update the interface to include descriptions
interface TradeForm {
  sourcePlanet: string;
  destinationPlanet: string;
  goods: string;
  quantity: number;
  paymentType: 'upfront' | 'on_delivery';
}

// Add planet descriptions
const CELESTIAL_BODY_INFO: Record<string, string> = {
  Mercury: 'Innermost planet of the Solar System',
  Venus: 'Second planet from the Sun, similar in size to Earth',
  Earth: 'Our home planet',
  Mars: 'The Red Planet, target for human colonization',
  Jupiter: 'Largest planet in the Solar System',
  Saturn: 'Known for its spectacular ring system',
  Uranus: 'Ice giant with unique sideways rotation',
  Neptune: 'The windiest planet in the Solar System',
  'Proxima Centauri b': 'Closest known exoplanet to Earth, potentially habitable',
  'Alpha Centauri A': 'Part of the closest star system to Earth',
  'Alpha Centauri B': 'Binary companion to Alpha Centauri A',
  'Barnard\'s Star': 'One of the closest stars to Earth',
  'Wolf 359': 'Small red dwarf star in Leo constellation',
  'Lalande 21185': 'Red dwarf with confirmed exoplanets',
  'Sirius A': 'Brightest star in Earth\'s night sky',
  'Sirius B': 'White dwarf companion to Sirius A',
  'TRAPPIST-1d': 'Part of the TRAPPIST-1 system of seven Earth-like planets',
  'TRAPPIST-1e': 'Most promising TRAPPIST-1 planet for habitability',
  'TRAPPIST-1f': 'Water-rich world in the TRAPPIST-1 system',
  'Kepler-186f': 'First Earth-sized planet discovered in habitable zone',
  'TOI-700d': 'Earth-sized planet in its star\'s habitable zone',
  'Betelgeuse': 'Red supergiant star, could go supernova soon',
  'Vega': 'Bright star and former North Star',
  'Antares': 'Red supergiant star in Scorpius',
  'Deneb': 'One of the most luminous known stars',
  'Orion Nebula': 'Closest massive star formation region to Earth',
  'Galactic Center': 'Supermassive black hole at the heart of the Milky Way',
  'LMC': 'Largest satellite galaxy of the Milky Way'
};

// Add planet colors mapping
const PLANET_COLORS: Record<string, string> = {
  Mercury: 'gray.400',
  Venus: 'yellow.200',
  Earth: 'blue.400',
  Mars: 'red.500',
  Jupiter: 'orange.300',
  Saturn: 'yellow.500',
  Uranus: 'teal.300',
  Neptune: 'blue.500',
  'Proxima Centauri b': 'red.300',
  'Alpha Centauri A': 'yellow.400',
  'Alpha Centauri B': 'orange.400',
  'Barnard\'s Star': 'red.600',
  'Wolf 359': 'red.400',
  'Lalande 21185': 'orange.500',
  'Sirius A': 'white',
  'Sirius B': 'gray.100',
  'TRAPPIST-1d': 'purple.300',
  'TRAPPIST-1e': 'purple.400',
  'TRAPPIST-1f': 'purple.500',
  'Kepler-186f': 'green.400',
  'TOI-700d': 'cyan.400',
  'Betelgeuse': 'red.700',
  'Vega': 'blue.200',
  'Antares': 'red.800',
  'Deneb': 'white',
  'Orion Nebula': 'purple.200',
  'Galactic Center': 'black',
  'LMC': 'blue.100',
};

// Add planet sizes mapping (relative sizes for visualization)
const PLANET_SIZES: Record<string, number> = {
  Mercury: 16,
  Venus: 20,
  Earth: 20,
  Mars: 18,
  Jupiter: 40,
  Saturn: 35,
  Uranus: 25,
  Neptune: 25,
  'Proxima Centauri b': 22,
  'Alpha Centauri A': 30,
  'Alpha Centauri B': 28,
  'Barnard\'s Star': 25,
  'Wolf 359': 20,
  'Lalande 21185': 22,
  'Sirius A': 35,
  'Sirius B': 15,
  'TRAPPIST-1d': 20,
  'TRAPPIST-1e': 20,
  'TRAPPIST-1f': 20,
  'Kepler-186f': 22,
  'TOI-700d': 22,
  'Betelgeuse': 45,
  'Vega': 30,
  'Antares': 45,
  'Deneb': 40,
  'Orion Nebula': 50,
  'Galactic Center': 55,
  'LMC': 60,
};

const GameFont = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      @keyframes flow {
        0% {
          stroke-dashoffset: 20;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
    `}
  />
);

export const TradePanel: React.FC = () => {
  const [form, setForm] = useState<TradeForm>({
    sourcePlanet: 'Earth',
    destinationPlanet: 'Mars',
    goods: '',
    quantity: 1,
    paymentType: 'upfront',
  });

  const [isFormActive, setIsFormActive] = useState(false);

  const [calculation, setCalculation] = useState<{
    distance: number;
    travelTime: number;
    shipTime: number;
    interestRate: number;
    totalCost: number;
    timeDilation: number;
  } | null>(null);

  const toast = useToast();

  const calculateTradeParameters = (distance: number, paymentType: 'upfront' | 'on_delivery') => {
    // Constants
    const SPEED_OF_LIGHT = 299792.458; // km/s
    const SHIP_SPEED_RATIO = 0.0001; // 0.01% of light speed (about 107,925 km/h)
    const SHIP_SPEED = SPEED_OF_LIGHT * SHIP_SPEED_RATIO; // km/s
    const AU_TO_KM = 149597870.7; // 1 AU in km
    const SECONDS_PER_DAY = 86400; // 24 * 60 * 60
    const DAYS_PER_YEAR = 365.25;
    
    // Convert distance from AU to km
    const distanceKm = distance * AU_TO_KM;

    // Calculate time dilation factor (γ - gamma)
    // γ = 1 / sqrt(1 - v²/c²)
    const timeDilationFactor = 1 / Math.sqrt(1 - Math.pow(SHIP_SPEED_RATIO, 2));

    // Calculate Earth time (coordinate time) in seconds
    // t = d/v where d is distance and v is ship speed
    const earthTimeSeconds = distanceKm / SHIP_SPEED;

    // Calculate ship time (proper time) in seconds
    // t' = t/γ where t is Earth time and γ is time dilation factor
    const shipTimeSeconds = earthTimeSeconds / timeDilationFactor;

    // Convert to days
    const earthTimeDays = earthTimeSeconds / SECONDS_PER_DAY;
    const shipTimeDays = shipTimeSeconds / SECONDS_PER_DAY;

    // Calculate years for interest rates
    const earthYears = earthTimeDays / DAYS_PER_YEAR;
    const shipYears = shipTimeDays / DAYS_PER_YEAR;

    // Calculate interest rates based on payment type
    const BASE_INTEREST_RATE = 0.05; // 5% annual interest rate
    let effectiveInterestRate;
    
    if (paymentType === 'upfront') {
      effectiveInterestRate = Math.pow(1 + BASE_INTEREST_RATE, earthYears) - 1;
    } else {
      effectiveInterestRate = Math.pow(1 + BASE_INTEREST_RATE, earthYears * timeDilationFactor) - 1;
    }

    // Calculate total cost including interest
    const baseCost = Math.max(1, form.quantity) * 1000; // Base cost per unit, minimum 1 unit
    const totalCost = baseCost * (1 + effectiveInterestRate);

    return {
      distance: parseFloat(distance.toFixed(2)),
      travelTime: parseFloat(earthTimeDays.toFixed(2)),
      shipTime: parseFloat(shipTimeDays.toFixed(2)),
      timeDilation: parseFloat(timeDilationFactor.toFixed(4)),
      interestRate: effectiveInterestRate,
      totalCost: parseFloat(totalCost.toFixed(2))
    };
  };

  const handleSubmit = async () => {
    if (form.quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter a quantity greater than 0',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const sourceDistance = PLANET_DISTANCES[form.sourcePlanet];
    const destDistance = PLANET_DISTANCES[form.destinationPlanet];
    const distance = Math.abs(destDistance - sourceDistance);
    
    const result = calculateTradeParameters(distance, form.paymentType);
    setCalculation(result);
    
    // Send calculation details to the chat interface
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '!explain_calculation:' + JSON.stringify({
            sourcePlanet: form.sourcePlanet,
            destinationPlanet: form.destinationPlanet,
            distance,
            travelTime: result.travelTime,
            shipTime: result.shipTime,
            timeDilation: result.timeDilation,
            interestRate: result.interestRate,
            totalCost: result.totalCost,
            paymentType: form.paymentType,
            goods: form.goods,
            quantity: form.quantity
          })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send calculation details');
      }

      toast({
        title: 'Trade Calculation Complete',
        description: 'Calculation details have been sent to the chat.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to send calculation details:', error);
      toast({
        title: 'Error',
        description: 'Failed to send calculation details to chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add this before the return statement
  const distance = useMemo(() => {
    const sourceDistance = PLANET_DISTANCES[form.sourcePlanet];
    const destDistance = PLANET_DISTANCES[form.destinationPlanet];
    return Math.abs(destDistance - sourceDistance);
  }, [form.sourcePlanet, form.destinationPlanet]);

  // Add responsive values
  const visualHeight = useBreakpointValue({ base: "120px", md: "150px" });
  const planetTextSize = useBreakpointValue({ base: "2xs", sm: "xs" });
  const distanceTextSize = useBreakpointValue({ base: "2xs", sm: "xs" });
  const titleSize = useBreakpointValue({ base: "md", md: "lg" });
  const planetSize = useBreakpointValue({ base: 0.7, sm: 0.85, md: 1 });
  const lineWidth = useBreakpointValue({ base: "120px", sm: "160px", md: "200px" });
  const statsColumns = useBreakpointValue({ base: 2, md: 3, lg: 6 });

  return (
    <Box p={{ base: 2, md: 6 }} bg="white" borderRadius="xl" boxShadow="lg" h="100%" overflowY="auto">
      <GameFont />
      <VStack spacing={{ base: 2, md: 4 }} align="stretch">
        <Heading size={titleSize} mb={{ base: 1, md: 2 }}>Interstellar Trade</Heading>
        
        <Box 
          w="100%" 
          h={isFormActive ? visualHeight : visualHeight}
          bg="gray.900" 
          borderRadius="xl" 
          mb={{ base: 2, md: 4 }} 
          position="relative"
          overflow="hidden"
          transition="all 0.3s ease-in-out"
          transform={isFormActive ? "scale(0.95)" : "scale(1)"}
        >
          {/* Stars background effect */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgImage="radial-gradient(white 1px, transparent 1px)"
            backgroundSize={{ base: "10px 10px", md: "15px 15px" }}
            opacity={0.2}
          />
          
          {/* Planets display */}
          <Flex
            h="100%"
            justify="space-around"
            align="center"
            position="relative"
            px={{ base: 2, md: 8 }}
          >
            {/* Source Planet */}
            <VStack spacing={{ base: 1, md: 2 }}>
              <Circle
                size={`${PLANET_SIZES[form.sourcePlanet] * (planetSize || 1)}px`}
                bg={PLANET_COLORS[form.sourcePlanet]}
                boxShadow="0 0 20px rgba(255,255,255,0.2)"
                border="2px solid rgba(255,255,255,0.2)"
              />
              <Text 
                color="white" 
                fontSize={planetTextSize}
                fontWeight="medium"
                sx={{
                  fontFamily: "'Press Start 2P', cursive",
                  textShadow: "0 0 5px rgba(0,255,255,0.5)",
                  letterSpacing: "-0.05em"
                }}
              >
                {form.sourcePlanet}
              </Text>
            </VStack>

            {/* Animated connection line with distance */}
            <VStack>
              <svg width={lineWidth} height="2" style={{ overflow: 'visible' }}>
                <line
                  x1="0"
                  y1="0"
                  x2={lineWidth}
                  y2="0"
                  stroke="cyan"
                  strokeWidth="2"
                  strokeDasharray="4"
                  style={{
                    animation: 'flow 1s linear infinite',
                    filter: 'drop-shadow(0 0 8px cyan)',
                  }}
                />
              </svg>
              <Text
                color="cyan.200"
                fontSize={distanceTextSize}
                mt={-2}
                sx={{
                  fontFamily: "'Press Start 2P', cursive",
                  textShadow: "0 0 5px rgba(0,255,255,0.5)",
                }}
              >
                {distance < 1000 
                  ? `${distance.toFixed(2)} AU`
                  : `${(distance / 63241.1).toFixed(2)} LY`}
              </Text>
            </VStack>

            {/* Destination Planet */}
            <VStack spacing={{ base: 1, md: 2 }}>
              <Circle
                size={`${PLANET_SIZES[form.destinationPlanet] * (planetSize || 1)}px`}
                bg={PLANET_COLORS[form.destinationPlanet]}
                boxShadow="0 0 20px rgba(255,255,255,0.2)"
                border="2px solid rgba(255,255,255,0.2)"
              />
              <Text 
                color="white" 
                fontSize={planetTextSize}
                fontWeight="medium"
                sx={{
                  fontFamily: "'Press Start 2P', cursive",
                  textShadow: "0 0 5px rgba(0,255,255,0.5)",
                  letterSpacing: "-0.05em"
                }}
              >
                {form.destinationPlanet}
              </Text>
            </VStack>
          </Flex>
        </Box>

        <Box
          transform={isFormActive ? "scale(1.02)" : "scale(1)"}
          transition="all 0.3s ease-in-out"
          bg={isFormActive ? "white" : "transparent"}
          p={{ base: 2, md: 4 }}
          borderRadius="xl"
          boxShadow={isFormActive ? "lg" : "none"}
          onClick={() => setIsFormActive(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsFormActive(false);
            }
          }}
          tabIndex={0}
        >
          <HStack spacing={{ base: 2, md: 4 }} flexDirection={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Source Location</FormLabel>
              <Select
                value={form.sourcePlanet}
                onChange={(e) => {
                  const newSourcePlanet = e.target.value;
                  // If new source matches current destination, change destination to a different planet
                  if (newSourcePlanet === form.destinationPlanet) {
                    const availablePlanets = Object.keys(PLANET_DISTANCES).filter(
                      planet => planet !== newSourcePlanet
                    );
                    setForm({
                      ...form,
                      sourcePlanet: newSourcePlanet,
                      destinationPlanet: availablePlanets[0] // Set to first available planet
                    });
                  } else {
                    setForm({ ...form, sourcePlanet: newSourcePlanet });
                  }
                  setIsFormActive(true);
                }}
                onFocus={() => setIsFormActive(true)}
              >
                {Object.keys(PLANET_DISTANCES).map(planet => (
                  <option key={planet} value={planet}>{planet}</option>
                ))}
              </Select>
              {form.sourcePlanet && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {CELESTIAL_BODY_INFO[form.sourcePlanet]}
                </Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Destination Location</FormLabel>
              <Select
                value={form.destinationPlanet}
                onChange={(e) => {
                  setForm({ ...form, destinationPlanet: e.target.value });
                  setIsFormActive(true);
                }}
                onFocus={() => setIsFormActive(true)}
              >
                {Object.keys(PLANET_DISTANCES)
                  .filter(planet => planet !== form.sourcePlanet)
                  .map(planet => (
                    <option key={planet} value={planet}>{planet}</option>
                  ))}
              </Select>
              {form.destinationPlanet && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {CELESTIAL_BODY_INFO[form.destinationPlanet]}
                </Text>
              )}
            </FormControl>
          </HStack>

          <FormControl mt={{ base: 2, md: 4 }}>
            <FormLabel fontSize={{ base: "sm", md: "md" }}>Goods</FormLabel>
            <Input
              value={form.goods}
              onChange={(e) => {
                setForm({ ...form, goods: e.target.value });
                setIsFormActive(true);
              }}
              onFocus={() => setIsFormActive(true)}
              placeholder="Enter goods description"
            />
          </FormControl>

          <HStack spacing={{ base: 2, md: 4 }} mt={{ base: 2, md: 4 }} flexDirection={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Quantity</FormLabel>
              <Input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => {
                  setForm({ ...form, quantity: Math.max(1, Number(e.target.value)) });
                  setIsFormActive(true);
                }}
                onFocus={() => setIsFormActive(true)}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Payment Type</FormLabel>
              <Select
                value={form.paymentType}
                onChange={(e) => {
                  setForm({ ...form, paymentType: e.target.value as 'upfront' | 'on_delivery' });
                  setIsFormActive(true);
                }}
                onFocus={() => setIsFormActive(true)}
              >
                <option value="upfront">Pay Upfront</option>
                <option value="on_delivery">Pay on Delivery</option>
              </Select>
            </FormControl>
          </HStack>

          <Button
            colorScheme="blue"
            size={{ base: "md", md: "lg" }}
            onClick={handleSubmit}
            mt={{ base: 2, md: 4 }}
            w={{ base: "100%", md: "auto" }}
            onFocus={() => setIsFormActive(true)}
          >
            Calculate Trade
          </Button>

          {calculation && (
            <Box mt={{ base: 2, md: 4 }} p={{ base: 2, md: 4 }} borderRadius="md" bg="gray.50">
              <StatGroup flexDirection={{ base: "column", md: "row" }} gap={{ base: 2, md: 4 }}>
                <Stat>
                  <StatLabel fontSize={{ base: "xs", md: "sm" }}>Distance</StatLabel>
                  <StatNumber fontSize={{ base: "sm", md: "md" }}>{calculation.distance.toFixed(2)} AU</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>Astronomical Units</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize={{ base: "xs", md: "sm" }}>Earth Time</StatLabel>
                  <StatNumber fontSize={{ base: "sm", md: "md" }}>{calculation.travelTime.toFixed(2)} days</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>In stationary frame</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize={{ base: "xs", md: "sm" }}>Ship Time</StatLabel>
                  <StatNumber fontSize={{ base: "sm", md: "md" }}>{calculation.shipTime.toFixed(2)} days</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>Due to time dilation</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize={{ base: "xs", md: "sm" }}>Time Dilation</StatLabel>
                  <StatNumber fontSize={{ base: "sm", md: "md" }}>{calculation.timeDilation.toFixed(4)}x</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>Relativistic factor</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize={{ base: "xs", md: "sm" }}>Interest Rate</StatLabel>
                  <StatNumber fontSize={{ base: "sm", md: "md" }}>{(calculation.interestRate * 100).toFixed(4)}%</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>{form.paymentType === 'upfront' ? 'For upfront payment' : 'For payment on delivery'}</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize={{ base: "xs", md: "sm" }}>Total Cost</StatLabel>
                  <StatNumber fontSize={{ base: "sm", md: "md" }}>{calculation.totalCost.toFixed(2)} credits</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>Including interest</StatHelpText>
                </Stat>
              </StatGroup>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
}; 