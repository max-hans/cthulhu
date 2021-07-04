import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  Spacer,
  Divider,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useClipboard } from "use-clipboard-copy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { DCMotor, Pin, Stepper } from "./code-generator/types";
import MotorSettings from "./MotorSettings";

import generate from "./code-generator/main";
import { RobotIcon } from "../../res/Icons";

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
    <HStack area="content" align="baseline" overflow="hidden">
      <VStack
        minW={400}
        align="baseline"
        p={4}
        spacing={8}
        overflow="hidden"
        maxH="100%"
      >
        <HStack w="100%">
          <Heading size="sm">configuration</Heading>
          <Spacer />

          <Button
            variant="link"
            colorScheme="black"
            onClick={() => setSettings([])}
          >
            clear
          </Button>

          <Button variant="link" colorScheme="black" onClick={handleSave}>
            save
          </Button>
          <Button variant="link" onClick={handleLoad}>
            load
          </Button>
        </HStack>

        <HStack w="100%">
          <Text>add motor</Text>
          <Spacer />
          <Button
            variant="link"
            onClick={() => {
              handleAdd("DC");
            }}
          >
            +DC
          </Button>
          <Button
            variant="link"
            onClick={() => {
              handleAdd("STEPPER");
            }}
          >
            +stepper
          </Button>
        </HStack>
        {overlaps.length > 0 ? (
          <Alert status="error">
            <AlertIcon />
            overlapping pins: {overlaps.join(", ")}
          </Alert>
        ) : (
          <Alert status="success">
            <AlertIcon />
            no conflicts
          </Alert>
        )}
        <Box flex="1" overflow="auto" minW={200} w="100%">
          <VStack
            align="baseline"
            p={2}
            spacing={4}
            w="100%"
            divider={<Divider orientation="horizontal" />}
          >
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
        </Box>
      </VStack>

      <VStack
        p={4}
        align="baseline"
        maxH="100%"
        h="100%"
        spacing={8}
        flex="1"
        overflow="hidden"
      >
        <HStack w="100%">
          <Heading size="sm">preview</Heading>
          <Spacer />

          <Button variant="link" onClick={() => clipboard.copy(code)}>
            copy
          </Button>
        </HStack>

        {settings.length ? (
          <Box w="100%" flex="1" overflow="auto" p={0}>
            <Text
              m={0}
              as={SyntaxHighlighter}
              language="arduino"
              h="100%"
              showLineNumbers={true}
              customStyle={{
                margin: "0px",
                backgroundColor: "white",
              }}
              border="2px"
              borderColor="main.gray"
            >
              {code}
            </Text>
          </Box>
        ) : (
          <Center width="100%" flex="1">
            <VStack spacing={8}>
              <RobotIcon w={20} h={20} fill="main.gray" />
              <Text color="main.gray">add motors to generate code!</Text>
            </VStack>
          </Center>
        )}
      </VStack>
    </HStack>
  );
};

export default Generator;
