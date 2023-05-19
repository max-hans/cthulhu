import * as React from "react";

import { ChakraProvider, Grid } from "@chakra-ui/react";
import Header from "./components/Header";
import Generator from "./routes/Generator";

import theme from "./theme";

const ta = `
header
content
`;

const App = (): JSX.Element => (
  <ChakraProvider theme={theme}>
    <Grid templateRows="auto 1fr" w="100vw" h="100vh" templateAreas={ta}>
      <Header />
      <Generator />
    </Grid>
  </ChakraProvider>
);

export default App;
