import {
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  Spacer,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";

import * as React from "react";

interface InputFieldProps {
  value: number;
  update: (data: number | null) => void;
  title: string;
  steps?: number;
}

const InputField = ({ value, update, title, steps }: InputFieldProps) => {
  const updateVal = (e: string) => {
    if (e.length) {
      update(parseInt(e));
    }
  };
  return (
    <HStack w="100%">
      <Text>{title}</Text>
      <Spacer />

      <NumberInput
        size="md"
        w={40}
        min={0}
        value={value}
        onChange={updateVal}
        step={steps || 1}
      >
        <NumberInputField textAlign="right" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  );
};

export default InputField;
