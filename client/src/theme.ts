import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    body: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  },
  components: {
    Text: {
      variants: {
        game: {
          fontFamily: `"Press Start 2P", system-ui, sans-serif`,
          letterSpacing: '0.05em',
        },
      },
    },
    Heading: {
      variants: {
        game: {
          fontFamily: `"Press Start 2P", system-ui, sans-serif`,
          letterSpacing: '0.05em',
        },
      },
    },
  },
});

export default theme; 