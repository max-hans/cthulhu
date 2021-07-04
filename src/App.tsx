import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./routes/Home";
import Generator from "./routes/Generator";
import About from "./routes/About";

import { ChakraProvider, Grid } from "@chakra-ui/react";
import theme from "./theme";

const ta = `
header
content
`;

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Grid templateRows="auto 1fr" w="100vw" h="100vh" templateAreas={ta}>
        <Header />
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
      </Grid>
    </Router>
  </ChakraProvider>
);
