import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    main: {
      bg: '#000',
      gray: '#888',
      lightgray: '#EEE',
      // ...
      900: '#1a202c',
    },
  },
  components: {
    Button: {
      variants: {
        link: {
          color: 'black',
          fontWeight: 'normal',
        },
      },
    },
  },
});

export default theme;
