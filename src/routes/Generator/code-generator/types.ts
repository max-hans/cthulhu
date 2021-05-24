export type MotorConfig = {
  motorType: MotorType;
  pin1: Pin;
  pin2: Pin;
  endstop1?: Pin;
  endstop2?: Pin;
};

export type Pin = number;

export type MotorType = "STEPPER" | "DC";

export type Instruction = {
  command: Array<string>;
  location: "TOP" | "SETUP" | " LOOP";
};

export type InstructionLine = string;

export interface GenericMotor extends Record<string, any> {
  motorType: string;
  endstops: [Pin, Pin];
  timer: number;
  useTimer: boolean;
  useEndstops: boolean;
}

export interface DCMotor extends GenericMotor {
  motorType: "DC";
  pin1: Pin;
  pin2: Pin;
  pin3: Pin;
}

export interface Stepper extends GenericMotor {
  motorType: "STEPPER";
  pin1: Pin;
  pin2: Pin;
  speed: number;
}
