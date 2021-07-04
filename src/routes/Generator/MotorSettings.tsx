import {
  Heading,
  HStack,
  VStack,
  Spacer,
  Checkbox,
  Button,
} from '@chakra-ui/react';

import * as React from 'react';
import { DCMotor, Stepper } from './code-generator/types';

import InputField from './InputField';

interface SettingsProps {
  settings: DCMotor | Stepper;
  index: number;
  onSettingsChange: (data: DCMotor | Stepper) => void;
  onRemove: () => void;
}

const Settings = ({
  settings,
  index,
  onSettingsChange,
  onRemove,
}: SettingsProps):JSX.Element => {
  const handleInputChange = (name: string, data: number | boolean | null) => {
    const key = name.split('-');
    const newMotorSettings = { ...settings };
    if (newMotorSettings[key[0]] !== undefined) {
      if (key.length === 1) {
        newMotorSettings[key[0]] = data;
      } else {
        const newArr = [...newMotorSettings[key[0]] as Array<number>];
        const arrayIndex = parseInt(key[1], 10);
        if (arrayIndex < newArr.length) {
          newArr[arrayIndex] = data as number;
          newMotorSettings[key[0]] = newArr;
        }
      }
      onSettingsChange(newMotorSettings);
    }
  };

  return (
    <VStack minW={200} align="baseline" w="100%" spacing={4}>
      <HStack w="100%">
        <Heading size="sm">
          {`[${index + 1}] ${settings.motorType}`}
          {' '}
        </Heading>
        <Spacer />
        <Button variant="link" onClick={onRemove}>
          delete
        </Button>
      </HStack>

      <InputField
        title="pin1"
        value={settings.pin1}
        update={(data) => handleInputChange('pin1', data)}
      />

      <InputField
        title="pin2"
        value={settings.pin2}
        update={(data) => handleInputChange('pin2', data)}
      />

      {settings.motorType === 'DC' ? (
        <InputField
          title="pin3"
          value={settings.pin3}
          update={(data) => handleInputChange('pin3', data)}
        />
      ) : null}

      <Checkbox
        checked={settings.useTimer}
        onChange={(e) => handleInputChange('useTimer', e.target.checked)}
      >
        timer
      </Checkbox>

      {settings.useTimer ? (
        <InputField
          title="timer"
          value={settings.timer || -1}
          update={(data) => handleInputChange('timer', data)}
          steps={100}
        />
      ) : null}

      <Checkbox
        checked={settings.useEndstops}
        onChange={(e) => handleInputChange('useEndstops', e.target.checked)}
      >
        endstops
      </Checkbox>

      {settings.useEndstops ? (
        <>
          <InputField
            title="endstop1"
            value={settings.endstops ? settings.endstops[0] : -1}
            update={(data) => handleInputChange('endstops-0', data)}
          />

          <InputField
            title="endstop2"
            value={settings.endstops ? settings.endstops[1] : -1}
            update={(data) => handleInputChange('endstops-1', data)}
          />
        </>
      ) : null}
    </VStack>
  );
};

export default Settings;
