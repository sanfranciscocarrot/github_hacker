import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { InterstellarMap } from './components/InterstellarMap';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'black',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <InterstellarMap />
    </ChakraProvider>
  );
}

export default App; 