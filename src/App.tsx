import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./routes/Home";
import Generator from "./routes/Generator";
import About from "./routes/About";

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";

const ta = `
header
content
footer
`;

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Grid templateRows="auto 1fr auto" w="100vw" h="100vh" templateAreas={ta}>
        <Navbar />
        <Switch>
          <Route path="/generator">
            <Generator />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Grid>
    </Router>
  </ChakraProvider>
);
