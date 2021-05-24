import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  Spacer,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useClipboard } from "use-clipboard-copy";

import { DCMotor, Stepper } from "./code-generator/types";
import MotorSettings from "./MotorSettings";

import generate from "./code-generator/main";

const motor1Template = {
  pin1: 1,
  pin2: 2,
  endstops: [3, 4],
  useEndstops: false,
  useTimer: false,
  timer: 1000,
  motorType: "STEPPER",
  speed: 500,
} as Stepper;

const motor2Template = {
  motorType: "DC",
  pin1: 5,
  pin2: 6,
  pin3: 7,
  useEndstops: false,
  endstops: [8, 9],
  useTimer: false,
  timer: 1000,
} as DCMotor;

const Generator = () => {
  const [settings, setSettings] = useState<Array<DCMotor | Stepper>>([
    motor1Template,
    motor2Template,
  ]);

  const handleChange = (data: DCMotor | Stepper, index: number) => {
    if (index >= settings.length) {
      setSettings([...settings, data]);
    } else {
      const newSettings = [...settings];
      newSettings[index] = data;
      setSettings(newSettings);
      const generated = generate(newSettings);
      setCode(generated);
    }
  };

  const handleRemove = (i: number) => {
    const newSettings = [...settings];
    newSettings.splice(i, 1);
    console.log(newSettings);
    setSettings(newSettings);
  };

  const handleAdd = (type: "DC" | "STEPPER") => {
    const newMotor = type === "STEPPER" ? motor1Template : motor2Template;
    const newSettings = [...settings, newMotor];
    setSettings(newSettings);
  };

  const [code, setCode] = useState("");

  const clipboard = useClipboard();

  return (
    <HStack w="100%" h="100%" area="content" align="baseline">
      <VStack minW={400} align="baseline" p={4}>
        <Heading size="md">generator</Heading>
        <Box bg="yellow.200" w="100%" minH={2}></Box>

        <HStack w="100%">
          <Text>add motor:</Text>
          <Spacer />
          <Button
            onClick={() => {
              handleAdd("DC");
            }}
          >
            dc
          </Button>
          <Button
            onClick={() => {
              handleAdd("STEPPER");
            }}
          >
            stepper
          </Button>
        </HStack>

        <VStack minW={200} align="baseline" p={0} spacing={4} w="100%">
          {settings.map((elem, i) => (
            <MotorSettings
              settings={elem}
              index={i}
              onSettingsChange={(data) => handleChange(data, i)}
              onRemove={() => handleRemove(i)}
            />
          ))}
        </VStack>
      </VStack>

      <VStack
        flex="1"
        direction="column"
        p={4}
        align="baseline"
        h="100%"
        spacing="20px"
      >
        <HStack w="100%">
          <Heading size="md">preview</Heading>
          <Spacer />
          <Button variant="link" onClick={() => clipboard.copy(code)}>
            copy
          </Button>
        </HStack>
        <Box bg="blue.200" w="100%" minH={2}></Box>
        <Box minH={10} w="100%">
          <Text border="1px" borderColor="gray.200" p={8}>
            <pre>{code}</pre>
          </Text>
        </Box>
      </VStack>
    </HStack>
  );
};

export default Generator;
