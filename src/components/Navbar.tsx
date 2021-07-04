import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Link, HStack, Spacer } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const Navbar = () => (
  <HStack align="center" bg="gray.200" p={4} position="fixed">
    <Link as={RouterLink} to="/">
      home
    </Link>
    <Link as={RouterLink} to="/generator">
      generator
    </Link>
    <Link as={RouterLink} to="/about">
      about
    </Link>
    <Spacer />
    <ColorModeSwitcher />
  </HStack>
);

export default Navbar;
