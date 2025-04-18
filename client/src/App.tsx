import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { TradePanel } from './components/TradePanel';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box h="100vh" p={4} bg="gray.900">
        <TradePanel />
      </Box>
    </ChakraProvider>
  );
}

export default App; 