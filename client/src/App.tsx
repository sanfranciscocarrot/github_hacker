import React from 'react';
import { ChakraProvider, Box, Grid, GridItem } from '@chakra-ui/react';
import { InterstellarMap } from './components/InterstellarMap';
import { TradePanel } from './components/TradePanel';
import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <ChakraProvider>
      <Box h="100vh" p={4} bg="gray.900">
        <Grid
          templateAreas={`"map"
                         "panels"`}
          gridTemplateRows={'60vh 40vh'}
          gap={4}
          h="100%"
        >
          <GridItem area="map">
            <InterstellarMap />
          </GridItem>
          <GridItem area="panels">
            <Grid
              templateColumns="1fr 1fr"
              gap={4}
              h="100%"
            >
              <TradePanel />
              <ChatInterface />
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App; 