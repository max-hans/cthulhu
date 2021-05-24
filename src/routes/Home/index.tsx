import { Center, Heading, Image, Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import * as React from "react";
import logo from "./logo.svg";

const Home = () => (
  <Center area="content">
    <VStack p={8} borderWidth="1px" borderRadius="lg" justifyContent="center">
      <Heading size="md">creative hacking code generator</Heading>
      <Image src={logo} w={200} />
      <Link as={RouterLink} to="/generator">
        get started
      </Link>
    </VStack>
  </Center>
);

export default Home;
