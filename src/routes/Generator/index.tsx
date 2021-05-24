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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { DCMotor, Pin, Stepper } from "./code-generator/types";
import MotorSettings from "./MotorSettings";

import generate from "./code-generator/main";

type Settings = Array<DCMotor | Stepper>;

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

const getPins = (motorDef: Stepper | DCMotor) => {
  const keys = Object.keys(motorDef);

  const keyBlacklist = [
    "motorType",
    "useEndstops",
    "useTimer",
    "timer",
    "speed",
    "endstops",
  ];
  let pins = keys
    .filter((key) => !keyBlacklist.includes(key))
    .map((key) => motorDef[key]);
  if (motorDef.useEndstops) {
    pins.push(motorDef.endstops);
    pins = pins.flat(1);
  }
  return pins;
};

const checkForOverlap = (settings: Settings): Array<number> => {
  const allPins = settings.map((motor) => getPins(motor)).flat(1);

  let overlaps: Array<Pin> = [];

  allPins.reduce((acc, currentPin) => {
    if (!acc.includes(currentPin)) {
      return [...acc, currentPin];
    } else {
      if (!overlaps.includes(currentPin)) {
        overlaps.push(currentPin);
      }
      return acc;
    }
  }, []);

  console.log(overlaps);
  return overlaps;
};

const Generator = () => {
  const [settings, setSettings] = useState<Settings>([
    motor1Template,
    motor2Template,
  ]);

  const [overlaps, setOverlaps] = useState<Array<Pin>>([]);

  useEffect(() => {
    const generated = generate(settings);
    setCode(generated);

    const overlaps = checkForOverlap(settings);
    setOverlaps(overlaps);
  }, [settings]);

  const handleChange = (data: DCMotor | Stepper, index: number) => {
    if (index >= settings.length) {
      setSettings([...settings, data]);
    } else {
      const newSettings = [...settings];
      newSettings[index] = data;
      setSettings(newSettings);
    }
  };

  const handleRemove = (i: number) => {
    const newSettings = [...settings];
    newSettings.splice(i, 1);
    setSettings(newSettings);
  };

  const handleAdd = (type: "DC" | "STEPPER") => {
    const newMotor = type === "STEPPER" ? motor1Template : motor2Template;
    const newSettings = [...settings, newMotor];
    setSettings(newSettings);
  };

  const [code, setCode] = useState("");

  const clipboard = useClipboard();

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  const handleLoad = () => {
    const itemString = localStorage.getItem("settings");
    if (itemString) {
      try {
        const newSettings = JSON.parse(itemString);
        if (newSettings) {
          setSettings(newSettings);
        }
      } catch (e) {
        console.log(e);
        setSettings([]);
      }
    }
  };

  return (
    <HStack w="100%" h="100%" area="content" align="baseline">
      <VStack minW={400} align="baseline" p={4} spacing="20px">
        <HStack w="100%">
          <Heading size="md">generator</Heading>
          <Spacer />

          <Button
            variant="link"
            colorScheme="red"
            onClick={() => setSettings([])}
          >
            clear
          </Button>
        </HStack>
        <Box bg="yellow.200" w="100%" minH={2}></Box>

        <HStack w="100%">
          <Text>add motor:</Text>
          <Spacer />
          <Button
            variant="link"
            onClick={() => {
              handleAdd("DC");
            }}
          >
            dc
          </Button>
          <Button
            variant="link"
            onClick={() => {
              handleAdd("STEPPER");
            }}
          >
            stepper
          </Button>
        </HStack>
        {overlaps.length > 0 ? (
          <Box bg="red.400" w="100%" p={4}>
            <Text>overlapping pins: {overlaps.join(", ")}</Text>
          </Box>
        ) : (
          <Text color="green">no conflicts</Text>
        )}

        <VStack minW={200} align="baseline" p={0} spacing={4} w="100%">
          {settings.map((elem, i) => (
            <MotorSettings
              settings={elem}
              index={i}
              onSettingsChange={(data) => handleChange(data, i)}
              onRemove={() => handleRemove(i)}
              key={`motor-${i}`}
            />
          ))}
        </VStack>
      </VStack>

      <VStack flex="1" p={4} align="baseline" h="100%" spacing="20px">
        <HStack w="100%">
          <Heading size="md">preview</Heading>
          <Spacer />

          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => clipboard.copy(code)}
          >
            copy
          </Button>
          <Button variant="link" colorScheme="green" onClick={handleSave}>
            save
          </Button>
          <Button variant="link" colorScheme="yellow" onClick={handleLoad}>
            load
          </Button>
        </HStack>
        <Box bg="blue.200" w="100%" minH={2}></Box>
        <Box minH={10} w="100%">
          <Text
            border="1px"
            borderColor="gray.200"
            p={2}
            as={SyntaxHighlighter}
            language="arduino"
          >
            {code}
          </Text>
        </Box>
      </VStack>
    </HStack>
  );
};

export default Generator;
