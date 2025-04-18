import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { TradePanel } from './TradePanel';
import { Global, css } from '@emotion/react';

const Animations = () => (
  <Global
    styles={css`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `}
  />
);

export const InterstellarMap: React.FC = () => {
  const [isLandingPage, setIsLandingPage] = useState(true);

  const handleClick = () => {
    setIsLandingPage(false);
  };

  return (
    <Box 
      w="100vw" 
      h="100vh" 
      bg="black" 
      position="relative" 
      overflow="hidden"
      onClick={isLandingPage ? handleClick : undefined}
      cursor={isLandingPage ? "pointer" : "default"}
    >
      <Animations />
      {/* Star background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="radial-gradient(white 1px, transparent 1px)"
        backgroundSize="15px 15px"
        opacity={0.2}
        animation="fadeIn 2s ease-in-out"
      />

      {/* Solar system visualization */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        transition="all 0.8s ease-in-out"
        transform={isLandingPage ? "scale(1)" : "scale(0.5) translateY(-50%)"}
      >
        {/* Sun */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="60px"
          h="60px"
          borderRadius="full"
          bg="yellow.400"
          boxShadow="0 0 40px #FDB813"
        />

        {/* Orbit paths */}
        {[1, 2, 3, 4].map((orbit) => (
          <Box
            key={orbit}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w={`${orbit * 150}px`}
            h={`${orbit * 150}px`}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.1)"
          />
        ))}

        {/* Planets */}
        <Box
          position="absolute"
          top="50%"
          left="calc(50% - 75px)"
          transform="translate(-50%, -50%)"
          w="20px"
          h="20px"
          borderRadius="full"
          bg="blue.400"
          boxShadow="0 0 20px rgba(0,255,255,0.5)"
        />

        <Box
          position="absolute"
          top="50%"
          left="calc(50% + 150px)"
          transform="translate(-50%, -50%)"
          w="30px"
          h="30px"
          borderRadius="full"
          bg="red.500"
          boxShadow="0 0 20px rgba(255,0,0,0.5)"
        />
      </Box>

      {/* Welcome text */}
      {isLandingPage && (
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          flexDirection="column"
          alignItems="center"
          color="white"
          animation="fadeIn 2s ease-in-out"
        >
          <Text
            fontSize={{ base: "xl", md: "3xl" }}
            fontFamily="'Press Start 2P', cursive"
            textAlign="center"
            textShadow="0 0 10px cyan"
            mb={4}
          >
            Interstellar Trade Network
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="'Press Start 2P', cursive"
            textAlign="center"
            color="cyan.200"
          >
            Click anywhere to begin
          </Text>
        </Flex>
      )}

      {/* Trade Panel */}
      <Box
        position="absolute"
        top={isLandingPage ? "100%" : "25%"}
        left="50%"
        transform="translateX(-50%)"
        width="90%"
        maxW="1200px"
        transition="all 0.8s ease-in-out"
        opacity={isLandingPage ? 0 : 1}
        pointerEvents={isLandingPage ? "none" : "auto"}
      >
        <TradePanel />
      </Box>
    </Box>
  );
}; 