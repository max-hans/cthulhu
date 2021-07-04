import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure,
  HStack,
  Spacer,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { CityIcon } from "../res/Icons";

interface HeaderProps {}

const Header = (props: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack
        as="nav"
        padding={4}
        bg="main.bg"
        color="white"
        spacing={8}
        {...props}
      >
        <Heading as="h1" size="md">
          code generator
        </Heading>
        <Spacer />

        <Link isExternal href="https://github.com/max-hans/cthulhu-web">
          github
        </Link>
        <Button variant="link" color="white" onClick={onOpen}>
          about
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>about this tool</ModalHeader>
          <ModalCloseButton />
          <ModalBody size="lg">
            <VStack spacing={8} w="100%">
              <CityIcon w={40} h={40} fill="main.gray" />
              <Text>
                This light tool is meant to create code-snippets for arduinos
                controlling multiple motors. Motors can easily be added and
                removed. The only restriction is the amount of pins available.
              </Text>

              <Text>
                The generated code is not streamlined for performance or "good
                code" but as verbose as possible for beginners who start off and
                learn about the mechanics of code.
              </Text>

              <Text>
                Created for the Creative Hacking course at the State Academy of
                Art and Design Stuttgart.
              </Text>
              <Link
                href="https://github.com/max-hans/cthulhu-web"
                color="blue.400"
                isExternal
              >
                visit on github
              </Link>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
