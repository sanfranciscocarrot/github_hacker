import React from 'react';
import { Box, Circle } from '@chakra-ui/react';

// Define the orbit animation using CSS keyframes
const orbitKeyframes = `
  @keyframes orbit {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface StarMapProps {
  isLanding: boolean;
}

export const StarMap: React.FC<StarMapProps> = ({ isLanding }) => {
  return (
    <Box
      position="relative"
      w="100%"
      h={isLanding ? "100vh" : "25vh"}
      bg="black"
      transition="all 0.8s ease-in-out"
      overflow="hidden"
      sx={{
        // Add the keyframes definition to the component's styles
        '@keyframes orbit': {
          'from': {
            transform: 'rotate(0deg)',
          },
          'to': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      {/* Stars background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="radial-gradient(white 1px, transparent 1px)"
        backgroundSize="15px 15px"
        opacity={0.2}
      />

      {/* Sun */}
      <Circle
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        size={isLanding ? "100px" : "40px"}
        bg="yellow.400"
        boxShadow="0 0 40px yellow"
        transition="all 0.8s ease-in-out"
      />

      {/* Orbits and Planets */}
      {[1, 2, 3, 4].map((index) => (
        <Box
          key={index}
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          width={`${index * (isLanding ? 200 : 80)}px`}
          height={`${index * (isLanding ? 200 : 80)}px`}
          borderRadius="50%"
          border="1px solid rgba(255,255,255,0.1)"
          transition="all 0.8s ease-in-out"
        >
          <Circle
            position="absolute"
            top="0"
            left="50%"
            transform="translate(-50%, -50%)"
            size={isLanding ? "20px" : "8px"}
            bg={index === 1 ? "gray.400" : 
               index === 2 ? "blue.400" : 
               index === 3 ? "red.500" : 
               "orange.300"}
            boxShadow="0 0 10px rgba(255,255,255,0.5)"
            sx={{
              animation: `orbit ${index * 20}s linear infinite`,
            }}
            transition="all 0.8s ease-in-out"
          />
        </Box>
      ))}
    </Box>
  );
};